import React, { useEffect, useState, useMemo } from "react";
import { getMatakuliah, submitKRS, getKRS, getNilai } from "../services/api";

// --- Komponen baru untuk KARTU NILAI ---
const NilaiCard = ({ item }) => (
  <div
    style={{
      border: "1px solid #dee2e6",
      borderRadius: 8,
      padding: 16,
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    <h4 style={{ marginTop: 0, marginBottom: 4, color: "#0d6efd" }}>
      {item.matakuliah}
    </h4>
    <p style={{ margin: 0, fontSize: "0.9em", color: "#6c757d" }}>
      Dosen: {item.dosen}
    </p>
    <hr style={{ margin: "12px 0", borderColor: "#e9ecef" }} />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{ fontWeight: "bold" }}>Nilai: </span>
        {item.nilai ? (
          <span
            style={{
              background: "#198754",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            {item.nilai}
          </span>
        ) : (
          <span style={{ fontStyle: "italic", color: "#6c757d" }}>
            Belum dinilai
          </span>
        )}
      </div>
      <div>
        <span style={{ fontWeight: "bold" }}>Keterangan: </span>
        {item.keterangan || (
          <span style={{ fontStyle: "italic", color: "#6c757d" }}>-</span>
        )}
      </div>
    </div>
  </div>
);

// Komponen untuk baris mata kuliah, agar lebih rapi
const MatakuliahRow = ({ matkul, isSelected, onSelect, isDisabled }) => (
  <tr
    style={{
      background: isSelected ? "#e3fcec" : "#fff",
      transition: "background 0.2s",
    }}
  >
    <td style={{ padding: "12px 8px", textAlign: "center" }}>
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => onSelect(matkul.id)}
        style={{ transform: "scale(1.2)" }}
      />
    </td>
    <td style={{ padding: "12px 8px" }}>{matkul.kode}</td>
    <td style={{ padding: "12px 8px" }}>{matkul.nama}</td>
    <td style={{ padding: "12px 8px", textAlign: "center" }}>{matkul.sks}</td>
    <td style={{ padding: "12px 8px" }}>{matkul.dosen}</td>
    <td style={{ padding: "12px 8px", textAlign: "center" }}>
      {matkul.ruangan}
    </td>
    <td style={{ padding: "12px 8px", textAlign: "center" }}>
      {matkul.jamMulai}
    </td>
  </tr>
);

export default function DashboardMahasiswa({ user }) {
  const [allMatakuliah, setAllMatakuliah] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [hasExistingKRS, setHasExistingKRS] = useState(false);
  const [nilai, setNilai] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const matkulRes = await getMatakuliah();
      setAllMatakuliah(matkulRes || []);

      const krsRes = await getKRS(user.username);
      if (krsRes.success && krsRes.krs && krsRes.krs.length > 0) {
        const latestKRS = krsRes.krs[0];
        setHasExistingKRS(true);
        const savedMatkulIds = new Set(latestKRS.matakuliah.map((mk) => mk.id));
        setSelectedIds(savedMatkulIds);
      } else {
        setHasExistingKRS(false);
        setSelectedIds(new Set());
      }

      const nilaiRes = await getNilai(user.username);
      // Hanya tampilkan nilai dari matkul yang ada di KRS
      setNilai(nilaiRes.nilai.filter((n) => n.nilai !== null) || []);
    } catch (error) {
      console.error("Gagal memuat data awal:", error);
      setMessage(
        "Gagal memuat data dari server. Cek koneksi atau log backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const handleSelectToggle = (matkulId) => {
    setSelectedIds((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(matkulId)
        ? newSelection.delete(matkulId)
        : newSelection.add(matkulId);
      return newSelection;
    });
  };

  const totalSKS = useMemo(
    () =>
      allMatakuliah
        .filter((mk) => selectedIds.has(mk.id))
        .reduce((sum, mk) => sum + mk.sks, 0),
    [selectedIds, allMatakuliah]
  );

  const isValidSKS = totalSKS >= 19 && totalSKS <= 24;

  const handleSubmit = async () => {
    if (!isValidSKS) {
      setMessage("Jumlah SKS tidak valid (harus antara 19-24).");
      return;
    }
    try {
      setMessage("Menyimpan KRS...");
      const res = await submitKRS(user.username, Array.from(selectedIds));
      setMessage(res.message || "KRS berhasil disimpan!");
      if (res.success) {
        await loadInitialData();
      }
    } catch (error) {
      setMessage("Terjadi error saat submit KRS. Cek log untuk detail.");
      console.error("Submit error:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        className="container card"
        style={{ padding: 32, textAlign: "center" }}
      >
        Memuat data mahasiswa...
      </div>
    );
  }

  return (
    <div
      className="container card"
      style={{ maxWidth: "1200px", margin: "32px auto", padding: "16px 24px" }}
    >
      <h2 style={{ color: "#1976d2" }}>Dashboard Mahasiswa</h2>

      <h3>Pilih Mata Kuliah</h3>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
        >
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: "12px 8px" }}>Pilih</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Kode</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>
                Nama Mata Kuliah
              </th>
              <th style={{ padding: "12px 8px" }}>SKS</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Dosen</th>
              <th style={{ padding: "12px 8px" }}>Ruangan</th>
              <th style={{ padding: "12px 8px" }}>Jam</th>
            </tr>
          </thead>
          <tbody>
            {allMatakuliah.length > 0 ? (
              allMatakuliah.map((mk) => (
                <MatakuliahRow
                  key={mk.id}
                  matkul={mk}
                  isSelected={selectedIds.has(mk.id)}
                  onSelect={handleSelectToggle}
                  isDisabled={!selectedIds.has(mk.id) && totalSKS + mk.sks > 24}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center" }}>
                  Tidak ada mata kuliah yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          margin: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontWeight: 500, fontSize: "1.1em" }}>
          Total SKS Dipilih:{" "}
          <b style={{ color: isValidSKS ? "#28a745" : "#dc3545" }}>
            {totalSKS}
          </b>{" "}
          (Wajib: 19-24)
        </div>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!isValidSKS}
        >
          {hasExistingKRS ? "Update KRS" : "Submit KRS"}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: 16,
            textAlign: "center",
            fontWeight: "bold",
            color: message.includes("berhasil") ? "#28a745" : "#dc3545",
          }}
        >
          {message}
        </div>
      )}

      <h3>Nilai & Kehadiran</h3>
      {/* --- BAGIAN TAMPILAN NILAI YANG BARU --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 16,
        }}
      >
        {nilai.length > 0 ? (
          nilai.map((item, index) => <NilaiCard key={index} item={item} />)
        ) : (
          <div
            style={{
              background: "#f8f9fa",
              padding: "24px",
              borderRadius: 8,
              textAlign: "center",
              color: "#6c757d",
            }}
          >
            Belum ada data nilai yang diinput oleh dosen.
          </div>
        )}
      </div>
    </div>
  );
}
