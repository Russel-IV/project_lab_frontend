import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import { Chatbot } from '@/components/Chatbot/Chatbot';
import { RouteFallback } from '@/components/RouteFallback/RouteFallback';

const Home = lazy(() => import('@/pages/Home'));
const StaysPage = lazy(() => import('@/pages/StaysPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const StayInfoPage = lazy(() => import('@/pages/StayInfoPage'));
const Payment = lazy(() => import('@/pages/Payment'));
const Profile = lazy(() => import('@/pages/Profile'));
const MyProfileTab = lazy(() => import('@/pages/Profile/MyProfileTab'));
const BookingHistoryTab = lazy(
  () => import('@/pages/Profile/BookingHistoryTab'),
);
const ReviewHistoryTab = lazy(() => import('@/pages/Profile/ReviewHistoryTab'));
const PaymentSettingsTab = lazy(
  () => import('@/pages/Profile/PaymentSettingsTab'),
);
const PrivacySettingsTab = lazy(
  () => import('@/pages/Profile/PrivacySettingsTab'),
);
const DeleteAccountTab = lazy(() => import('@/pages/Profile/DeleteAccountTab'));
const PayLaterInfoPage = lazy(() => import('@/pages/Legal/PayLaterInfoPage'));
const BookingTermsPage = lazy(() => import('@/pages/Legal/BookingTermsPage'));
const TermsOfServicePage = lazy(
  () => import('@/pages/Legal/TermsOfServicePage'),
);
const PrivacyPolicyPage = lazy(() => import('@/pages/Legal/PrivacyPolicyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-frui-orange text-frui-white hover:brightness-95 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border-0"
      >
        Try Again
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
          {/* Footer lives inside this Suspense (not just the Routes) so it
              mounts together with the resolved route instead of rendering
              immediately alongside the fallback and jumping down once the
              route's lazy chunk finishes loading — that jump was the app's
              biggest CLS hit. */}
          <main className="flex-1 flex flex-col">
            <ErrorBoundary FallbackComponent={RouteErrorFallback}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stays" element={<StaysPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/stay/:id" element={<StayInfoPage />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/profile" element={<Profile />}>
                  <Route index element={<Navigate to="my-profile" replace />} />
                  <Route path="my-profile" element={<MyProfileTab />} />
                  <Route path="bookings" element={<BookingHistoryTab />} />
                  <Route path="reviews" element={<ReviewHistoryTab />} />
                  <Route path="payment" element={<PaymentSettingsTab />} />
                  <Route path="privacy" element={<PrivacySettingsTab />} />
                  <Route path="delete" element={<DeleteAccountTab />} />
                </Route>
                <Route path="/pay-later" element={<PayLaterInfoPage />} />
                <Route path="/booking-terms" element={<BookingTermsPage />} />
                <Route
                  path="/terms-of-service"
                  element={<TermsOfServicePage />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </Suspense>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
