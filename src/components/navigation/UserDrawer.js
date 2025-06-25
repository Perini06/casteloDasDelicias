import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import PessoasStack from './PessoasStack';
import PedidosStack from './PedidosStack';
import SobreStack from './SobreStack';
import CardapioStack from './CardapioStack';
import styles from '../../styles/drawerStyles';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="CardapioStack"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerIcon: ({ color, size }) => {
          const icons = {
            Pedidos: 'cart-outline',
            Pessoas: 'people-outline',
            Sobre:   'information-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#CCCCCC',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: 'rgb(0, 107, 179)',
        },
      })}
      drawerStyle={styles.drawerStyle}
      drawerContentOptions={styles.drawerContentOptions}
    >
      <Drawer.Screen
        name="CardapioStack"
        component={CardapioStack}
        options={{ drawerLabel: 'Cardápio' }}
      />
      {/* <Drawer.Screen
        name="Historico"
        component={HistoricoStack}
        options={{ drawerLabel: 'Histórico de Pedidos' }}
      /> */}
      <Drawer.Screen
        name="Sobre"
        component={SobreStack}
        options={{
          title: 'Sobre o App',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}



