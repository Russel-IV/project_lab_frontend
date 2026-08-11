import SignupForm from '@/components/Form/SignupForm';
import { Seo } from '@/lib/seo';

/**
 * Renders the signup page layout.
 */
export default function SignupPage() {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-frui-white py-10 px-4 sm:px-6 lg:px-8">
      <Seo title="Sign Up" path="/signup" noIndex />
      <section className="w-full max-w-md">
        <SignupForm />
      </section>
    </div>
  );
}
