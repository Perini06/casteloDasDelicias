import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SobreScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📱 Projeto Modelo: Agendamento de Reuniões 📱</Text>

      <Text style={styles.paragraph}>
        Este é um aplicativo desenvolvido em React Native com o objetivo de servir como exemplo prático
        para alunos da Estácio na disciplina de Programação para Dispositivos Móveis (ARA0089).
      </Text>

      <Text style={styles.paragraph}>
        O app permite o agendamento de reuniões e o cadastro de pessoas, implementando operações básicas
        de CRUD (Create, Read, Update, Delete).
      </Text>

      <Text style={styles.subtitle}>🧾 Funcionalidades</Text>
      <Text style={styles.paragraph}>
        • Cadastro de pessoas com informações básicas.{"\n"}
        • Agendamento de reuniões vinculadas às pessoas cadastradas.{"\n"}
        • Listagem, edição e exclusão de registros.{"\n"}
        • Interface simples e intuitiva.
      </Text>

      <Text style={styles.subtitle}>🛠️ Tecnologias Utilizadas</Text>
      <Text style={styles.paragraph}>
        • React Native{"\n"}
        • Expo{"\n"}
        • React Navigation{"\n"}
        • Context API
      </Text>

      <Text style={styles.subtitle}>📌 Observações</Text>
      <Text style={styles.paragraph}>
        O aplicativo não possui autenticação de usuários; todas as funcionalidades estão disponíveis
        sem necessidade de login.{"\n"}
        Sinta-se à vontade para personalizar e expandir o projeto conforme suas necessidades e criatividade.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  }
});
