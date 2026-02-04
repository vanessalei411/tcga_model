import { useState } from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-500">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
          TCGA Breast Cancer<br />
          Prediction Model
        </h1>

        <p className="text-white text-lg mb-6 flex items-center gap-2">
          Learn More 
          <span className="text-2xl">↓</span>
        </p>
        
        <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
          Model
        </button>
      </div>
    </div>
  );
}

export default App;