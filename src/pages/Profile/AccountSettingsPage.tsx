import { useEffect, useState } from 'react';
import {
  useNavigate,
  useMatch,
  Outlet,
  type NavigateFunction,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUserInfo, logout } from '@/store/authSlice';
import type { AppDispatch } from '@/store';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
  deleteAccount,
  getPaymentMethods,
  savePaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  ProfileValidationError,
  PaymentMethodValidationError,
  ChangePasswordValidationError,
  UnauthorizedError,
  type ProfileResponse,
  type PaymentMethodResponse,
} from '@/api/profile';
import {
  generalInfoSchema,
  personalInfoSchema,
  paymentMethodSchema,
  changePasswordSchema,
  type GeneralInfoFormValues,
  type PersonalInfoFormValues,
  type PaymentMethodFormValues,
  type ChangePasswordFormValues,
} from './profileSchema';
import type { AccountSettingsContextValue } from './AccountSettingsContext';
import { Seo } from '@/lib/seo';
import { cn } from '@/lib/utils';

const emptyPaymentMethodValues: PaymentMethodFormValues = {
  cardholderName: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
};

const emptyChangePasswordValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const TABS = [
  { value: 'my-profile', label: 'My Profile' },
  { value: 'payment', label: 'Payment Settings' },
  { value: 'privacy', label: 'Privacy Settings' },
  { value: 'delete', label: 'Delete Account' },
] as const;

function handleUnauthorized(
  err: unknown,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
): boolean {
  if (!(err instanceof UnauthorizedError)) return false;
  dispatch(logout());
  navigate('/login', { replace: true });
  return true;
}

