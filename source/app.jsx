import { useState } from 'react';
import ScatterPlot from './components/ScatterPlot';

const NAV_LINKS = ['Models', 'Accuracy', 'Data', 'About'];

export default function App() {
  const [activePage, setActivePage] = useState('Home');

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/60 backdrop-blur-md border-b border-white/10">
        <button onClick={() => setActivePage('Home')} className="text-white font-bold text-lg tracking-wide hover:text-green-400 transition">
          TCGA
        </button>
        <div className="flex gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => setActivePage(link)}
              className={`text-sm transition ${activePage === link ? 'text-green-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
            >
              {link}
            </button>
          ))}
        </div>
      </nav>

      {/* Home Page */}
      {activePage === 'Home' && (
        <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Green radial glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500 opacity-20 blur-[120px] rounded-full pointer-events-none" />

          <h1 className="text-6xl md:text-7xl font-bold text-white text-center leading-tight z-10">
            TCGA Breast Cancer<br />Prediction Model
          </h1>
          <p className="mt-6 text-gray-400 text-lg z-10">
            Explore gene expression patterns across breast cancer subtypes
          </p>
          <button
            onClick={() => setActivePage('Models')}
            className="mt-8 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-lg transition z-10"
          >
            Explore Models →
          </button>
        </div>
      )}

      {/* Models Page */}
      {activePage === 'Models' && (
        <div className="pt-24 px-6 pb-12 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Models</h2>
            <p className="text-gray-400 mb-8">Interactive gene expression analysis across cancer subtypes</p>
            <ScatterPlot />
          </div>
        </div>
      )}

      {/* Accuracy Page */}
      {activePage === 'Accuracy' && (
        <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
          <p className="text-gray-400 text-xl">Accuracy metrics coming soon.</p>
        </div>
      )}

      {/* Data Page */}
      {activePage === 'Data' && (
        <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
          <p className="text-gray-400 text-xl">Data explorer coming soon.</p>
        </div>
      )}

      {/* About Page */}
      {activePage === 'About' && (
        <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
          <p className="text-gray-400 text-xl">About page coming soon.</p>
        </div>
      )}

    </div>
  );
}