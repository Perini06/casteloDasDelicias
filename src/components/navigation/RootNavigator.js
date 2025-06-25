// RootNavigator.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AdminFuncDrawer from './AdminFuncDrawer';
import UserDrawer from './UserDrawer';
// import AdminDrawer from './AdminDrawer'; // se quiser criar

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  console.log('Usuário logado:', user);

  if (!user || !user.role || user.role === 'null') {
    // Usuário não autenticado ou com role inválida
    return <AuthStack />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminFuncDrawer/>; // Troque por <AdminDrawer /> se criar
    case 'cliente':
      return <UserDrawer/>;
    case 'func':
      return <AdminFuncDrawer />;
    default:
      return <AuthStack />;
  }
}
