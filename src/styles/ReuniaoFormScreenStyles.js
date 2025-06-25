import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
  convidadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  convidadoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555555',
  },
  reviewButton: {
    marginTop: 24,
    borderRadius: 6,
    overflow: 'hidden', // para o button respeitar o borderRadius
    backgroundColor: '#007AFF',
  },
})
