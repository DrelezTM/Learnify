import React, { useState } from "react";

const Detail = () => {
  const kelas = {
    nama: "TI-1A",
    semester: "Semester 1",
    jumlahMahasiswa: 35,
    enrollmentKey: "ABC12345",
  };

  const dummyMatkul = [
    { id: 1, nama: "Algoritma & Pemrograman", dosen: "Rudi Hartono", jumlahTugas: 12 },
    { id: 2, nama: "Kalkulus", dosen: "Andi Saputra", jumlahTugas: 8 },
    { id: 3, nama: "Sistem Digital", dosen: "Maya Putri", jumlahTugas: 5 },
    { id: 4, nama: "Pancasila", dosen: "Budi Santoso", jumlahTugas: 3 },
  ];

  const dummyMahasiswa = [
    { id: 1, nama: "John Doe", nim: "101234567" },
    { id: 2, nama: "Michael", nim: "101234568" },
    { id: 3, nama: "Aulia", nim: "101234569" },
  ];

  const dummyDosen = [
    { id: 1, nama: "Rudi Hartono", matkul: "Algoritma & Pemrograman" },
    { id: 2, nama: "Andi Saputra", matkul: "Kalkulus" },
    { id: 3, nama: "Maya Putri", matkul: "Sistem Digital" },
  ];

  const [tab, setTab] = useState("matkul");

  return (
    <div className="p-6 space-y-6">

      
      <div className="bg-white p-6 shadow rounded-xl border border-gray-200">
        <h1 className="text-2xl font-bold">{kelas.nama}</h1>
        <p className="text-gray-600">{kelas.semester}</p>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-xl border">
            <p className="text-gray-600">Jumlah Mahasiswa</p>
            <p className="text-xl font-semibold">{kelas.jumlahMahasiswa}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border">
            <p className="text-gray-600">Enrollment Key</p>
            <p className="text-xl font-semibold">{kelas.enrollmentKey}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border">
            <p className="text-gray-600">Total Mata Kuliah</p>
            <p className="text-xl font-semibold">{dummyMatkul.length}</p>
          </div>
        </div>
      </div>

     
      <div className="flex gap-3 text-sm">
        <button
          onClick={() => setTab("matkul")}
          className={`px-4 py-2 rounded-lg ${tab === "matkul" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Mata Kuliah
        </button>

        <button
          onClick={() => setTab("mahasiswa")}
          className={`px-4 py-2 rounded-lg ${tab === "mahasiswa" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Mahasiswa
        </button>

        <button
          onClick={() => setTab("dosen")}
          className={`px-4 py-2 rounded-lg ${tab === "dosen" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Dosen
        </button>

        <button
          onClick={() => setTab("pengaturan")}
          className={`px-4 py-2 rounded-lg ${tab === "pengaturan" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Pengaturan
        </button>
      </div>

     
      <div className="bg-white p-6 shadow rounded-xl border border-gray-200">

        {tab === "matkul" && (
          <div className="grid grid-cols-2 gap-4">
            {dummyMatkul.map((m) => (
              <div key={m.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <h2 className="font-semibold text-lg">{m.nama}</h2>
                <p className="text-gray-600 text-sm">Dosen: {m.dosen}</p>
                <p className="text-gray-600 text-sm">{m.jumlahTugas} Tugas</p>

                <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  Lihat Detail Matkul
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "mahasiswa" && (
          <div>
            <h2 className="font-semibold mb-3">Daftar Mahasiswa</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">NIM</th>
                </tr>
              </thead>
              <tbody>
                {dummyMahasiswa.map((mhs) => (
                  <tr key={mhs.id}>
                    <td className="p-2 border">{mhs.nama}</td>
                    <td className="p-2 border">{mhs.nim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

       
        {tab === "dosen" && (
          <div>
            <h2 className="font-semibold mb-3">Dosen Pengampu</h2>
            <ul className="space-y-2">
              {dummyDosen.map((d) => (
                <li key={d.id} className="p-3 border rounded-xl">
                  <p className="font-semibold">{d.nama}</p>
                  <p className="text-sm text-gray-600">Mengajar: {d.matkul}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

    
        {tab === "pengaturan" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Pengaturan Kelas</h2>

            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
              Reset Enrollment Key
            </button>

            <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
              Hapus Kelas
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Detail;
