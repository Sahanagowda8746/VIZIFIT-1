import { useState } from 'react';
import { Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  onApplyCoupon: (code: string) => void;
  couponApplied?: string;
}

const OrderSummary = ({ items, subtotal, discount, onApplyCoupon, couponApplied }: OrderSummaryProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [showItems, setShowItems] = useState(true);
  
  const shipping = 0; // Free shipping
  const finalAmount = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim().toUpperCase());
      setCouponCode('');
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Collapsible Items List */}
      <button
        type="button"
        onClick={() => setShowItems(!showItems)}
        className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{items.length} item(s) in cart</span>
        {showItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showItems && (
        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1 mb-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src={item.customDesign?.image || item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                {item.customDesign && (
                  <p className="text-xs text-primary">+ AI Design</p>
                )}
              </div>
              <span className="font-medium text-sm">
                ${((item.product.price + (item.customDesign?.fee || 0)) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Section */}
      <div className="border-t border-border pt-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="pl-10"
              disabled={!!couponApplied}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={!!couponApplied || !couponCode.trim()}
          >
            Apply
          </Button>
        </div>
        {couponApplied && (
          <p className="text-sm text-primary mt-2 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Coupon "{couponApplied}" applied!
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm text-primary">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-primary">Free</span>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">${finalAmount.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <p className="text-xs text-primary mt-1">
              You're saving ${discount.toFixed(2)} on this order!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
