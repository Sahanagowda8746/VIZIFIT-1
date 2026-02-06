import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCustomize = () => {
    navigate(`/ai-studio?product=${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button
            variant="secondary"
            className="flex-1 bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={handleBuyNow}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
          <Button
            variant="gradient"
            className="flex-1"
            onClick={handleCustomize}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Design
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">
            ${product.price}
          </span>
          {product.isAIDesign && (
            <span className="text-xs px-2 py-1 rounded-full gradient-primary text-primary-foreground">
              AI Design
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
