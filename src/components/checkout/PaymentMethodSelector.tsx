import { CreditCard, Smartphone, Building2, Wallet, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: 'card' as const,
    label: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: CreditCard,
  },
  {
    id: 'upi' as const,
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm',
    icon: Smartphone,
  },
  {
    id: 'netbanking' as const,
    label: 'Net Banking',
    description: 'All major banks supported',
    icon: Building2,
  },
  {
    id: 'wallet' as const,
    label: 'Wallets',
    description: 'Paytm, Mobikwik, Amazon Pay',
    icon: Wallet,
  },
  {
    id: 'cod' as const,
    label: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: Truck,
  },
];

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as PaymentMethod)}
      className="grid gap-3"
    >
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = value === method.id;
        
        return (
          <div key={method.id}>
            <RadioGroupItem
              value={method.id}
              id={method.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={method.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                "hover:border-primary/50 hover:bg-accent/50",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
