import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
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
        <footer
          className="bg-[#121529] h-[180px] md:h-[200px] w-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.08)]"
          aria-label="Main Footer"
        ></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
