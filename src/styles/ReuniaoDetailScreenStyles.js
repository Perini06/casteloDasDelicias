import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F2F4F8'
  },
  notFound: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 40
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevação Android
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 12
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    lineHeight: 22
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: '#34C759'
  },
  deleteButton: {
    backgroundColor: '#FF3B30'
  },
  backButton: {
    backgroundColor: '#007AFF'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
