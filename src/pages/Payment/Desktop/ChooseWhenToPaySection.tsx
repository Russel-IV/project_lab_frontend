import { useFormContext } from 'react-hook-form';
import { formatPrice } from '@/utils/format';

interface ChooseWhenToPaySectionProps {
  totalPayable: number;
  formattedCancelDate: string;
}

export default function ChooseWhenToPaySection({
  totalPayable,
  formattedCancelDate,
}: ChooseWhenToPaySectionProps) {
  const { register } = useFormContext();

  return (
    <div className="px-6 pb-6 border-t border-neutral-100 pt-5 flex flex-col gap-4">
      {/* Pay now */}
      <label className="border border-neutral-300 rounded-xl p-4 flex items-start gap-3 cursor-pointer select-none has-checked:border-frui-orange has-checked:bg-frui-cream/20">
        <input
          type="radio"
          value="now"
          {...register('payWhen')}
          className="mt-1 accent-frui-orange"
        />
        <div>
          <span className="font-bold text-sm text-frui-blue block">
            Pay {formatPrice(totalPayable)} now
          </span>
          <span className="text-xs text-neutral-400 mt-0.5 block">
            Pay total amount today to finalize reservation details.
          </span>
        </div>
      </label>

      {/* Pay later */}
      <label className="border border-neutral-300 rounded-xl p-4 flex items-start gap-3 cursor-pointer select-none has-checked:border-frui-orange has-checked:bg-frui-cream/20">
        <input
          type="radio"
          value="later"
          {...register('payWhen')}
          className="mt-1 accent-frui-orange"
        />
        <div>
          <span className="font-bold text-sm text-frui-blue block">
            Pay $0 today
          </span>
          <span className="text-xs text-neutral-400 mt-0.5 block">
            No immediate charges. Full amount of {formatPrice(totalPayable)}{' '}
            will be collected on {formattedCancelDate}.
          </span>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            No additional fees. Learn more
          </span>
        </div>
      </label>
    </div>
  );
}
