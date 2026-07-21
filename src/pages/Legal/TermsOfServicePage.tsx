import { InfoPage } from '@/components/InfoPage/InfoPage';
import { Seo } from '@/lib/seo';

export default function TermsOfServicePage() {
  return (
    <>
      <Seo
        title="Terms of Service"
        path="/terms-of-service"
        description="The terms that govern your use of the Frui website and booking service."
      />
      <InfoPage
        title="Terms of Service"
        updated="July 2026"
        intro="These terms govern your use of Frui. By creating an account or booking a stay, you agree to them."
        sections={[
          {
            heading: 'Your account',
            body: (
              <p>
                You're responsible for keeping your account credentials secure
                and for all activity that happens under your account. Let us
                know right away if you suspect unauthorized access.
              </p>
            ),
          },
          {
            heading: 'Bookings and payments',
            body: (
              <p>
                Frui facilitates bookings between you and independent hosts or
                properties. Payments are processed by our payment provider;
                specific booking terms (pricing, cancellation, pay-later timing)
                are shown at checkout and in our{' '}
                <span className="font-semibold text-frui-blue">
                  Booking Terms
                </span>
                .
              </p>
            ),
          },
          {
            heading: 'Acceptable use',
            body: (
              <p>
                You agree not to misuse the platform — for example, by
                submitting false reviews, attempting to book on someone else's
                behalf without authorization, or interfering with the site's
                normal operation.
              </p>
            ),
          },
          {
            heading: 'Limitation of liability',
            body: (
              <p>
                Frui connects travelers with stays but isn't the operator of any
                listed property. To the extent permitted by law, we aren't
                liable for issues arising from the stay itself, only for the
                booking service we provide.
              </p>
            ),
          },
          {
            heading: 'Changes to these terms',
            body: (
              <p>
                We may update these terms from time to time; the "Last updated"
                date above reflects the most recent revision. Continuing to use
                Frui after a change means you accept the updated terms.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
