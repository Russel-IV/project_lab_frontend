import React from 'react';
import SearchForm from './components/Form/SearchForm';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Top bar with deep dark blue background */}
      <header className="app-header" aria-label="Main Header"></header>

      {/* Main section with light mint green background */}
      <main className="app-main">
        <section className="form-section">
          <SearchForm />
        </section>
      </main>

      {/* Bottom area with solid grass-green background */}
      <footer className="app-footer" aria-label="Main Footer"></footer>
    </div>
  );
};

export default App;
