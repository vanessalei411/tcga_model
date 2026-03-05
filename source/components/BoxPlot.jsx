import { useState, useEffect } from 'react';
import axios from 'axios';

const SUBTYPE_COLORS = {
  basal:     '#ef4444',
  HER:       '#f97316',
  cell_line: '#a855f7',
  normal:    '#22c55e',
  luminal_A: '#3b82f6',
  luminal_B: '#06b6d4',
};

const DEFAULT_GENE = '1007_s_at';

const MARGIN = { top: 20, right: 30, bottom: 40, left: 50 };

export default function BoxPlot() {
  const [gene, setGene] = useState(DEFAULT_GENE);
  const [input, setInput] = useState(DEFAULT_GENE);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState(null);

  const W = 800, H = 450;
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;

  const fetchData = async (g) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:8080/api/boxplot?gene=${g}`);
      const d = res.data.data;
      const formatted = Object.entries(d).map(([subtype, vals]) => ({
        subtype, ...vals, color: SUBTYPE_COLORS[subtype] || '#ffffff'
      }));
      setChartData(formatted);
    } catch {
      setError('Gene not found. Check the probe ID and try again.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(DEFAULT_GENE); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGene(input.trim());
    fetchData(input.trim());
  };

  // Scales
  const allVals = chartData.flatMap(d => [d.min, d.max, ...(d.outliers || [])]);
  const yMin = allVals.length ? Math.min(...allVals) - 0.3 : 0;
  const yMax = allVals.length ? Math.max(...allVals) + 0.3 : 15;
  const yScale = (val) => innerH - ((val - yMin) / (yMax - yMin)) * innerH;
  const n = chartData.length;
  const slotW = innerW / (n || 1);
  const boxW = slotW * 0.4;
  const xCenter = (i) => i * slotW + slotW / 2;

  // Y axis ticks
  const yTicks = Array.from({ length: 6 }, (_, i) => yMin + (i * (yMax - yMin)) / 5);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Gene Expression Box Plot</h2>
      <p className="text-gray-400 mb-6 text-sm">Distribution of expression levels across all 6 breast cancer subtypes</p>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-8 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Gene (probe ID)</label>
          <input
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:border-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 1007_s_at"
          />
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2 rounded transition">
          {loading ? 'Loading...' : 'Plot'}
        </button>
      </form>

      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {chartData.map(d => (
            <div key={d.subtype} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
              <span className="text-gray-400 text-sm">{d.subtype}</span>
            </div>
          ))}
        </div>
      )}

      {/* SVG Chart */}
      {!loading && chartData.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4 relative">
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>

              {/* Grid lines */}
              {yTicks.map((t, i) => (
                <line key={i} x1={0} x2={innerW} y1={yScale(t)} y2={yScale(t)}
                  stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
              ))}

              {/* Y axis ticks */}
              {yTicks.map((t, i) => (
                <text key={i} x={-8} y={yScale(t) + 4} textAnchor="end"
                  fill="#6b7280" fontSize={11}>{t.toFixed(1)}</text>
              ))}

              {/* Y axis label */}
              <text transform={`translate(-38, ${innerH/2}) rotate(-90)`}
                textAnchor="middle" fill="#9ca3af" fontSize={12}>{gene}</text>

              {/* Box plots */}
              {chartData.map((d, i) => {
                const cx = xCenter(i);
                const half = boxW / 2;
                return (
                  <g key={d.subtype}
                    onMouseEnter={(e) => setTooltip({ d, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Whisker top */}
                    <line x1={cx} x2={cx} y1={yScale(d.max)} y2={yScale(d.q3)}
                      stroke={d.color} strokeWidth={1.5} strokeDasharray="4 2" />
                    {/* Whisker bottom */}
                    <line x1={cx} x2={cx} y1={yScale(d.q1)} y2={yScale(d.min)}
                      stroke={d.color} strokeWidth={1.5} strokeDasharray="4 2" />
                    {/* Whisker caps */}
                    <line x1={cx-half/2} x2={cx+half/2} y1={yScale(d.max)} y2={yScale(d.max)}
                      stroke={d.color} strokeWidth={1.5} />
                    <line x1={cx-half/2} x2={cx+half/2} y1={yScale(d.min)} y2={yScale(d.min)}
                      stroke={d.color} strokeWidth={1.5} />
                    {/* IQR box */}
                    <rect x={cx - half} y={yScale(d.q3)} width={boxW}
                      height={yScale(d.q1) - yScale(d.q3)}
                      fill={d.color} fillOpacity={0.2} stroke={d.color} strokeWidth={2} rx={3} />
                    {/* Median line */}
                    <line x1={cx - half} x2={cx + half} y1={yScale(d.median)} y2={yScale(d.median)}
                      stroke={d.color} strokeWidth={3} />
                    {/* Outliers */}
                    {(d.outliers || []).map((v, j) => (
                      <circle key={j} cx={cx} cy={yScale(v)} r={3}
                        fill={d.color} fillOpacity={0.6} />
                    ))}
                    {/* X label */}
                    <text x={cx} y={innerH + 25} textAnchor="middle"
                      fill="#9ca3af" fontSize={12}>{d.subtype}</text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1={0} x2={0} y1={0} y2={innerH} stroke="rgba(255,255,255,0.15)" />
              <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke="rgba(255,255,255,0.15)" />
            </g>
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div className="fixed z-50 bg-gray-900 border border-white/10 rounded-lg p-3 text-sm pointer-events-none"
              style={{ left: tooltip.x + 12, top: tooltip.y - 80 }}>
              <p className="font-bold text-white mb-1">{tooltip.d.subtype}</p>
              <p className="text-gray-300">Max: <span className="text-white">{tooltip.d.max?.toFixed(3)}</span></p>
              <p className="text-gray-300">Q3: <span className="text-white">{tooltip.d.q3?.toFixed(3)}</span></p>
              <p className="text-gray-300">Median: <span className="text-green-400 font-semibold">{tooltip.d.median?.toFixed(3)}</span></p>
              <p className="text-gray-300">Q1: <span className="text-white">{tooltip.d.q1?.toFixed(3)}</span></p>
              <p className="text-gray-300">Min: <span className="text-white">{tooltip.d.min?.toFixed(3)}</span></p>
              {tooltip.d.outliers?.length > 0 && (
                <p className="text-gray-300">Outliers: <span className="text-orange-400">{tooltip.d.outliers.length}</span></p>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 animate-pulse">Loading distribution data...</p>
        </div>
      )}
    </div>
  );
}