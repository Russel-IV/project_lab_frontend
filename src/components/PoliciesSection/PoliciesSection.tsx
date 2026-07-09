import { Badge } from '@/components/ui/badge';
import {
  formatPolicyTime,
  getCancellationPolicyText,
  splitToBullets,
} from '@/utils/format';
import type { GetStayDetailsQuery } from '@/types/__generated__/graphql';

type StayFields = NonNullable<GetStayDetailsQuery['stay']>;

/**
 * Check-in/check-out times and house-rule booleans aren't in the backend
 * schema yet (see plan: synthetic-beaming-breeze). Declared here, separate
 * from the generated GraphQL types, so this component is ready to receive
 * them via GET_STAY_DETAILS once the backend ships them, without requiring
 * a codegen run against a schema that doesn't have the fields yet.
 */
interface PendingPolicyFields {
  checkInTimeFrom?: string | null;
  checkInTimeUntil?: string | null;
  checkOutTime?: string | null;
  allowsPets?: boolean | null;
  allowsSmoking?: boolean | null;
  allowsParties?: boolean | null;
  houseRulesText?: string | null;
}

export type PoliciesSectionStay = Pick<
  StayFields,
  | 'isRefundable'
  | 'daysFromBookingCancellationDeadline'
  | 'policiesText'
  | 'importantInformation'
> &
  PendingPolicyFields;

interface PoliciesSectionProps {
  stay: PoliciesSectionStay;
  checkIn?: string;
}

const HOUSE_RULES: Array<{
  key: 'allowsPets' | 'allowsSmoking' | 'allowsParties';
  label: string;
}> = [
  { key: 'allowsPets', label: 'Pets' },
  { key: 'allowsSmoking', label: 'Smoking' },
  { key: 'allowsParties', label: 'Parties' },
];

export function PoliciesSection({ stay, checkIn }: PoliciesSectionProps) {
  const hasCheckInTimes = Boolean(stay.checkInTimeFrom && stay.checkOutTime);
  const cancellationText = getCancellationPolicyText(
    stay.isRefundable,
    stay.daysFromBookingCancellationDeadline,
    checkIn,
  );
  const definedHouseRules = HOUSE_RULES.filter(({ key }) => stay[key] != null);
  const houseRuleBullets = splitToBullets(stay.houseRulesText);
  const policyBullets = splitToBullets(stay.policiesText);
  const importantInfoBullets = splitToBullets(stay.importantInformation);

  return (
    <div className="flex flex-col gap-5 text-sm">
      {hasCheckInTimes && (
        <div className="space-y-1.5">
          <h4 className="font-semibold text-foreground">
            Check-in / Check-out
          </h4>
          <p className="text-muted-foreground">
            Check-in from {formatPolicyTime(stay.checkInTimeFrom as string)}
            {stay.checkInTimeUntil &&
              `, until ${formatPolicyTime(stay.checkInTimeUntil)}`}
          </p>
          <p className="text-muted-foreground">
            Check-out before {formatPolicyTime(stay.checkOutTime as string)}
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <h4 className="font-semibold text-foreground">Cancellation Policy</h4>
        <p className="text-muted-foreground">{cancellationText}</p>
        {policyBullets.length > 0 && (
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {policyBullets.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        )}
      </div>

      {(definedHouseRules.length > 0 || houseRuleBullets.length > 0) && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">House Rules</h4>
          {definedHouseRules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {definedHouseRules.map(({ key, label }) => (
                <Badge key={key} variant={stay[key] ? 'outline' : 'secondary'}>
                  {stay[key] ? label : `No ${label.toLowerCase()}`}
                </Badge>
              ))}
            </div>
          )}
          {houseRuleBullets.length > 0 && (
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {houseRuleBullets.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {importantInfoBullets.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">
            Important Information
          </h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {importantInfoBullets.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
