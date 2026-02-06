import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CartItemCard from '@/components/CartItem';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start adding some amazing pieces!</p>
          <Link to="/shop">
            <Button variant="gradient">Browse Collection</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <CartItemCard key={item.product.id} item={item} index={index} />
              ))}
            </AnimatePresence>

            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 py-4 border-t border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center my-4">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button variant="hero" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by VIZIFIT
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
