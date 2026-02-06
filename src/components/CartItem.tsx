import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
  index?: number;
}

const CartItemCard = ({ item, index = 0 }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, customDesign } = item;

  const itemPrice = product.price + (customDesign?.fee || 0);
  const totalPrice = itemPrice * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex gap-4 p-4 bg-card rounded-xl shadow-card"
    >
      {/* Image */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        <img
          src={customDesign?.image || product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {customDesign && (
          <div className="absolute top-1 left-1 p-1 rounded-full gradient-primary">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-1">
            {product.name}
          </h3>
          {customDesign && (
            <p className="text-xs text-primary mt-1 line-clamp-1">
              AI: {customDesign.prompt}
            </p>
          )}
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">${totalPrice}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;
