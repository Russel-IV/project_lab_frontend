import { InfoPage } from '@/components/InfoPage/InfoPage';
import { Seo } from '@/lib/seo';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        path="/privacy-policy"
        description="How Frui collects, uses, and protects your personal information."
      />
      <InfoPage
        title="Privacy Policy"
        updated="July 2026"
        intro="This explains what information Frui collects, how we use it, and the choices you have."
        sections={[
          {
            heading: 'What we collect',
            body: (
              <p>
                Account details (name, email, phone), booking information
                (dates, guests, stay selections), and payment details, which are
                handled directly by our payment provider rather than stored on
                our servers.
              </p>
            ),
          },
          {
            heading: 'How we use it',
            body: (
              <p>
                To create and manage your bookings, communicate with you and the
                host about a reservation, and improve search results and
                recommendations across the site.
              </p>
            ),
          },
          {
            heading: 'Who we share it with',
            body: (
              <p>
                The host of a stay you book (for check-in coordination), our
                payment processor (to complete charges), and service providers
                who help us run the platform. We don't sell your personal
                information.
              </p>
            ),
          },
          {
            heading: 'Your choices',
            body: (
              <p>
                You can review and update your details anytime from{' '}
                <span className="font-semibold text-frui-blue">
                  Profile → Settings
                </span>
                , including requesting account deletion.
              </p>
            ),
          },
          {
            heading: 'Contact',
            body: (
              <p>
                Questions about this policy can be sent through the in-app chat
                or your account support channel.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
