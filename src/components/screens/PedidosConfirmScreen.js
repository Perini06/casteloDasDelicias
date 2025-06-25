// PedidosConfirmScreen.js - Atualizado com listagem completa e forma de pagamento
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import uuid from 'react-native-uuid';
import { savePedidos, loadPedidos } from '../../storage/pedidosStorage';

export default function PedidosConfirmScreen({ route, navigation }) {
  const { pedidoDraft } = route.params;

  const onConfirm = async () => {
    const all = await loadPedidos();
    const filtered = all.filter(p => p.id !== pedidoDraft.id);

    const novoPedido = {
      ...pedidoDraft,
      id: pedidoDraft.id || uuid.v4(),
      status: pedidoDraft.status || 'Em Andamento',
    };

    await savePedidos([...filtered, novoPedido]);
    navigation.popToTop();
  };

  const total = pedidoDraft.itens.reduce((acc, item) => acc + (item.produto.preco || 0) * item.quantidade, 0).toFixed(2);
  const trocoCalculado = pedidoDraft.formaPagamento === 'dinheiro' && pedidoDraft.valorTroco && !isNaN(pedidoDraft.valorTroco)
    ? (parseFloat(pedidoDraft.valorTroco) - total).toFixed(2)
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Revise seu Pedido</Text>

      <Text style={styles.label}>Cliente:</Text>
      <Text style={styles.value}>{pedidoDraft.cliente}</Text>

      <Text style={styles.label}>Itens:</Text>
      {pedidoDraft.itens.map((item, index) => (
        <View key={index} style={{ marginBottom: 6 }}>
          <Text style={styles.value}>
            {item.quantidade}x {item.produto.nome || item.produto.codigo}
            {typeof item.produto.preco === 'number' ? ` (R$${item.produto.preco.toFixed(2)})` : ''}
          </Text>
          {item.observacao ? (
            <Text style={[styles.value, { fontStyle: 'italic' }]}>Obs: {item.observacao}</Text>
          ) : null}
        </View>
      ))}

      <Text style={styles.label}>Total:</Text>
      <Text style={styles.value}>R$ {total}</Text>

      <Text style={styles.label}>Forma de Pagamento:</Text>
      <Text style={styles.value}>{pedidoDraft.formaPagamento || 'N/A'}</Text>

      {pedidoDraft.formaPagamento === 'dinheiro' && pedidoDraft.valorTroco && (
        <>
          <Text style={styles.label}>Troco para:</Text>
          <Text style={styles.value}>R$ {parseFloat(pedidoDraft.valorTroco).toFixed(2)}</Text>
          {trocoCalculado > 0 && (
            <>
              <Text style={styles.label}>Troco a dar:</Text>
              <Text style={styles.value}>R$ {trocoCalculado}</Text>
            </>
          )}
        </>
      )}

      <Text style={styles.label}>Hora do Pedido:</Text>
      <Text style={styles.value}>{pedidoDraft.horaPedido}</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar e Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.buttonText}>Confirmar e Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    backgroundColor: '#f0ad4e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#5cb85c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
