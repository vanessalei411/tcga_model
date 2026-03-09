import { useState, useEffect } from 'react';
import axios from 'axios';

const SUBTYPE_COLORS = {
  basal:     'bg-red-500/20 text-red-400',
  HER:       'bg-orange-500/20 text-orange-400',
  cell_line: 'bg-purple-500/20 text-purple-400',
  normal:    'bg-green-500/20 text-green-400',
  luminal_A: 'bg-blue-500/20 text-blue-400',
  luminal_B: 'bg-cyan-500/20 text-cyan-400',
};

const SUBTYPES = ['all', 'basal', 'HER', 'cell_line', 'normal', 'luminal_A', 'luminal_B'];

export default function DataBrowser() {
  const [samples, setSamples] = useState([]);
  const [geneCols, setGeneCols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubtype, setFilterSubtype] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    axios.get('http://localhost:8080/api/samples')
      .then(res => {
        setSamples(res.data.samples);
        setGeneCols(res.data.gene_columns);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = samples.filter(s => {
    const matchSubtype = filterSubtype === 'all' || s.subtype === filterSubtype;
    const matchSearch = search === '' || String(s.sample_id).includes(search) || s.subtype.toLowerCase().includes(search.toLowerCase());
    return matchSubtype && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (val) => { setFilterSubtype(val); setPage(1); };
  const handleSearch = (val) => { setSearch(val); setPage(1); };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400 animate-pulse">Loading samples...</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Sample Browser</h2>
      <p className="text-gray-400 mb-6 text-sm">
        Browse all 151 patient samples with subtype labels and gene expression values
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:border-green-400"
          placeholder="Search sample ID or subtype..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {SUBTYPES.map(s => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                filterSubtype === s
                  ? 'bg-green-500 text-black border-green-500 font-semibold'
                  : 'border-white/20 text-gray-400 hover:text-white hover:border-white/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-gray-500 text-sm ml-auto">{filtered.length} samples</span>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left text-gray-400 font-medium px-4 py-3">Sample ID</th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">Subtype</th>
              {geneCols.map(g => (
                <th key={g} className="text-right text-gray-400 font-medium px-4 py-3">{g}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((s, i) => (
              <tr key={s.sample_id} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                <td className="px-4 py-3 text-gray-300 font-mono">{s.sample_id}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${SUBTYPE_COLORS[s.subtype] || 'bg-gray-500/20 text-gray-400'}`}>
                    {s.subtype}
                  </span>
                </td>
                {geneCols.map(g => (
                  <td key={g} className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                    {s.genes[g]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-30 transition"
          >
            ← Previous
          </button>
          <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-30 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}