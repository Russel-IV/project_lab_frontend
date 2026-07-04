import SignupForm from '@/components/Form/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#fff8f3] pt-[80px] pb-[300px]">
      <section className="w-full max-w-[960px] px-4">
        <SignupForm />
      </section>
    </div>
  );
}
