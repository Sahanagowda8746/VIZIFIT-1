import { Truck, Info, CheckCircle2 } from 'lucide-react';

const CODOption = () => {
  return (
    <div className="space-y-4">
      <div className="bg-primary/10 rounded-xl p-4 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Truck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-primary">Cash on Delivery Selected</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Pay with cash when your order is delivered to your doorstep.
          </p>
        </div>
      </div>

      <ul className="space-y-3 list-none">
        <li className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>No extra charges for COD orders</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Pay only when you receive your order</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>Check your items before paying</span>
        </li>
      </ul>

      <div className="bg-accent rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Please keep the exact amount ready for a smooth delivery experience. Our delivery partner may not have change for large denominations.
        </p>
      </div>
    </div>
  );
};

export default CODOption;
