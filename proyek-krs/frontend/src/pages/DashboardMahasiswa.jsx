import React, { useEffect, useState } from "react";
import { getMatakuliah, submitKRS, getKRS, getNilai } from "../services/api";

export default function DashboardMahasiswa({ user }) {
  const [matkul, setMatkul] = useState([]);
  const [selected, setSelected] = useState([]); // selected: array of matkul id
  const [krs, setKrs] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getMatakuliah().then((res) => {
      let data = [];
      if (res && Array.isArray(res.matakuliah)) {
        data = res.matakuliah;
      } else if (Array.isArray(res)) {
        data = res;
      }
      // Patch: id selalu number
      data = data.map((m, idx) => ({
        ...m,
        id: m.id !== undefined ? Number(m.id) : idx,
      }));
      setMatkul(data);
    });
    getKRS(user.username).then((res) => setKrs(res.krs || []));
    getNilai(user.username).then((res) => setNilai(res.nilai || []));
  }, [user]);

  // Hitung total SKS dari matkul yang dipilih
  const totalSKS = selected.reduce((sum, id) => {
    const mk = matkul.find((m) => m.id === id);
    return sum + (mk ? mk.sks : 0);
  }, 0);

  // Validasi SKS
  const validSKS = totalSKS >= 19 && totalSKS <= 24;
  const warningSKS =
    totalSKS < 19
      ? "SKS kurang dari minimal 19"
      : totalSKS > 24
      ? "SKS melebihi maksimal 24"
      : "";

  // Hapus matkul dari pilihan
  const handleRemove = (id) => {
    setSelected((sel) => sel.filter((mid) => mid !== id));
  };

  // Submit/update KRS
  const handleSubmit = async () => {
    if (!validSKS) return;
    const res = await submitKRS(user.username, selected);
    setMsg(
      res.message || (res.success ? "KRS berhasil disubmit" : "Gagal submit")
    );
    if (res.success) getKRS(user.username).then((res) => setKrs(res.krs || []));
  };

  return (
    <div
      className="container card"
      style={{ marginTop: 32, maxWidth: 900, width: "100%" }}
    >
      <h2 style={{ color: "#1976d2" }}>Dashboard Mahasiswa</h2>
      <h3>Pilih Mata Kuliah (SKS 19-24)</h3>
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 700,
            background: "#f8f9fa",
            borderRadius: 8,
          }}
        >
          <thead>
            <tr style={{ background: "#f5f6fa" }}>
              <th style={{ padding: 8 }}></th>
              <th style={{ padding: 8 }}>Kode</th>
              <th style={{ padding: 8 }}>Nama</th>
              <th style={{ padding: 8 }}>SKS</th>
              <th style={{ padding: 8 }}>Dosen</th>
              <th style={{ padding: 8 }}>Ruangan</th>
              <th style={{ padding: 8 }}>Jam</th>
            </tr>
          </thead>
          <tbody>
            {matkul.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                  Belum ada data matakuliah.
                </td>
              </tr>
            ) : (
              matkul.map((mk) => (
                <tr
                  key={mk.kode}
                  style={{
                    background: selected.includes(mk.id) ? "#e3fcec" : "#fff",
                  }}
                >
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(Number(mk.id))}
                      disabled={
                        !selected.includes(Number(mk.id)) &&
                        totalSKS + mk.sks > 24
                      }
                      onChange={(e) => {
                        const mkId = Number(mk.id);
                        if (e.target.checked) {
                          setSelected((sel) => [...sel, mkId]);
                        } else {
                          setSelected((sel) =>
                            sel.filter((mid) => mid !== mkId)
                          );
                        }
                        console.log(
                          "selected",
                          selected,
                          "mk.id",
                          mkId,
                          typeof mkId
                        );
                      }}
                    />
                  </td>
                  <td style={{ padding: 8 }}>{mk.kode}</td>
                  <td style={{ padding: 8 }}>{mk.nama}</td>
                  <td style={{ padding: 8 }}>{mk.sks}</td>
                  <td style={{ padding: 8 }}>{mk.dosen}</td>
                  <td style={{ padding: 8 }}>{mk.ruangan}</td>
                  <td style={{ padding: 8 }}>{mk.jamMulai}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{
          marginBottom: 12,
          color: validSKS ? "#388e3c" : "#c62828",
          fontWeight: 500,
        }}
      >
        Total SKS: <b>{totalSKS}</b>{" "}
        {validSKS ? "" : "(Minimal 19, Maksimal 24)"}
        {warningSKS && (
          <span style={{ marginLeft: 12, color: "#c62828" }}>{warningSKS}</span>
        )}
      </div>
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!validSKS}
        style={{ marginBottom: 16 }}
      >
        {krs.length > 0 ? "Update Matkul" : "Submit KRS"}
      </button>
      {msg && (
        <div
          style={{
            marginTop: 12,
            color: msg.includes("berhasil") ? "#388e3c" : "#c62828",
          }}
        >
          {msg}
        </div>
      )}
      <h3 style={{ marginTop: 24 }}>Matkul yang Dipilih</h3>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 700,
            background: "#e3fcec",
            color: "#256029",
            borderRadius: 8,
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: 8 }}>Kode</th>
              <th style={{ padding: 8 }}>Nama</th>
              <th style={{ padding: 8 }}>SKS</th>
              <th style={{ padding: 8 }}>Dosen</th>
              <th style={{ padding: 8 }}>Ruangan</th>
              <th style={{ padding: 8 }}>Jam</th>
              <th style={{ padding: 8 }}>Hapus</th>
            </tr>
          </thead>
          <tbody>
            {selected.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                  Belum ada matkul dipilih.
                </td>
              </tr>
            ) : (
              selected.map((id) => {
                const mk = matkul.find((m) => m.id === id);
                if (!mk) return null;
                return (
                  <tr key={id}>
                    <td style={{ padding: 8 }}>{mk.kode}</td>
                    <td style={{ padding: 8 }}>{mk.nama}</td>
                    <td style={{ padding: 8 }}>{mk.sks}</td>
                    <td style={{ padding: 8 }}>{mk.dosen}</td>
                    <td style={{ padding: 8 }}>{mk.ruangan}</td>
                    <td style={{ padding: 8 }}>{mk.jamMulai}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        style={{
                          color: "#c62828",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handleRemove(id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 24 }}>Nilai & Kehadiran</h3>
      <div
        className="nim-box"
        style={{ background: "#e3f2fd", color: "#1976d2" }}
      >
        <pre style={{ margin: 0, fontSize: 15 }}>
          {JSON.stringify(nilai, null, 2)}
        </pre>
      </div>
    </div>
  );
}
