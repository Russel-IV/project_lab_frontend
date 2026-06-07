import SearchForm from '../components/Form/SearchForm';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center pt-[80px] pb-[500px]">
      <section className="w-full max-w-[900px] px-4 sm:px-6 lg:px-8">
        <SearchForm />
      </section>
    </div>
  );
}
