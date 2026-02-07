import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock } from 'lucide-react';

interface CardFormData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

interface CardPaymentFormProps {
  data: CardFormData;
  onChange: (data: CardFormData) => void;
  errors?: Partial<Record<keyof CardFormData, string>>;
}

const formatCardNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  const groups = numbers.match(/.{1,4}/g);
  return groups ? groups.join(' ').substring(0, 19) : '';
};

const formatExpiry = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length >= 2) {
    return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
  }
  return numbers;
};

const CardPaymentForm = ({ data, onChange, errors }: CardPaymentFormProps) => {
  const handleChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    onChange({ ...data, [field]: formattedValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Lock className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={data.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            className={errors?.cardNumber ? 'border-destructive' : ''}
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        {errors?.cardNumber && (
          <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cardHolder">Card Holder Name</Label>
        <Input
          id="cardHolder"
          placeholder="John Doe"
          value={data.cardHolder}
          onChange={(e) => handleChange('cardHolder', e.target.value)}
          className={errors?.cardHolder ? 'border-destructive' : ''}
        />
        {errors?.cardHolder && (
          <p className="text-sm text-destructive mt-1">{errors.cardHolder}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={data.expiry}
            onChange={(e) => handleChange('expiry', e.target.value)}
            maxLength={5}
            className={errors?.expiry ? 'border-destructive' : ''}
          />
          {errors?.expiry && (
            <p className="text-sm text-destructive mt-1">{errors.expiry}</p>
          )}
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            type="password"
            value={data.cvv}
            onChange={(e) => handleChange('cvv', e.target.value)}
            maxLength={4}
            className={errors?.cvv ? 'border-destructive' : ''}
          />
          {errors?.cvv && (
            <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
      </div>
    </div>
  );
};

export default CardPaymentForm;
