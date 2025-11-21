import { useState } from 'react';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const allClasses = [
    { name: "TI-1A", students: 35 },
    { name: "TI-1B", students: 32 },
    { name: "TI-2A", students: 30 },
    { name: "TI-2B", students: 33 },
    { name: "TI-3A", students: 28 },
    { name: "TI-3B", students: 31 },
    { name: "TI-4A", students: 27 },
    { name: "TI-4B", students: 29 }
  ];

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('name');
  const [showFilter, setShowFilter] = useState(false);
  const [minStudents, setMinStudents] = useState(0);

  const filteredClasses = allClasses
    .filter(kelas => 
      kelas.name.toLowerCase().includes(search.toLowerCase()) &&
      kelas.students >= minStudents
    )
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'students-asc') return a.students - b.students;
      if (sortOrder === 'students-desc') return b.students - a.students;
      return 0;
    });

  return (
    <>
      <div className="px-8 py-6 bg-gray-50 min-h-screen pb-20">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
            <SlidersHorizontal className="w-5 h-5" />
            Filter
          </button>

          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <option value="name">Nama (A-Z)</option>
            <option value="students-desc">Mahasiswa (Banyak)</option>
            <option value="students-asc">Mahasiswa (Sedikit)</option>
          </select>
        </div>

        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal Mahasiswa: {minStudents}
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={minStudents}
              onChange={(e) => setMinStudents(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Cari Kelas ({filteredClasses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((kelas, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{kelas.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm">{kelas.students} Mahasiswa</span>
                </div>

                <button 
                  onClick={() => navigate(`/detail/${kelas.name}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada kelas yang ditemukan
          </div>
        )}
      </div>
    </>
  );
}

export default App;
