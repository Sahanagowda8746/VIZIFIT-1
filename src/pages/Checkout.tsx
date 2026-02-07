import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import PaymentMethodSelector, { PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import CardPaymentForm from '@/components/checkout/CardPaymentForm';
import UPIPaymentForm from '@/components/checkout/UPIPaymentForm';
import NetBankingForm from '@/components/checkout/NetBankingForm';
import WalletPaymentForm from '@/components/checkout/WalletPaymentForm';
import CODOption from '@/components/checkout/CODOption';
import OrderSummary from '@/components/checkout/OrderSummary';
import ShippingForm from '@/components/checkout/ShippingForm';

// Coupon codes (in real app, this would be from backend)
const COUPON_CODES: Record<string, number> = {
  'SAVE10': 10,
  'VIZIFIT20': 20,
  'FIRST50': 50,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discount, setDiscount] = useState(0);

  // Form states
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [upiForm, setUpiForm] = useState({
    upiId: '',
    selectedApp: '',
  });

  const [netBankingForm, setNetBankingForm] = useState({
    selectedBank: '',
  });

  const [walletForm, setWalletForm] = useState({
    selectedWallet: '',
  });

  // Validation errors
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const handleApplyCoupon = (code: string) => {
    if (COUPON_CODES[code]) {
      const discountAmount = (totalPrice * COUPON_CODES[code]) / 100;
      setDiscount(discountAmount);
      setAppliedCoupon(code);
      toast.success(`Coupon applied! You saved $${discountAmount.toFixed(2)}`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const validateShipping = () => {
    const errors: Record<string, string> = {};
    if (!shippingForm.name.trim()) errors.name = 'Name is required';
    if (!shippingForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) errors.email = 'Invalid email format';
    if (!shippingForm.phone.trim()) errors.phone = 'Phone is required';
    if (!shippingForm.address.trim()) errors.address = 'Address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.state.trim()) errors.state = 'State is required';
    if (!shippingForm.zip.trim()) errors.zip = 'PIN code is required';
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    const errors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!cardForm.cardNumber.replace(/\s/g, '') || cardForm.cardNumber.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Valid card number is required';
      }
      if (!cardForm.cardHolder.trim()) errors.cardHolder = 'Card holder name is required';
      if (!cardForm.expiry || cardForm.expiry.length < 5) errors.expiry = 'Valid expiry date is required';
      if (!cardForm.cvv || cardForm.cvv.length < 3) errors.cvv = 'Valid CVV is required';
    } else if (paymentMethod === 'upi') {
      if (!upiForm.upiId && !upiForm.selectedApp) {
        errors.upiId = 'Please select a UPI app or enter UPI ID';
      } else if (upiForm.upiId && !upiForm.upiId.includes('@')) {
        errors.upiId = 'Invalid UPI ID format (e.g., name@upi)';
      }
    } else if (paymentMethod === 'netbanking') {
      if (!netBankingForm.selectedBank) errors.selectedBank = 'Please select a bank';
    } else if (paymentMethod === 'wallet') {
      if (!walletForm.selectedWallet) errors.selectedWallet = 'Please select a wallet';
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isShippingValid = validateShipping();
    const isPaymentValid = validatePayment();

    if (!isShippingValid || !isPaymentValid) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Create order
    const finalAmount = totalPrice - discount;
    const order = {
      id: crypto.randomUUID(),
      items: [...items],
      total: finalAmount,
      date: new Date().toISOString(),
      status: 'processing' as const,
    };

    addOrder(order);
    clearCart();
    setIsProcessing(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We'll send you an email confirmation with tracking details.
          </p>
          {discount > 0 && (
            <p className="text-primary font-medium mb-6">
              You saved ${discount.toFixed(2)} on this order!
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/orders')}>
              View Orders
            </Button>
            <Button variant="gradient" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr,400px] gap-8 max-w-6xl mx-auto">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Shipping Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ShippingForm
                  data={shippingForm}
                  onChange={setShippingForm}
                  errors={shippingErrors}
                />
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl shadow-card p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Method
                </h2>
                
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={(method) => {
                    setPaymentMethod(method);
                    setPaymentErrors({});
                  }}
                />
              </motion.div>

              {/* Payment Form based on selected method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl shadow-card p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                
                {paymentMethod === 'card' && (
                  <CardPaymentForm
                    data={cardForm}
                    onChange={setCardForm}
                    errors={paymentErrors}
                  />
                )}
                
                {paymentMethod === 'upi' && (
                  <UPIPaymentForm
                    data={upiForm}
                    onChange={setUpiForm}
                    errors={paymentErrors}
                  />
                )}
                
                {paymentMethod === 'netbanking' && (
                  <NetBankingForm
                    data={netBankingForm}
                    onChange={setNetBankingForm}
                    errors={paymentErrors}
                  />
                )}
                
                {paymentMethod === 'wallet' && (
                  <WalletPaymentForm
                    data={walletForm}
                    onChange={setWalletForm}
                    errors={paymentErrors}
                  />
                )}
                
                {paymentMethod === 'cod' && <CODOption />}
              </motion.div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay $${(totalPrice - discount).toFixed(2)}`
                )}
              </Button>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <OrderSummary
                items={items}
                subtotal={totalPrice}
                discount={discount}
                onApplyCoupon={handleApplyCoupon}
                couponApplied={appliedCoupon}
              />
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
