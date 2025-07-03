import axios from "axios";
const API_URL = "http://localhost:8080";

export const getMatkulDosen = async (nidn) => {
  const res = await axios.get(`${API_URL}/dosen/${nidn}/matkul`);
  return res.data;
};

export const getMahasiswaMatkul = async (nidn, matkulId) => {
  const res = await axios.get(
    `${API_URL}/dosen/${nidn}/matkul/${matkulId}/mahasiswa`
  );
  return res.data;
};
