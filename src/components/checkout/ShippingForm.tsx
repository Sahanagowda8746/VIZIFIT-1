import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface ShippingFormProps {
  data: ShippingFormData;
  onChange: (data: ShippingFormData) => void;
  errors?: Partial<Record<keyof ShippingFormData, string>>;
}

const ShippingForm = ({ data, onChange, errors }: ShippingFormProps) => {
  const handleChange = (field: keyof ShippingFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-primary" />
        Shipping Information
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors?.name ? 'border-destructive' : ''}
              placeholder="John Doe"
            />
            {errors?.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors?.email ? 'border-destructive' : ''}
              placeholder="john@example.com"
            />
            {errors?.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={errors?.phone ? 'border-destructive' : ''}
            placeholder="+91 98765 43210"
          />
          {errors?.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={errors?.address ? 'border-destructive' : ''}
            placeholder="123 Main Street, Apartment 4B"
          />
          {errors?.address && (
            <p className="text-sm text-destructive mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={errors?.city ? 'border-destructive' : ''}
              placeholder="Mumbai"
            />
            {errors?.city && (
              <p className="text-sm text-destructive mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={errors?.state ? 'border-destructive' : ''}
              placeholder="Maharashtra"
            />
            {errors?.state && (
              <p className="text-sm text-destructive mt-1">{errors.state}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <Label htmlFor="zip">PIN Code *</Label>
            <Input
              id="zip"
              value={data.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              className={errors?.zip ? 'border-destructive' : ''}
              placeholder="400001"
            />
            {errors?.zip && (
              <p className="text-sm text-destructive mt-1">{errors.zip}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
