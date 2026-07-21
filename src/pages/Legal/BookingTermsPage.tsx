import { InfoPage } from '@/components/InfoPage/InfoPage';
import { Seo } from '@/lib/seo';

export default function BookingTermsPage() {
  return (
    <>
      <Seo
        title="Booking Terms"
        path="/booking-terms"
        description="The terms that apply when you request or confirm a booking on Frui."
      />
      <InfoPage
        title="Booking Terms"
        updated="July 2026"
        intro="These terms apply whenever you request or confirm a reservation through Frui, in addition to our general Terms of Service."
        sections={[
          {
            heading: 'Requesting a booking',
            body: (
              <p>
                Submitting a booking request isn't an instant confirmation: the
                host has up to 24 hours to accept it. You won't be charged until
                the host confirms your reservation.
              </p>
            ),
          },
          {
            heading: 'Prices and currency',
            body: (
              <p>
                Prices shown at checkout include the nightly rate and service
                fee, converted to your local currency where applicable. Taxes
                and any deposits collected directly by the property are called
                out separately before you confirm.
              </p>
            ),
          },
          {
            heading: 'Changes and cancellations',
            body: (
              <p>
                Each stay sets its own cancellation policy, shown on the stay
                page and again at checkout. Changing your dates or guest count
                after booking may require cancelling and re-booking, depending
                on availability.
              </p>
            ),
          },
          {
            heading: 'Guest responsibilities',
            body: (
              <p>
                Guests are expected to follow the house rules listed on the stay
                page (e.g. occupancy limits, smoking and party policies) and to
                provide accurate guest and contact details at checkout.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
