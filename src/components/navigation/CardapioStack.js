// PedidosStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggleButton } from '@react-navigation/drawer';

import CardapioListScreen from '../screens/CardapioListScreen';
import AvancarPedidoUserScreen from '../screens/AvancarPedidoUserScreen';

import { COLORS } from '../../styles/drawerStyles';

const Stack = createStackNavigator();

export default function CardapioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          // backgroundColor: COLORS.lightBlue,
          backgroundColor: ('#4D2E32'),
        },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen
        name="CardapioListScreen"
        component={CardapioListScreen}
        options={{
          title: 'Cardápio',
          headerLeft: () => <DrawerToggleButton tintColor={COLORS.white} />,
        }}
      />

      <Stack.Screen
        name="AvancarPedidoUserScreen"
        component={AvancarPedidoUserScreen}
        options={{ title: 'Novo Pedido' }}
      />

    </Stack.Navigator>
  );
}
