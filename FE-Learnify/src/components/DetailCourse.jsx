import { fetchDetailCourse } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailCourse = () => {
  const { id } = useParams();

  console.log(id)

  const [kelas, setKelas] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("matkul");

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await fetchDetailCourse(id);
        setKelas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!kelas) return <p className="p-10 text-red-500">Data tidak ditemukan</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 shadow rounded-xl border border-gray-200">
        <h1 className="text-2xl font-bold">{kelas.title}</h1>

        <p className="text-gray-600">
          Kode kelas: {kelas.code}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-xl border">
            <p className="text-gray-600">Enrollment Key</p>
            <p className="text-xl font-semibold">{kelas.enrollment_key}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border">
            <p className="text-gray-600">Dosen Pembuat</p>
            <p className="text-xl font-semibold">{kelas.lecturer_id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm">
        <button
          onClick={() => setTab("pengaturan")}
          className={`px-4 py-2 rounded-lg ${tab === "pengaturan" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Pengaturan
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 shadow rounded-xl border border-gray-200">
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

export default DetailCourse;
