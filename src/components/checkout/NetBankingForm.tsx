import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetBankingFormData {
  selectedBank: string;
}

interface NetBankingFormProps {
  data: NetBankingFormData;
  onChange: (data: NetBankingFormData) => void;
  errors?: Partial<Record<keyof NetBankingFormData, string>>;
}

const popularBanks = [
  { id: 'sbi', name: 'State Bank of India', color: 'bg-blue-600' },
  { id: 'hdfc', name: 'HDFC Bank', color: 'bg-red-600' },
  { id: 'icici', name: 'ICICI Bank', color: 'bg-orange-600' },
  { id: 'axis', name: 'Axis Bank', color: 'bg-purple-600' },
  { id: 'kotak', name: 'Kotak Mahindra', color: 'bg-red-500' },
  { id: 'pnb', name: 'Punjab National Bank', color: 'bg-amber-600' },
];

const otherBanks = [
  { id: 'bob', name: 'Bank of Baroda' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'union', name: 'Union Bank of India' },
  { id: 'idbi', name: 'IDBI Bank' },
  { id: 'yes', name: 'Yes Bank' },
  { id: 'indusind', name: 'IndusInd Bank' },
  { id: 'federal', name: 'Federal Bank' },
  { id: 'rbl', name: 'RBL Bank' },
];

const NetBankingForm = ({ data, onChange, errors }: NetBankingFormProps) => {
  return (
    <div className="space-y-6">
      {/* Popular Banks */}
      <div>
        <Label className="mb-3 block">Popular Banks</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {popularBanks.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => onChange({ selectedBank: bank.id })}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                "hover:border-primary/50 hover:bg-accent/50",
                data.selectedBank === bank.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0", bank.color)}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium line-clamp-2">{bank.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Other Banks Dropdown */}
      <div>
        <Label htmlFor="otherBank" className="mb-2 block">Other Banks</Label>
        <Select
          value={otherBanks.find(b => b.id === data.selectedBank)?.id || ''}
          onValueChange={(val) => onChange({ selectedBank: val })}
        >
          <SelectTrigger className={errors?.selectedBank ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            {otherBanks.map((bank) => (
              <SelectItem key={bank.id} value={bank.id}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.selectedBank && (
          <p className="text-sm text-destructive mt-1">{errors.selectedBank}</p>
        )}
      </div>

      <div className="bg-secondary/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          You will be redirected to your bank's secure payment page to complete the transaction.
        </p>
      </div>
    </div>
  );
};

export default NetBankingForm;
