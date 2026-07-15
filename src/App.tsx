import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import { Chatbot } from '@/components/Chatbot/Chatbot';
import Home from '@/pages/Home';
import StaysPage from '@/pages/StaysPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import StayInfoPage from '@/pages/StayInfoPage';
import Payment from '@/pages/Payment';
import Profile from '@/pages/Profile';
import { MyProfileTab } from '@/pages/Profile/MyProfileTab';
import { BookingHistoryTab } from '@/pages/Profile/BookingHistoryTab';
import { ReviewHistoryTab } from '@/pages/Profile/ReviewHistoryTab';
import { PaymentSettingsTab } from '@/pages/Profile/PaymentSettingsTab';
import { PrivacySettingsTab } from '@/pages/Profile/PrivacySettingsTab';
import { DeleteAccountTab } from '@/pages/Profile/DeleteAccountTab';

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
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
