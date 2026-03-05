import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Line, ComposedChart
} from 'recharts';

const SUBTYPE_COLORS = {
  basal:     '#ef4444',
  HER:       '#f97316',
  cell_line: '#a855f7',
  normal:    '#22c55e',
  luminal_A: '#3b82f6',
  luminal_B: '#06b6d4',
};

const DEFAULT_GENE_X = '1007_s_at';
const DEFAULT_GENE_Y = '1053_at';

export default function ScatterPlot() {
  const [geneX, setGeneX] = useState(DEFAULT_GENE_X);
  const [geneY, setGeneY] = useState(DEFAULT_GENE_Y);
  const [inputX, setInputX] = useState(DEFAULT_GENE_X);
  const [inputY, setInputY] = useState(DEFAULT_GENE_Y);
  const [chartData, setChartData] = useState({});
  const [trendline, setTrendline] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (gx, gy) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:8080/api/scatter?gene_x=${gx}&gene_y=${gy}`);
      const d = res.data;

      // Group points by subtype
      const grouped = {};
      d.x.forEach((xVal, i) => {
        const type = d.types[i];
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push({ x: xVal, y: d.y[i] });
      });

      setChartData(grouped);
      setTrendline(d.trendline);
      setStats({ correlation: d.correlation, p_value: d.p_value });
    } catch (e) {
      setError('Gene not found. Check the probe ID and try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(geneX, geneY);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneX(inputX.trim());
    setGeneY(inputY.trim());
    fetchData(inputX.trim(), inputY.trim());
  };

  const trendData = trendline
    ? [{ x: trendline.x[0], y: trendline.y[0] }, { x: trendline.x[1], y: trendline.y[1] }]
    : [];

  const corrStrength = stats
    ? Math.abs(stats.correlation) > 0.7 ? 'strong'
      : Math.abs(stats.correlation) > 0.4 ? 'moderate' : 'weak'
    : '';

  const corrColor = corrStrength === 'strong' ? '#22c55e'
    : corrStrength === 'moderate' ? '#f97316' : '#ef4444';

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Gene Expression Scatter Plot</h2>
      <p className="text-gray-400 mb-6 text-sm">Compare expression levels of two genes across 151 patient samples</p>

      {/* Gene selector */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Gene X (probe ID)</label>
          <input
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:border-green-400"
            value={inputX}
            onChange={e => setInputX(e.target.value)}
            placeholder="e.g. 1007_s_at"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Gene Y (probe ID)</label>
          <input
            className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:border-green-400"
            value={inputY}
            onChange={e => setInputY(e.target.value)}
            placeholder="e.g. 1053_at"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2 rounded transition"
        >
          {loading ? 'Loading...' : 'Plot'}
        </button>
      </form>

      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

      {/* Stats bar */}
      {stats && (
        <div className="flex gap-6 mb-4">
          <div className="bg-white/10 rounded-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">Pearson Correlation</p>
            <p className="text-xl font-bold" style={{ color: corrColor }}>
              r = {stats.correlation}
            </p>
            <p className="text-xs capitalize" style={{ color: corrColor }}>{corrStrength} correlation</p>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">P-value</p>
            <p className="text-xl font-bold text-white">{stats.p_value}</p>
            <p className="text-xs text-gray-400">{stats.p_value < 0.05 ? 'Statistically significant' : 'Not significant'}</p>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">Samples</p>
            <p className="text-xl font-bold text-white">151</p>
            <p className="text-xs text-gray-400">patients</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && Object.keys(chartData).length > 0 && (
        <div className="bg-white/5 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="x"
                type="number"
                domain={['auto', 'auto']}
                label={{ value: geneX, position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 12 }}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis
                dataKey="y"
                type="number"
                domain={['auto', 'auto']}
                label={{ value: geneY, angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                formatter={(val, name) => [val?.toFixed(3), name]}
              />
              <Legend wrapperStyle={{ color: '#9ca3af', paddingTop: 16 }} />

              {/* One Scatter per subtype */}
              {Object.entries(chartData).map(([type, pts]) => (
                <Scatter
                  key={type}
                  name={type}
                  data={pts}
                  fill={SUBTYPE_COLORS[type] || '#ffffff'}
                  opacity={0.75}
                  r={4}
                />
              ))}

              {/* Trendline */}
              {trendData.length > 0 && (
                <Line
                  data={trendData}
                  dataKey="y"
                  dot={false}
                  stroke="#facc15"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  name="trend"
                  legendType="none"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 animate-pulse">Calculating correlation...</p>
        </div>
      )}
    </div>
  );
}