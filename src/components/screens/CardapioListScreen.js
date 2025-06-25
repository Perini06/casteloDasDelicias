// CardapioUserScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  BackHandler
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { loadProdutos } from '../../storage/produtosStorage';

export default function CardapioUserScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [sacola, setSacola] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoFeito, setPedidoFeito] = useState(false);
  const flatListRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setSacola([]);
        setPedidoFeito(true);
      });
      return unsubscribe;
    }, [navigation])
  );

  useEffect(() => {
    const fetch = async () => {
      const all = await loadProdutos();
      setProdutos(all);
    };
    fetch();
  }, []);

  const categorias = [...new Set(produtos.map(p => p.categoria || 'Sem Categoria'))];

  const handleAddToSacola = () => {
    const itemExistente = sacola.find(i => i.produto.id === selectedProduto.id);
    if (itemExistente) {
      setSacola(sacola.map(i =>
        i.produto.id === selectedProduto.id
          ? { ...i, quantidade: i.quantidade + quantidade }
          : i
      ));
    } else {
      setSacola([...sacola, { produto: selectedProduto, quantidade }]);
    }
    setModalVisible(false);
    setQuantidade(1);
  };

  const handleRemoveItem = (index) => {
    const novaSacola = [...sacola];
    if (novaSacola[index].quantidade > 1) {
      novaSacola[index].quantidade--;
    } else {
      novaSacola.splice(index, 1);
    }
    setSacola(novaSacola);
  };

  const handleOpenModal = (produto) => {
    setSelectedProduto(produto);
    setQuantidade(1);
    setModalVisible(true);
  };

  const totalSacola = sacola.reduce((acc, item) => acc + (parseFloat(item.produto.preco) || 0) * item.quantidade, 0);

  const renderProduto = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.sub}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenModal(item)}>
        <Text style={{ color: 'white' }}>Adicionar Produto</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {categorias.map((cat, idx) => (
          <View key={idx}>
            <Text style={styles.categoriaTitle}>{cat}</Text>
            {produtos
              .filter(p => (p.categoria || 'Sem Categoria') === cat)
              .map(p => renderProduto({ item: p }))}
          </View>
        ))}
      </ScrollView>

      {sacola.length > 0 && (
        <View style={styles.footer}>
          {sacola.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.quantidade}x {item.produto.nome}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveItem(i)}>
                <Ionicons name="remove-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.total}>Total: R$ {totalSacola.toFixed(2)}</Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: '#f44336' }]}
              onPress={() => setSacola([])}
            >
              <Text style={{ color: 'white' }}>Cancelar Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => {
                navigation.navigate('AvancarPedidoUserScreen', { sacola });
                setPedidoFeito(true);
              }}
            >
              <Text style={{ color: 'white' }}>Realizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.sacolaFixed}
        onPress={() => navigation.navigate('AvancarPedidoUserScreen')}
      >
        <Ionicons name="receipt-outline" size={28} color="#fff" />
        {pedidoFeito && (
          <View style={styles.notificacao} />
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedProduto?.nome}</Text>
            <Text style={styles.modalPrice}>Preço Unitário: R$ {parseFloat(selectedProduto?.preco).toFixed(2)}</Text>

            <View style={styles.qtdRow}>
              <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))}>
                <Ionicons name="remove-circle" size={28} color="red" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20 }}>{quantidade}</Text>
              <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)}>
                <Ionicons name="add-circle" size={28} color="green" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTotal}>Total: R$ {(parseFloat(selectedProduto?.preco) * quantidade).toFixed(2)}</Text>

            <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToSacola}>
              <Text style={{ color: 'white' }}>Adicionar à Sacola</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#555' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriaTitle: { fontWeight: 'bold', fontSize: 18, margin: 10 },
  card: { flexDirection: 'row', backgroundColor: '#fff', margin: 8, padding: 10, borderRadius: 8, elevation: 2 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  sub: { fontSize: 14, color: '#777' },
  addBtn: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 6 },
  footer: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 24,
    marginBottom: 68,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  total: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  itemText: { fontSize: 14, marginVertical: 2 },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalPrice: { fontSize: 14, marginVertical: 4 },
  qtdRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 12, gap: 12 },
  modalTotal: { fontSize: 16, fontWeight: 'bold' },
  modalAddButton: { marginTop: 10, backgroundColor: '#4CAF50', padding: 10, borderRadius: 6, alignItems: 'center' },
  sacolaFixed: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 30,
    zIndex: 999,
  },
  notificacao: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  }
});
