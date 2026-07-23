import { Link } from 'react-router-dom';
import { Seo } from '@/lib/seo';

export default function NotFound() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 bg-frui-cream p-8 text-center">
      <Seo title="Page Not Found" path="/404" noIndex />
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        to="/"
        className="bg-frui-orange text-frui-white hover:brightness-95 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
