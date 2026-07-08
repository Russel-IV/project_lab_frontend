import LoginForm from '@/components/Form/LoginForm';
import { Seo } from '@/lib/seo';

export default function LoginPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#fff8f3] pt-[80px] pb-[300px]">
      <Seo title="Log In" path="/login" noIndex />
      <section className="w-full max-w-[960px] px-4">
        <LoginForm />
      </section>
    </div>
  );
}
