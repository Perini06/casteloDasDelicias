import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InitialScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CASTELO DAS DELÍCIAS</Text>
        {/* <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EABF9F',
  },
  header: {
    flex: 1,
    backgroundColor: '#4F2C24',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 16,
  },
  bottom: {
    backgroundColor: 'white',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    paddingHorizontal: 40,
    paddingTop: 48,
    paddingBottom: 80,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  greenButton: {
    backgroundColor: '#22c55e',
  },
  blueButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
