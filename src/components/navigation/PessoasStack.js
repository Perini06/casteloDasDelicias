import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggleButton } from '@react-navigation/drawer';

import ProdutosListScreen from '../screens/ProdutosListScreen';
import ProdutoFormScreen from '../screens/ProdutoFormScreen';
import { COLORS } from '../../styles/drawerStyles';

const Stack = createStackNavigator();

export default function ProdutosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          // backgroundColor: COLORS.lightBlue,
          backgroundColor: ('#7B4534'),
        },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen
        name="ProdutosList"
        component={ProdutosListScreen}
        options={{
          title: 'Lista de Produtos',
          headerLeft: () => <DrawerToggleButton tintColor={COLORS.white} />,
        }}
      />

      <Stack.Screen
        name="ProdutoForm"
        component={ProdutoFormScreen}
        options={{ title: 'Cadastro de Produto' }}
      />
    </Stack.Navigator>
  );
}
