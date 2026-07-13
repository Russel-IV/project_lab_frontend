import { useOutletContext } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileResponse, PaymentMethodResponse } from '@/api/profile';
import type {
  GeneralInfoFormValues,
  PersonalInfoFormValues,
  PaymentMethodFormValues,
  ChangePasswordFormValues,
} from './profileSchema';

export interface AccountSettingsContextValue {
  profile: ProfileResponse;
  paymentMethods: PaymentMethodResponse[];

  generalInfoForm: UseFormReturn<GeneralInfoFormValues>;
  personalInfoForm: UseFormReturn<PersonalInfoFormValues>;
  paymentMethodForm: UseFormReturn<PaymentMethodFormValues>;
  changePasswordForm: UseFormReturn<ChangePasswordFormValues>;

  uploadingPicture: boolean;
  pictureError: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleSaveGeneralInfo: (values: GeneralInfoFormValues) => Promise<void>;
  handleSavePersonalInfo: (values: PersonalInfoFormValues) => Promise<void>;

  handleAddPaymentMethod: (values: PaymentMethodFormValues) => Promise<void>;
  handleSetDefaultPaymentMethod: (id: number) => Promise<void>;
  handleDeletePaymentMethod: (id: number) => Promise<void>;
  paymentMethodActionError: string | null;

  passwordChangeSuccess: boolean;
  handleChangePassword: (values: ChangePasswordFormValues) => Promise<void>;

  deletingAccount: boolean;
  deleteAccountError: string | null;
  handleDeleteAccount: () => Promise<void>;
}

export function useAccountSettingsContext() {
  return useOutletContext<AccountSettingsContextValue>();
}
