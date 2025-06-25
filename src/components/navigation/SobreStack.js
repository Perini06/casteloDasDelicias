import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggleButton } from '@react-navigation/drawer';

import SobreScreen from '../screens/SobreScreen';
import { COLORS } from '../../styles/drawerStyles';

const Stack = createStackNavigator();

export default function SobreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.lightBlue,
        },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen
        name="Sobre"
        component={SobreScreen}
        options={{
          title: 'Sobre o App',
          headerLeft: () => <DrawerToggleButton tintColor={COLORS.white} />,
        }}
      />
    </Stack.Navigator>
  );
}
