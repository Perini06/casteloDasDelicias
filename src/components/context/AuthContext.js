//AuthContext.js
// src/components/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5237/api/Auth/login', {
        login: username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));

        const userData = {
          token,
          role: payload.role?.toLowerCase() || 'user',
          username: payload.unique_name,
          setor: payload.Setor,
        };

        setUser(userData);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  };

  const register = async (username, password, role, setor) => {
    try {
      const response = await axios.post('http://localhost:5237/api/Usuarios/Criar', {
        username,
        password,
        role,
        setor,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error('Erro ao registrar');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    console.log('Logout executado.');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
