import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import Home from './pages/Home';
import StaysPage from './pages/StaysPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stays" element={<StaysPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
