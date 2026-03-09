import { useState } from "react";
import ScatterPlot from "./components/ScatterPlot";
import BoxPlot from "./components/BoxPlot";
import Accuracy from "./components/Accuracy";
import DataBrowser from './components/DataBrowser';

const NAV_LINKS = ["Models", "Accuracy", "Data", "About"];

const PLOT_CARDS = [
  {
    id: "scatter",
    title: "Gene Correlation Scatter Plot",
    description:
      "Compare expression levels of two genes across 151 patient samples. Colored by cancer subtype with live Pearson correlation.",
    icon: "⬡",
    tag: "Correlation Analysis",
  },
  {
    id: "boxplot",
    title: "Subtype Expression Box Plot",
    description:
      "Visualize the spread of a single gene's expression across all 6 breast cancer subtypes. Identify biomarker candidates.",
    icon: "▦",
    tag: "Distribution Analysis",
    comingSoon: false,
  },
];

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [activePlot, setActivePlot] = useState(null);

  const goToModels = () => {
    setActivePlot(null);
    setActivePage("Models");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/60 backdrop-blur-md border-b border-white/10">
        <button
          onClick={() => setActivePage("Home")}
          className="text-white font-bold text-lg tracking-wide hover:text-green-400 transition"
        >
          TCGA
        </button>
        <div className="flex gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => {
                setActivePlot(null);
                setActivePage(link);
              }}
              className={`text-sm transition ${
                activePage === link
                  ? "text-green-400 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </nav>

      {/* Home Page */}
      {activePage === "Home" && (
        <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500 opacity-20 blur-[120px] rounded-full pointer-events-none" />
          <h1 className="text-6xl md:text-7xl font-bold text-white text-center leading-tight z-10">
            TCGA Breast Cancer
            <br />
            Prediction Model
          </h1>
          <p className="mt-6 text-gray-400 text-lg z-10">
            Explore gene expression patterns across breast cancer subtypes
          </p>
          <button
            onClick={goToModels}
            className="mt-8 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-lg transition z-10"
          >
            Explore Models →
          </button>
        </div>
      )}

      {/* Models Page — Plot Selector */}
      {activePage === "Models" && !activePlot && (
        <div className="pt-32 px-6 pb-12 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-2">Models</h2>
            <p className="text-gray-400 mb-12">
              Select a visualization to explore the dataset
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLOT_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActivePlot(card.id)}
                  className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-2xl p-8 transition group"
                >
                  <span className="inline-block text-xs font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full mb-4">
                    {card.tag}
                  </span>
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-6 text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Open visualization →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Plot View */}
      {activePage === "Models" && activePlot && (
        <div className="pt-24 px-6 pb-12 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setActivePlot(null)}
              className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition"
            >
              ← Back to Models
            </button>
            {activePlot === "scatter" && <ScatterPlot />}
            {activePlot === "boxplot" && <BoxPlot />}
          </div>
        </div>
      )}

      {/* Other Pages */}
      {activePage === "Accuracy" && (
        <div className="pt-24 px-6 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <Accuracy />
          </div>
        </div>
      )}
      {activePage === 'Data' && (
        <div className="pt-24 px-6 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <DataBrowser />
          </div>
        </div>
      )}
      {activePage === "About" && (
        <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
          <p className="text-gray-400 text-xl">About page coming soon.</p>
        </div>
      )}
    </div>
  );
}
