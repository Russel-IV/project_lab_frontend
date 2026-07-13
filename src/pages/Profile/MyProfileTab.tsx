import { FormProvider } from 'react-hook-form';
import { useAccountSettingsContext } from './AccountSettingsContext';
import { GeneralInfoSection } from './GeneralInfoSection';
import { PersonalInfoSection } from './PersonalInfoSection';

export function MyProfileTab() {
  const {
    profile,
    generalInfoForm,
    personalInfoForm,
    uploadingPicture,
    pictureError,
    handleUploadPicture,
    handleSaveGeneralInfo,
    handleSavePersonalInfo,
  } = useAccountSettingsContext();

  return (
    <>
      <FormProvider {...generalInfoForm}>
        <GeneralInfoSection
          profilePictureUrl={profile.profilePictureUrl}
          uploadingPicture={uploadingPicture}
          pictureError={pictureError}
          onUploadPicture={handleUploadPicture}
          onSubmit={generalInfoForm.handleSubmit(handleSaveGeneralInfo)}
        />
      </FormProvider>
      <FormProvider {...personalInfoForm}>
        <PersonalInfoSection
          onSubmit={personalInfoForm.handleSubmit(handleSavePersonalInfo)}
        />
      </FormProvider>
    </>
  );
}

export default MyProfileTab;
