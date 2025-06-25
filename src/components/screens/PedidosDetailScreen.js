// PedidosDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import styles from '../../styles/ReuniaoDetailScreenStyles';
import { loadPedidos, savePedidos } from '../../storage/pedidosStorage';

export default function PedidosDetailScreen({ route, navigation }) {
  const pedidoId = route.params?.pedidoId;
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    if (!pedidoId) return;
    loadPedidos().then(all => {
      const p = all.find(x => x.id === pedidoId);
      setPedido(p || null);
    });
  }, [pedidoId]);

  const onDelete = () => {
    Alert.alert(
      'Excluir Pedido',
      'Deseja realmente excluir este Pedido?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            const all = await loadPedidos();
            const filtered = all.filter(p => p.id !== pedidoId);
            await savePedidos(filtered);
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (!pedido) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Pedido não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Detalhes do Pedido</Text>

      <View style={styles.card}>
        <Image source={{ uri: pedido.image }} style={{ width: 150, height: 150, marginBottom: 15 }} />
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{pedido.name}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.value}>{pedido.description}</Text>

        <Text style={styles.label}>Preço</Text>
        <Text style={styles.value}>R$ {pedido.price}</Text>

        <Text style={styles.label}>Observações</Text>
        <Text style={styles.value}>{pedido.observacao}</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('PedidosForm', { pedidoDraft: pedido })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
