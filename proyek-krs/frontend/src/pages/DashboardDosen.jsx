import React, { useEffect, useState } from "react";
import { getMatkulDosen, getMahasiswaMatkul } from "../services/dosen";
import { inputNilai } from "../services/api";

export default function DashboardDosen({ user }) {
  const [matkul, setMatkul] = useState([]);
  const [selectedMatkul, setSelectedMatkul] = useState(null);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [nilaiInput, setNilaiInput] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getMatkulDosen(user.username).then((res) =>
      setMatkul(res.matakuliah || [])
    );
  }, [user]);

  const handleSelectMatkul = (id) => {
    setSelectedMatkul(id);
    getMahasiswaMatkul(user.username, id).then((res) =>
      setMahasiswa(res.mahasiswa || [])
    );
  };

  const handleInputNilai = async (krsDetailId) => {
    const { nilai, keterangan } = nilaiInput[krsDetailId] || {};
    const res = await inputNilai(krsDetailId, nilai, keterangan);
    setMsg(res.success ? "Nilai berhasil diinput" : "Gagal input nilai");
  };

  return (
    <div>
      <h2>Dashboard Dosen</h2>
      <h3>Mata Kuliah yang Diampu</h3>
      <ul>
        {matkul.map((mk) => (
          <li key={mk.id}>
            <button onClick={() => handleSelectMatkul(mk.id)}>{mk.nama}</button>
          </li>
        ))}
      </ul>
      {selectedMatkul && (
        <div>
          <h3>Mahasiswa pada Mata Kuliah</h3>
          <table border="1">
            <thead>
              <tr>
                <th>NIM</th>
                <th>Nama</th>
                <th>Nilai</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mahasiswa.map((m) => (
                <tr key={m.krsDetailId}>
                  <td>{m.nim}</td>
                  <td>{m.nama}</td>
                  <td>
                    <input
                      value={nilaiInput[m.krsDetailId]?.nilai || ""}
                      onChange={(e) =>
                        setNilaiInput((inp) => ({
                          ...inp,
                          [m.krsDetailId]: {
                            ...inp[m.krsDetailId],
                            nilai: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={nilaiInput[m.krsDetailId]?.keterangan || ""}
                      onChange={(e) =>
                        setNilaiInput((inp) => ({
                          ...inp,
                          [m.krsDetailId]: {
                            ...inp[m.krsDetailId],
                            keterangan: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleInputNilai(m.krsDetailId)}>
                      Simpan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {msg && <div>{msg}</div>}
    </div>
  );
}
