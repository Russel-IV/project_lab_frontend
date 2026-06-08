import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type FilterProps = React.HTMLAttributes<HTMLDivElement>;

export function Filter({ className, ...props }: FilterProps) {
  return (
    <div
      className={cn(
        'w-full md:w-[280px] shrink-0 flex flex-col gap-8 bg-card p-6 rounded-xl border border-border',
        className,
      )}
      {...props}
    >
      {/* Section 1: Popular filters */}
      <div className="flex flex-col gap-3.5">
        <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
          Popular filters
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Checkbox id="pop-breakfast" />
            <label
              htmlFor="pop-breakfast"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Breakfast included (74)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="pop-pool" />
            <label
              htmlFor="pop-pool"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Pool (82)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="pop-hotel" />
            <label
              htmlFor="pop-hotel"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Hotel (75)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="pop-pay-later" />
            <label
              htmlFor="pop-pay-later"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Reserve now, pay later (43)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="pop-all-inclusive" />
            <label
              htmlFor="pop-all-inclusive"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              All inclusive (24)
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Meal plans available */}
      <div className="flex flex-col gap-3.5">
        <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
          Meal plans available
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Checkbox id="meal-breakfast" />
            <label
              htmlFor="meal-breakfast"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Breakfast included (74)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="meal-all-inclusive" />
            <label
              htmlFor="meal-all-inclusive"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              All inclusive (24)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="meal-lunch" />
            <label
              htmlFor="meal-lunch"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Lunch included
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="meal-dinner" />
            <label
              htmlFor="meal-dinner"
              className="text-sm text-foreground font-medium cursor-pointer"
            >
              Dinner included
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Star rating */}
      <div className="flex flex-col gap-3.5">
        <div className="flex justify-between items-baseline">
          <h3 className="font-bold text-foreground text-sm tracking-tight m-0">
            Star rating
          </h3>
          <span className="text-xs font-bold text-foreground">From</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Checkbox id="star-5" />
              <label
                htmlFor="star-5"
                className="text-sm text-foreground font-medium cursor-pointer"
              >
                5 stars (19)
              </label>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              CLP 2.468.386
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Checkbox id="star-4" />
              <label
                htmlFor="star-4"
                className="text-sm text-foreground font-medium cursor-pointer"
              >
                4 stars (41)
              </label>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              CLP 1.475.838
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <Checkbox id="star-3" />
              <label
                htmlFor="star-3"
                className="text-sm text-foreground font-medium cursor-pointer"
              >
                3 stars (21)
              </label>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              CLP 947.548
            </span>
          </div>
        </div>
      </div>

      {/* Bottom link: See more */}
      <button className="text-left text-sm font-semibold text-primary hover:underline cursor-pointer border-0 bg-transparent p-0">
        See more
      </button>
    </div>
  );
}
