import React, { useState } from "react";
import { registerMahasiswa } from "../services/api";

export default function RegisterMahasiswa({ onRegister }) {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerMahasiswa(nama, password);
    if (res.success) {
      setNim(res.nim);
      onRegister && onRegister(res.nim);
    } else {
      setError(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Mahasiswa</h2>
      <input
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
      {nim && (
        <div>
          NIM Anda: <b>{nim}</b>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
