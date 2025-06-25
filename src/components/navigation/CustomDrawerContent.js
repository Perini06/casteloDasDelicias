// CustomDrawerContent.js
import React, { useContext } from 'react';
import { View, Image, Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { AuthContext } from '../../components/context/AuthContext'; // ajuste conforme seu path
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../../../assets/logo.png';
import styles from '../../styles/drawerStyles';
import { useNavigation } from '@react-navigation/native';

export default function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'InitialScreen' }],
            });
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.logoWrapper}>
        <Image source={LogoImage} style={styles.logo} />
      </View>
      <View style={styles.itemsWrapper}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={handleLogout}
          labelStyle={{ fontWeight: 'bold' }}
        />
      </View>
    </DrawerContentScrollView>
  );
}
