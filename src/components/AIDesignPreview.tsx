import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, DESIGN_FEES, DesignComplexity } from '@/types';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface AIDesignPreviewProps {
  baseProduct: Product | null;
  designImage: string | null;
  prompt: string;
  complexity: DesignComplexity;
  isGenerating?: boolean;
}

const AIDesignPreview = ({
  baseProduct,
  designImage,
  prompt,
  complexity,
  isGenerating = false,
}: AIDesignPreviewProps) => {
  const { addToCart } = useCart();

  const designFee = DESIGN_FEES[complexity];
  const basePrice = baseProduct?.price || 0;
  const totalPrice = basePrice + designFee;

  const handleAddToCart = () => {
    if (!baseProduct || !designImage) return;

    addToCart(baseProduct, {
      prompt,
      image: designImage,
      fee: designFee,
    });

    toast.success('Custom design added to cart!');
  };

  if (!designImage && !isGenerating) {
    return (
      <div className="aspect-square rounded-2xl bg-secondary/50 border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">
          Your AI-generated design will appear here
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
    >
      {/* Design Preview */}
      <div className="aspect-square relative overflow-hidden bg-secondary">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Creating your design...</p>
          </div>
        ) : (
          <img
            src={designImage!}
            alt="AI Generated Design"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* AI Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full gradient-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          AI Generated
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          {baseProduct?.category || 'Custom Design'}
        </p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {prompt || 'Your Custom Design'}
        </h3>

        {/* Pricing Breakdown */}
        <div className="space-y-2 py-3 border-t border-b border-border my-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Price</span>
            <span className="text-foreground">${basePrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              AI Design Fee ({complexity})
            </span>
            <span className="text-primary">+${designFee}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">${totalPrice}</span>
        </div>

        <Button
          variant="gradient"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isGenerating || !designImage}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default AIDesignPreview;
