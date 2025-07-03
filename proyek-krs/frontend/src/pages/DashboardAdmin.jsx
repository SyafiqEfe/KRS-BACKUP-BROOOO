import React, { useEffect, useState } from "react";
import {
  getMahasiswa,
  getDosen,
  getMatakuliah,
  addMahasiswa,
  editMahasiswa,
  deleteMahasiswa,
  addDosen,
  editDosen,
  deleteDosen,
  addMatakuliah,
  editMatakuliah,
  deleteMatakuliah,
} from "../services/admin";

export default function DashboardAdmin() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [matkul, setMatkul] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const refresh = () => {
    getMahasiswa().then((res) => setMahasiswa(res.mahasiswa || []));
    getDosen().then((res) => setDosen(res.dosen || []));
    getMatakuliah().then((res) => setMatkul(res.matakuliah || []));
  };
  useEffect(() => {
    refresh();
  }, []);

  // Contoh form sederhana untuk tambah mahasiswa
  const handleAddMahasiswa = async (e) => {
    e.preventDefault();
    const res = await addMahasiswa(form);
    setMsg(res.success ? "Berhasil tambah mahasiswa" : res.message);
    if (res.success) {
      setForm({});
      refresh();
    }
  };

  return (
    <div>
      <h2>Dashboard Admin</h2>
      <h3>Tambah Mahasiswa</h3>
      <form onSubmit={handleAddMahasiswa}>
        <input
          placeholder="NIM"
          value={form.nim || ""}
          onChange={(e) => setForm((f) => ({ ...f, nim: e.target.value }))}
        />
        <input
          placeholder="Nama"
          value={form.nama || ""}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
        />
        <input
          placeholder="Password"
          value={form.password || ""}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <input
          placeholder="DPA ID (opsional)"
          value={form.dpaId || ""}
          onChange={(e) => setForm((f) => ({ ...f, dpaId: e.target.value }))}
        />
        <button type="submit">Tambah</button>
      </form>
      <h3>Data Mahasiswa</h3>
      <ul>
        {mahasiswa.map((m) => (
          <li key={m.nim}>
            {m.nim} - {m.nama} (DPA: {m.dpaId}){" "}
            <button
              onClick={() => {
                deleteMahasiswa(m.nim).then(refresh);
              }}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <h3>Data Dosen</h3>
      <ul>
        {dosen.map((d) => (
          <li key={d.nidn}>
            {d.nidn} - {d.nama}{" "}
            <button
              onClick={() => {
                deleteDosen(d.nidn).then(refresh);
              }}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <h3>Data Mata Kuliah</h3>
      <ul>
        {matkul.map((mk) => (
          <li key={mk.kode}>
            {mk.kode} - {mk.nama} ({mk.sks} SKS) - {mk.ruangan} - {mk.jamMulai}{" "}
            <button
              onClick={() => {
                deleteMatakuliah(mk.kode).then(refresh);
              }}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      {msg && <div>{msg}</div>}
      {/* Form tambah/edit dosen dan matakuliah dapat ditambahkan dengan pola serupa */}
    </div>
  );
}