export default function AccountSettingsPage() {
  const authToken = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const match = useMatch('/profile/:tab');
  const activeTab = match?.params.tab ?? 'my-profile';

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { replace: true });
    }
  }, [authToken, navigate]);

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) return;
    let cancelled = false;

    Promise.all([getProfile(authToken), getPaymentMethods(authToken)])
      .then(([profileData, paymentMethodsData]) => {
        if (cancelled) return;
        setProfile(profileData);
        setPaymentMethods(paymentMethodsData);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (handleUnauthorized(err, dispatch, navigate)) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Unable to load your profile right now.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, dispatch, navigate]);

  const generalInfoForm = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    values: profile ? { name: profile.name } : undefined,
  });

  const personalInfoForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    values: profile
      ? { email: profile.email, phone: profile.phone ?? '' }
      : undefined,
  });

  const paymentMethodForm = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: emptyPaymentMethodValues,
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: emptyChangePasswordValues,
  });

  // Warn on tab close/refresh/URL-bar navigation while any form has unsaved
  // edits. Switching tabs via in-app navigate() is NOT covered — this app
  // uses a declarative BrowserRouter, and useBlocker (the tool for that)
  // requires a data router; scoped out rather than migrating the app's
  // routing for one page.
  const hasUnsavedChanges =
    generalInfoForm.formState.isDirty ||
    personalInfoForm.formState.isDirty ||
    paymentMethodForm.formState.isDirty ||
    changePasswordForm.formState.isDirty;

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureError, setPictureError] = useState<string | null>(null);

  const handleUploadPicture = async (file: File) => {
    if (!authToken) return;
    setUploadingPicture(true);
    setPictureError(null);
    try {
      const { profilePictureUrl } = await uploadProfilePicture(authToken, file);
      setProfile((prev) => (prev ? { ...prev, profilePictureUrl } : prev));
      dispatch(updateUserInfo({ profilePictureUrl }));
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      setPictureError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSaveGeneralInfo = async (values: GeneralInfoFormValues) => {
    if (!authToken || !profile) return;
    try {
      const updated = await updateProfile(authToken, {
        name: values.name,
        email: profile.email,
        phone: profile.phone ?? '',
      });
      setProfile(updated);
      dispatch(updateUserInfo({ name: updated.name, email: updated.email }));
      generalInfoForm.reset({ name: updated.name });
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      if (err instanceof ProfileValidationError) {
        if (err.errors.name) {
          generalInfoForm.setError('name', {
            type: 'server',
            message: err.errors.name,
          });
        }
      } else {
        generalInfoForm.setError('root', {
          type: 'server',
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    }
  };

  const handleSavePersonalInfo = async (values: PersonalInfoFormValues) => {
    if (!authToken || !profile) return;
    try {
      const updated = await updateProfile(authToken, {
        name: profile.name,
        email: values.email,
        phone: values.phone,
      });
      setProfile(updated);
      dispatch(updateUserInfo({ name: updated.name, email: updated.email }));
      personalInfoForm.reset({
        email: updated.email,
        phone: updated.phone ?? '',
      });
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      if (err instanceof ProfileValidationError) {
        (['email', 'phone'] as const).forEach((field) => {
          const message = err.errors[field];
          if (message) {
            personalInfoForm.setError(field, { type: 'server', message });
          }
        });
      } else {
        personalInfoForm.setError('root', {
          type: 'server',
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    }
  };

  const handleAddPaymentMethod = async (values: PaymentMethodFormValues) => {
    if (!authToken) return;
    try {
      const created = await savePaymentMethod(authToken, values);
      setPaymentMethods((prev) => [...prev, created]);
      paymentMethodForm.reset(emptyPaymentMethodValues);
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      if (err instanceof PaymentMethodValidationError) {
        (
          Object.entries(err.errors) as [
            keyof PaymentMethodFormValues,
            string,
          ][]
        ).forEach(([field, message]) => {
          paymentMethodForm.setError(field, { type: 'server', message });
        });
      } else {
        paymentMethodForm.setError('root', {
          type: 'server',
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    }
  };

  const [paymentMethodActionError, setPaymentMethodActionError] = useState<
    string | null
  >(null);

  const refetchPaymentMethods = async () => {
    if (!authToken) return;
    const data = await getPaymentMethods(authToken);
    setPaymentMethods(data);
  };

  const handleSetDefaultPaymentMethod = async (id: number) => {
    if (!authToken) return;
    setPaymentMethodActionError(null);
    try {
      await setDefaultPaymentMethod(authToken, id);
      await refetchPaymentMethods();
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      setPaymentMethodActionError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    if (!authToken) return;
    setPaymentMethodActionError(null);
    try {
      await deletePaymentMethod(authToken, id);
      await refetchPaymentMethods();
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      setPaymentMethodActionError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    }
  };

  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    if (!authToken) return;
    setPasswordChangeSuccess(false);
    try {
      await changePassword(authToken, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      changePasswordForm.reset(emptyChangePasswordValues);
      setPasswordChangeSuccess(true);
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      if (err instanceof ChangePasswordValidationError) {
        (['currentPassword', 'newPassword'] as const).forEach((field) => {
          const message = err.errors[field];
          if (message) {
            changePasswordForm.setError(field, { type: 'server', message });
          }
        });
      } else {
        changePasswordForm.setError('root', {
          type: 'server',
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    }
  };

  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(
    null,
  );

  const handleDeleteAccount = async () => {
    if (!authToken) return;
    setDeletingAccount(true);
    setDeleteAccountError(null);
    try {
      await deleteAccount(authToken);
      dispatch(logout());
      navigate('/');
    } catch (err) {
      if (handleUnauthorized(err, dispatch, navigate)) return;
      setDeleteAccountError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!authToken) return null;

  const contextValue: AccountSettingsContextValue | null = profile
    ? {
        profile,
        paymentMethods,
        generalInfoForm,
        personalInfoForm,
        paymentMethodForm,
        changePasswordForm,
        uploadingPicture,
        pictureError,
        handleUploadPicture,
        handleSaveGeneralInfo,
        handleSavePersonalInfo,
        handleAddPaymentMethod,
        handleSetDefaultPaymentMethod,
        handleDeletePaymentMethod,
        paymentMethodActionError,
        passwordChangeSuccess,
        handleChangePassword,
        deletingAccount,
        deleteAccountError,
        handleDeleteAccount,
      }
    : null;

  return (
    <div className="flex-1 w-full bg-background py-10 px-4 sm:px-6 lg:px-8">
      <Seo title="Account Settings" path="/profile" noIndex />
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        <div className="flex flex-col gap-1 border-b border-border pb-5">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, payment methods, and account security.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading your account…</p>
        )}
        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {!loading && !loadError && contextValue && (
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <nav
              aria-label="Settings sections"
              className="flex shrink-0 flex-row gap-1 overflow-x-auto pb-1 md:w-52 md:flex-col md:overflow-visible md:pb-0"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => navigate(`/profile/${tab.value}`)}
                  aria-current={activeTab === tab.value ? 'page' : undefined}
                  className={cn(
                    'shrink-0 rounded-md px-3 py-2 text-left text-sm whitespace-nowrap transition-colors cursor-pointer',
                    activeTab === tab.value
                      ? 'bg-muted font-semibold text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <Outlet context={contextValue} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
