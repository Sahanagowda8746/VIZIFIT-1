import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UPIFormData {
  upiId: string;
  selectedApp: string;
}

interface UPIPaymentFormProps {
  data: UPIFormData;
  onChange: (data: UPIFormData) => void;
  errors?: Partial<Record<keyof UPIFormData, string>>;
}

const upiApps = [
  { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500' },
  { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600' },
  { id: 'paytm', name: 'Paytm', color: 'bg-sky-500' },
  { id: 'bhim', name: 'BHIM', color: 'bg-orange-500' },
];

const UPIPaymentForm = ({ data, onChange, errors }: UPIPaymentFormProps) => {
  return (
    <div className="space-y-6">
      {/* Popular UPI Apps */}
      <div>
        <Label className="mb-3 block">Pay using UPI Apps</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {upiApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onChange({ ...data, selectedApp: app.id, upiId: '' })}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/50 hover:bg-accent/50",
                data.selectedApp === app.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", app.color)}>
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or pay with UPI ID</span>
        </div>
      </div>

      {/* UPI ID Input */}
      <div>
        <Label htmlFor="upiId">Enter UPI ID</Label>
        <Input
          id="upiId"
          placeholder="yourname@upi"
          value={data.upiId}
          onChange={(e) => onChange({ ...data, upiId: e.target.value, selectedApp: '' })}
          className={errors?.upiId ? 'border-destructive' : ''}
        />
        {errors?.upiId && (
          <p className="text-sm text-destructive mt-1">{errors.upiId}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Example: username@okicici, mobile@paytm
        </p>
      </div>

      {/* QR Code Option */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center border">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Scan QR to Pay</p>
            <p className="text-sm text-muted-foreground">Use any UPI app to scan and pay instantly</p>
          </div>
          <Button variant="outline" size="sm" type="button">
            Show QR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentForm;
