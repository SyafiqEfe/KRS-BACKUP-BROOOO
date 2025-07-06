import axios from "axios";

const API_URL = "http://localhost:8080";

export const login = async (username, password, role) => {
  const res = await axios.post(
    `${API_URL}/login`,
    new URLSearchParams({ username, password, role }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data;
};

export const registerMahasiswa = async (nama, password, dpaId = null) => {
  // Generate NIM random 8 digit
  const nim = Math.floor(10000000 + Math.random() * 90000000).toString();
  try {
    const params = new URLSearchParams({ nim, nama, password });
    if (dpaId !== null && dpaId !== undefined) {
      params.append("dpaId", dpaId);
    }
    const res = await axios.post(`${API_URL}/admin/mahasiswa`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  } catch (error) {
    // Log backend error message for easier debugging
    if (error.response && error.response.data) {
      console.error("Backend error:", error.response.data);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
  // NOTE: Pastikan backend menerima field nim, nama, password, dpaId (case-sensitive)
  // dan endpoint sudah benar. Jika masih error, cek backend validation dan log error di atas.
};

export const getMatakuliah = async () => {
  const res = await axios.get(`${API_URL}/matakuliah`);
  // Backend sekarang mengirim array langsung, jadi kita kembalikan saja res.data
  return res.data;
};

export const submitKRS = async (nim, matkulIds) => {
  const params = new URLSearchParams();
  params.append("nim", nim);
  matkulIds.forEach((id) => params.append("matkulIds[]", id));
  const res = await axios.post(`${API_URL}/krs/submit`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const getKRS = async (nim) => {
  const res = await axios.get(`${API_URL}/krs/${nim}`);
  return res.data;
};

export const inputNilai = async (krsDetailId, nilai, keterangan) => {
  const res = await axios.post(
    `${API_URL}/nilai/input`,
    new URLSearchParams({ krsDetailId, nilai, keterangan }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data;
};

export const getNilai = async (nim) => {
  const res = await axios.get(`${API_URL}/nilai/${nim}`);
  return res.data;
};
