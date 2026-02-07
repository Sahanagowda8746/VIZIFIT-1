import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletFormData {
  selectedWallet: string;
}

interface WalletPaymentFormProps {
  data: WalletFormData;
  onChange: (data: WalletFormData) => void;
  errors?: Partial<Record<keyof WalletFormData, string>>;
}

const wallets = [
  { id: 'paytm', name: 'Paytm Wallet', color: 'bg-sky-500' },
  { id: 'mobikwik', name: 'Mobikwik', color: 'bg-blue-600' },
  { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-amber-500' },
  { id: 'freecharge', name: 'Freecharge', color: 'bg-purple-600' },
  { id: 'airtel', name: 'Airtel Payments', color: 'bg-red-600' },
  { id: 'jio', name: 'JioMoney', color: 'bg-blue-800' },
];

const WalletPaymentForm = ({ data, onChange, errors }: WalletPaymentFormProps) => {
  return (
    <div className="space-y-4">
      <Label className="block">Select Wallet</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            type="button"
            onClick={() => onChange({ selectedWallet: wallet.id })}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-accent/50",
              data.selectedWallet === wallet.id
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", wallet.color)}>
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-center">{wallet.name}</span>
          </button>
        ))}
      </div>

      {errors?.selectedWallet && (
        <p className="text-sm text-destructive mt-1">{errors.selectedWallet}</p>
      )}

      <div className="bg-secondary/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          You'll be redirected to {data.selectedWallet ? wallets.find(w => w.id === data.selectedWallet)?.name : 'the wallet'} to complete payment securely.
        </p>
      </div>
    </div>
  );
};

export default WalletPaymentForm;
