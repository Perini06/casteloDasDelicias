// AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// importar para teste como rota inicial o meu UserDrawer
import AdminFuncDrawer from './AdminFuncDrawer'; // se quiser testar como rota inicial
import UserDrawer from './UserDrawer'; // se quiser testar como rota inicial

// importando as telas necessárias para o AuthStack


const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
      // coloque o Drawer aqui se quiser testar como rota inicial
        name="AdminFuncDrawer"
        component={AdminFuncDrawer}
        options={{ headerShown: false }}

        // name="UserDrawer"
        // component={UserDrawer}
        // options={{ headerShown: false }}
        
    
        
        
        // name="Initial"
        // component={InitialScreen}
        // options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registrar-se' }}
      />
    </Stack.Navigator>
  );
}
