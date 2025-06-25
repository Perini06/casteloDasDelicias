import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222222',
    marginBottom: 8,
    lineHeight: 22,
  },
  convidado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 6,
    color: '#007AFF',
  },
  convidadoText: {
    fontSize: 16,
    color: '#222222',
    flexShrink: 1,
    lineHeight: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
})
