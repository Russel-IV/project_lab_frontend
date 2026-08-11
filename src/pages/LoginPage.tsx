import LoginForm from '@/components/Form/LoginForm';
import airplaneFlying from '@/assets/airplane-flying.jpeg';
import { Seo } from '@/lib/seo';

/**
 * Renders the login page layout.
 * Displays a full screen split screen with an image on the left and the login form on the right.
 */
export default function LoginPage() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-5 bg-frui-white">
      <Seo title="Log In" path="/login" noIndex />

      {/* Left Column: Image section covering 3/5 width on desktop */}
      <div className="relative hidden lg:block lg:col-span-3 w-full h-full">
        <img
          src={airplaneFlying}
          alt="Airplane Flying"
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Right Column: Form Container covering 2/5 width on desktop */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:col-span-2 w-full">
        <LoginForm />
      </div>
    </div>
  );
}
