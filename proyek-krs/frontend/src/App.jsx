import React, { useState } from "react";
import Login from "./pages/Login";
import RegisterMahasiswa from "./pages/RegisterMahasiswa";
import DashboardMahasiswa from "./pages/DashboardMahasiswa";
import DashboardDosen from "./pages/DashboardDosen";
import DashboardAdmin from "./pages/DashboardAdmin";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <div>
        <button onClick={() => setShowRegister(false)}>Login</button>
        <button onClick={() => setShowRegister(true)}>
          Register Mahasiswa
        </button>
        {showRegister ? (
          <RegisterMahasiswa onRegister={(nim) => setShowRegister(false)} />
        ) : (
          <Login onLogin={setUser} />
        )}
      </div>
    );
  }

  if (user.role === "mahasiswa") {
    return <DashboardMahasiswa user={user} />;
  }
  if (user.role === "dosen") {
    return <DashboardDosen user={user} />;
  }
  if (user.role === "admin") {
    return <DashboardAdmin />;
  }
  return <div>Dashboard untuk {user.role} belum tersedia.</div>;
}

export default App;
