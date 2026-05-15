import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');
    const hospitalId = localStorage.getItem('hospitalId');
    const doctorId = localStorage.getItem('doctorId');

    if (token && role) {
      setUser({ token, role, name, id, hospitalId, doctorId });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
    if (data.id) localStorage.setItem('id', data.id);
    if (data.hospitalId) localStorage.setItem('hospitalId', data.hospitalId);
    if (data.doctorId) localStorage.setItem('doctorId', data.doctorId);
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
