import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadPedidos,
  deletePedido,
  savePedidos,
  clearPedidos,
} from '../../storage/pedidosStorage';

export default function PedidosListScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [modalEntregaVisible, setModalEntregaVisible] = useState(false);
  const [pedidoEntrega, setPedidoEntrega] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const carregarPedidos = async () => {
    const all = await loadPedidos();
    setPedidos(all);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarPedidos);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmação',
      'Deseja excluir este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deletePedido(id);
            await carregarPedidos();
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('PedidosForm', { pedidoDraft: item });
  };

  const alterarStatus = async (id, novoStatus) => {
    const atualizados = pedidos.map(p =>
      p.id === id ? { ...p, status: novoStatus } : p
    );
    await savePedidos(atualizados);
    setPedidos(atualizados);
  };

  const abrirEntrega = (pedido) => {
    if (pedido.formaEntrega === 'entrega') {
      setPedidoEntrega(pedido);
      setModalEntregaVisible(true);
    }
  };

  const filtered = pedidos
    .filter(p =>
      p.cliente.toLowerCase().includes(searchText.toLowerCase()) ||
      p.itens.some(i => i.produto.nome.toLowerCase().includes(searchText.toLowerCase()))
    )
    .filter(p =>
      statusFiltro ? p.status === statusFiltro : true
    );

  const renderItem = ({ item }) => {
    const statusCor = item.status === 'Finalizado' ? '#4CAF50' :
                      item.status === 'Cancelado' ? '#F44336' : '#FFC107';
    const total = item.itens.reduce((acc, i) => acc + (i.produto.preco || 0) * i.quantidade, 0);
    const trocoCalculado = item.formaPagamento === 'dinheiro' && item.valorTroco && !isNaN(item.valorTroco)
      ? (parseFloat(item.valorTroco) - total).toFixed(2)
      : null;

    return (
      <TouchableOpacity style={styles.card} onPress={() => abrirEntrega(item)}>
        <View style={[styles.statusTag, { backgroundColor: statusCor }]} />
        <Text style={styles.horaPedido}>{item.horaPedido}</Text>
        <View style={styles.rowTop}>
          <View style={styles.infoContainer}>
            <Text style={styles.cliente}>{item.cliente}</Text>
            {item.formaEntrega === 'entrega' && (
              <Text style={styles.entregaLabel}>ENTREGA</Text>
            )}
            {item.itens.map((subitem, idx) => (
              <View key={idx}>
                <Text style={styles.sub}>
                  {subitem.quantidade}x {subitem.produto?.nome || subitem.produto?.codigo}
                </Text>
                {subitem.observacao && (
                  <Text style={styles.obs}>Obs: {subitem.observacao}</Text>
                )}
              </View>
            ))}
            <Text style={styles.sub}>Forma: {item.formaPagamento || 'N/A'}</Text>
            <Text style={styles.sub}>Total: R$ {total.toFixed(2)}</Text>
            {trocoCalculado && (
              <>
                <Text style={styles.sub}>Troco para: R$ {parseFloat(item.valorTroco).toFixed(2)}</Text>
                {trocoCalculado > 0 && <Text style={styles.sub}>Troco a dar: R$ {trocoCalculado}</Text>}
              </>
            )}
          </View>
          <View style={styles.actionsContainerRow}>
            <View style={styles.statusButtons}>
              <TouchableOpacity onPress={() => alterarStatus(item.id, 'Em Andamento')}>
                <View style={[styles.statusDot, { backgroundColor: '#FFC107' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alterarStatus(item.id, 'Finalizado')}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alterarStatus(item.id, 'Cancelado')}>
                <View style={[styles.statusDot, { backgroundColor: '#F44336' }]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="create-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <TextInput
          style={{
            height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
            paddingHorizontal: 10, backgroundColor: 'white', marginBottom: 8
          }}
          placeholder="Buscar cliente ou item..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
          {[
            { label: 'Sem Filtro', value: '', bg: '#ccc', text: '#000' },
            { label: 'Em Andamento', value: 'Em Andamento', bg: '#FFC107', text: '#000' },
            { label: 'Concluídos', value: 'Finalizado', bg: '#4CAF50', text: '#fff' },
            { label: 'Cancelados', value: 'Cancelado', bg: '#F44336', text: '#fff' }
          ].map((btn, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setStatusFiltro(btn.value)}
              style={{
                backgroundColor: btn.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                transform: [{ scale: statusFiltro === btn.value ? 1.1 : 1 }],
                elevation: statusFiltro === btn.value ? 4 : 0,
              }}
            >
              <Text style={{ color: btn.text }}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PedidosForm')}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={async () => {
          await clearPedidos();
          setPedidos([]);
          Alert.alert('Pronto', 'Todos os pedidos foram apagados.');
        }}>
        <Text>Limpar todos</Text>
      </TouchableOpacity>

      <Modal visible={modalEntregaVisible} transparent animationType="slide">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            width: '85%', backgroundColor: 'white',
            padding: 20, borderRadius: 12
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Endereço de Entrega</Text>
            {pedidoEntrega?.enderecoEntrega ? (
              <>
                <Text>CEP: {pedidoEntrega.enderecoEntrega.cep}</Text>
                <Text>Rua: {pedidoEntrega.enderecoEntrega.rua}</Text>
                <Text>Bairro: {pedidoEntrega.enderecoEntrega.bairro}</Text>
                <Text>Número: {pedidoEntrega.enderecoEntrega.numero}</Text>
                <Text>Complemento: {pedidoEntrega.enderecoEntrega.complemento}</Text>
                <Text>Referência: {pedidoEntrega.enderecoEntrega.referencia}</Text>
              </>
            ) : (
              <Text>Endereço não disponível.</Text>
            )}
            <TouchableOpacity
              onPress={() => setModalEntregaVisible(false)}
              style={{ marginTop: 12, alignSelf: 'flex-end' }}>
              <Text style={{ color: '#2196F3' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  listContainer: { paddingBottom: 120, paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 12,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6,
    elevation: 3, position: 'relative',
  },
  statusTag: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 10,
    borderTopLeftRadius: 12, borderBottomLeftRadius: 12,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  infoContainer: { flex: 1, paddingLeft: 16, paddingRight: 8, marginBottom: 12 },
  cliente: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sub: { fontSize: 14, color: '#555', marginTop: 2 },
  obs: { fontSize: 13, color: '#777', marginTop: 2, fontStyle: 'italic' },
  entregaLabel: {
    backgroundColor: '#2196F3', color: 'white', alignSelf: 'flex-start',
    fontSize: 12, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6, marginTop: 4,
  },
  actionsContainerRow: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  statusButtons: { flexDirection: 'row', marginBottom: 4, gap: 8 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  horaPedido: {
    position: 'absolute', right: 12, top: 8,
    fontSize: 12, color: '#999', fontStyle: 'italic'
  },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
  addButton: {
    position: 'absolute', bottom: 70, right: 20,
    backgroundColor: '#2196F3', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  clearButton: {
    position: 'absolute', bottom: 10, alignSelf: 'center',
    backgroundColor: '#eee', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, elevation: 2,
  },
});
