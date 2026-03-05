import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Accuracy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/accuracy')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load accuracy data.'); setLoading(false); });
  }, []);

  // prevents user from thinking there has been a problem 
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400 animate-pulse">Training model — this may take a few seconds...</p>
    </div>
  );

  // prints an error message
  if (error) return <p className="text-red-400">{error}</p>;

  const { accuracy, labels, confusion_matrix: cm, per_class } = data;

  // Color intensity for confusion matrix cells
  const maxVal = Math.max(...cm.flat());
  const cellColor = (val, row, col) => {
    if (row === col) {
      const intensity = Math.round((val / maxVal) * 180);
      return `rgba(34, 197, 94, ${0.15 + (val / maxVal) * 0.6})`;
    }
    if (val === 0) return 'rgba(255,255,255,0.03)';
    return `rgba(239, 68, 68, ${0.2 + (val / maxVal) * 0.6})`;
  };

  const pct = (accuracy * 100).toFixed(2);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Model Accuracy</h2>
      <p className="text-gray-400 mb-8 text-sm">
        Random Forest classifier trained on 54,675 gene expression features across 6 breast cancer subtypes
      </p>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Overall Accuracy</p>
          <p className="text-4xl font-bold text-green-400">{pct}%</p>
          <p className="text-gray-500 text-xs mt-1">on held-out test set</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Model</p>
          <p className="text-xl font-bold text-white">Random Forest</p>
          <p className="text-gray-500 text-xs mt-1">100 estimators</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Classes</p>
          <p className="text-xl font-bold text-white">{labels.length} subtypes</p>
          <p className="text-gray-500 text-xs mt-1">80/20 train-test split</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Confusion Matrix</h3>
          <p className="text-gray-500 text-xs mb-4">Rows = actual, Columns = predicted</p>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr>
                  <th className="text-gray-500 text-right pr-2 pb-2">Actual ↓</th>
                  {labels.map(l => (
                    <th key={l} className="text-gray-400 pb-2 px-1 text-center font-medium">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cm.map((row, i) => (
                  <tr key={i}>
                    <td className="text-gray-400 text-right pr-2 py-1 font-medium">{labels[i]}</td>
                    {row.map((val, j) => (
                      <td key={j} className="py-1 px-1 text-center rounded"
                        style={{ background: cellColor(val, i, j) }}>
                        <span className={`font-bold ${i === j ? 'text-green-400' : val > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: 'rgba(34,197,94,0.5)' }} />
              <span className="text-gray-500 text-xs">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.5)' }} />
              <span className="text-gray-500 text-xs">Misclassified</span>
            </div>
          </div>
        </div>

        {/* Per-class metrics */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Per-Class Metrics</h3>
          <p className="text-gray-500 text-xs mb-4">Precision, Recall, and F1 score per subtype</p>
          <table className="text-xs w-full">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left pb-2">Subtype</th>
                <th className="text-center pb-2">Precision</th>
                <th className="text-center pb-2">Recall</th>
                <th className="text-center pb-2">F1</th>
                <th className="text-center pb-2">Support</th>
              </tr>
            </thead>
            <tbody>
              {labels.map(label => {
                const m = per_class[label];
                return (
                  <tr key={label} className="border-b border-white/5">
                    <td className="py-2 text-gray-300 font-medium">{label}</td>
                    <td className="py-2 text-center">
                      <span className={m.precision >= 0.9 ? 'text-green-400' : m.precision >= 0.7 ? 'text-yellow-400' : 'text-red-400'}>
                        {(m.precision * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={m.recall >= 0.9 ? 'text-green-400' : m.recall >= 0.7 ? 'text-yellow-400' : 'text-red-400'}>
                        {(m.recall * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={m.f1 >= 0.9 ? 'text-green-400' : m.f1 >= 0.7 ? 'text-yellow-400' : 'text-red-400'}>
                        {(m.f1 * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-center text-gray-500">{m.support}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}