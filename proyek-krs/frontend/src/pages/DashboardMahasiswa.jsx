import React, { useEffect, useState } from "react";
import { getMatakuliah, submitKRS, getKRS, getNilai } from "../services/api";

export default function DashboardMahasiswa({ user }) {
  const [matkul, setMatkul] = useState([]);
  const [selected, setSelected] = useState([]);
  const [krs, setKrs] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getMatakuliah().then((res) => setMatkul(res.matakuliah || []));
    getKRS(user.username).then((res) => setKrs(res.krs || []));
    getNilai(user.username).then((res) => setNilai(res.nilai || []));
  }, [user]);

  const handleSubmit = async () => {
    const res = await submitKRS(user.username, selected);
    setMsg(
      res.message || (res.success ? "KRS berhasil disubmit" : "Gagal submit")
    );
    if (res.success) getKRS(user.username).then((res) => setKrs(res.krs || []));
  };

  return (
    <div>
      <h2>Dashboard Mahasiswa</h2>
      <h3>Pilih Mata Kuliah (SKS 19-24)</h3>
      <ul>
        {matkul.map((mk) => (
          <li key={mk.kode}>
            <input
              type="checkbox"
              value={mk.kode}
              onChange={(e) => {
                setSelected((sel) =>
                  e.target.checked
                    ? [...sel, mk.kode]
                    : sel.filter((id) => id !== mk.kode)
                );
              }}
            />
            {mk.nama} ({mk.sks} SKS) - {mk.dosenId} - {mk.ruangan} -{" "}
            {mk.jamMulai}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit KRS</button>
      {msg && <div>{msg}</div>}
      <h3>KRS Anda</h3>
      <pre>{JSON.stringify(krs, null, 2)}</pre>
      <h3>Nilai & Kehadiran</h3>
      <pre>{JSON.stringify(nilai, null, 2)}</pre>
    </div>
  );
}
