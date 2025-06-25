import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16
  },
  label: {
    fontSize: 14,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4
  },
  picker: {
    marginTop: 4
  },
  error: {
    color: '#c00',
    marginTop: 4,
    fontSize: 12
  },
  button: {
    marginTop: 32,
    backgroundColor: '#28a745',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#999'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
