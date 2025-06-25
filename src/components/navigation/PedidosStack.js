// PedidosStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggleButton } from '@react-navigation/drawer';

import PedidosListScreen from '../screens/PedidosListScreen';
import PedidosFormScreen from '../screens/PedidosFormScreen';
import PedidosConfirmScreen from '../screens/PedidosConfirmScreen';
import PedidosDetailScreen from '../screens/PedidosDetailScreen';
import { COLORS } from '../../styles/drawerStyles';

const Stack = createStackNavigator();

export default function PedidosStack() {
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
        name="PedidosList"
        component={PedidosListScreen}
        options={{
          title: 'Pedidos Realizados',
          headerLeft: () => <DrawerToggleButton tintColor={COLORS.white} />,
        }}
      />

      <Stack.Screen
        name="PedidosForm"
        component={PedidosFormScreen}
        options={{ title: 'Novo Pedido' }}
      />

      <Stack.Screen
        name="PedidosConfirm"
        component={PedidosConfirmScreen}
        options={{ title: 'Confirmar Pedido' }}
      />

      <Stack.Screen
        name="PedidosDetail"
        component={PedidosDetailScreen}
        options={{ title: 'Detalhes do Pedido' }}
      />
    </Stack.Navigator>
  );
}
