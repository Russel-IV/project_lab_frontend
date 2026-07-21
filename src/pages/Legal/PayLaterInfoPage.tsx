import { InfoPage } from '@/components/InfoPage/InfoPage';
import { Seo } from '@/lib/seo';

export default function PayLaterInfoPage() {
  return (
    <>
      <Seo
        title='How "Pay $0 today" works'
        path="/pay-later"
        description="How Frui's pay-later option works: when you're charged, what happens if a charge fails, and how it interacts with free cancellation."
      />
      <InfoPage
        title='How "Pay $0 today" works'
        updated="July 2026"
        intro="Some stays let you reserve now and pay nothing until closer to your trip. Here's exactly how that works."
        sections={[
          {
            heading: 'Reserve now, pay later',
            body: (
              <p>
                When a stay offers "Pay $0 today," selecting it locks in your
                reservation without charging your card. You'll see the exact
                date your payment is due on the checkout page before you
                confirm.
              </p>
            ),
          },
          {
            heading: 'When you get charged',
            body: (
              <p>
                We automatically charge the payment method on file for the full
                remaining balance on the date shown at checkout — this is the
                same date your free cancellation window ends, so you're never
                charged while you can still cancel for free. No action is needed
                on your part for the charge to go through.
              </p>
            ),
          },
          {
            heading: 'If a charge fails',
            body: (
              <p>
                If your card is declined on the scheduled date, we'll email you
                and try again over the following days. If payment still can't be
                collected, your reservation may be cancelled per the stay's
                cancellation policy, so it's worth keeping your payment details
                up to date under Profile → Payment methods.
              </p>
            ),
          },
          {
            heading: 'No additional fees',
            body: (
              <p>
                Choosing to pay later never costs extra — the total shown at
                checkout is the total you'll pay, whether you pay today or on
                the scheduled date.
              </p>
            ),
          },
          {
            heading: 'Cancelling before you’re charged',
            body: (
              <p>
                If you cancel before the payment date shown at checkout, you
                won't be charged anything. See the stay's own cancellation
                policy for details on refunds after that date.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
