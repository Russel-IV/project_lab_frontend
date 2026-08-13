import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { confirmAccount } from '@/api/auth';
import { Seo } from '@/lib/seo';

type ConfirmState = 'loading' | 'success' | 'error';

export default function ConfirmAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<ConfirmState>(token ? 'loading' : 'error');
  const [errorMessage, setErrorMessage] = useState(
    'Missing confirmation token.',
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    confirmAccount(token)
      .then(() => setState('success'))
      .catch((err) => {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to confirm your account.',
        );
        setState('error');
      });
  }, [token]);

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#fff8f3] pt-[80px] pb-[300px]">
      <Seo title="Confirm Account" path="/confirm-account" noIndex />
      <section className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Confirm your account</CardTitle>
          </CardHeader>
          <CardContent>
            {state === 'loading' && (
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Confirming your account…
              </span>
            )}
            {state === 'success' && (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Your email has been confirmed.
                </span>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground underline"
                >
                  Go to homepage
                </Link>
              </div>
            )}
            {state === 'error' && (
              <span className="text-sm text-destructive font-medium flex items-center gap-1">
                <ShieldAlert className="size-4 shrink-0" />
                {errorMessage}
              </span>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
