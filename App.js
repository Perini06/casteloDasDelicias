//App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import AppDrawer from './src/components/navigation/AppDrawer';
import RootNavigator from './src/components/navigation/RootNavigator';
import { AuthProvider } from './src/components/context/AuthContext';

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <AuthProvider>
        <NavigationContainer >
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
      
    </>
  );
}