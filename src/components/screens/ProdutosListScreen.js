import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadProdutos,
  deleteProduto,
  clearAllProdutos,
  saveProdutos,
} from '../../storage/produtosStorage';

export default function ProdutosListScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNome, setEditedNome] = useState('');
  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const carregarProdutos = async () => {
    const all = await loadProdutos();
    setProdutos(all);
    const categorias = [...new Set(all.map(p => p.categoria || 'Sem Categoria'))];
    setUniqueCategories(categorias);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarProdutos);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteProduto(id);
            await carregarProdutos();
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('ProdutoForm', { produto: item });
  };

  const handleImagePress = () => {
    Alert.alert('Imagem', 'Aqui vai abrir a galeria futuramente.');
  };

  const openDetail = (item) => {
    setSelectedProduto(item);
    setEditedNome(item.nome);
    setEditMode(false);
    setModalVisible(true);
  };

  const confirmEdit = async () => {
    const atualizados = produtos.map(p =>
      p.id === selectedProduto.id ? { ...p, nome: editedNome } : p
    );
    await saveProdutos(atualizados);
    setProdutos(atualizados);
    setSelectedProduto(prev => ({ ...prev, nome: editedNome }));
    setEditMode(false);
  };

  const filteredProdutos = produtos.filter(item => {
    const query = searchText.toLowerCase();
    return (
      item.nome.toLowerCase().includes(query) ||
      item.codigo.toLowerCase().includes(query) ||
      (item.observacao && item.observacao.toLowerCase().includes(query))
    );
  });

  const groupedData = [];
  uniqueCategories.forEach(category => {
    groupedData.push({ type: 'header', title: category });
    filteredProdutos
      .filter(p => (p.categoria || 'Sem Categoria') === category)
      .forEach(p => groupedData.push({ type: 'item', ...p }));
  });

  const getItemLayout = (data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  });

  const scrollToCategory = (category) => {
    const index = groupedData.findIndex(item => item.type === 'header' && item.title === category);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryHeaderText}>{item.title}</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={() => openDetail(item)}>
        <View style={styles.card}>
          <TouchableOpacity onPress={handleImagePress} style={styles.imageContainer}>
            {item.imagem ? (
              <Image source={{ uri: item.imagem }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>+ Imagem</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.sub}>Código: {item.codigo} • R$ {parseFloat(item.preco).toFixed(2)}</Text>
          </View>
          <View style={styles.actionsContainer}>
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
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar produto..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {uniqueCategories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tabButton}
              onPress={() => scrollToCategory(cat)}
            >
              <Text style={styles.tabText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={flatListRef}
        data={groupedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={20}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ProdutoForm')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={async () => {
          try {
            await clearAllProdutos();
            setProdutos([]);
            Alert.alert('Pronto', 'Todos os produtos foram apagados.');
          } catch (e) {
            console.error('Erro ao limpar produtos', e);
          }
        }}
      >
        <Text>Limpar tudo</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduto?.imagem ? (
              <Image source={{ uri: selectedProduto.imagem }} style={styles.modalImage} />
            ) : (
              <TouchableOpacity onPress={handleImagePress} style={[styles.modalImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>+ Imagem</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {editMode ? (
              <TextInput
                style={styles.editInput}
                value={editedNome}
                onChangeText={setEditedNome}
              />
            ) : (
              <Text style={styles.modalTitle}>{selectedProduto?.nome}</Text>
            )}
            <Text style={styles.modalSubtitle}>{selectedProduto?.observacao}</Text>
            <Text style={styles.modalPrice}>R$ {parseFloat(selectedProduto?.preco).toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              {editMode && (
                <Pressable style={styles.confirmButton} onPress={confirmEdit}>
                  <Text style={{ color: 'white' }}>Confirmar</Text>
                </Pressable>
              )}
              <Pressable
                style={editMode ? styles.cancelButton : styles.editButton}
                onPress={() => setEditMode(!editMode)}
              >
                <Ionicons name="create-outline" size={20} color="white" />
                <Text style={{ color: 'white', marginLeft: 6 }}>{editMode ? 'Cancelar' : 'Editar Nome'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  tabsWrapper: { height: 50, marginBottom: 10 },
  tabButton: { backgroundColor: '#ccc', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8 },
  tabText: { color: '#333', fontWeight: 'bold' },
  categoryHeader: { backgroundColor: '#ddd', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8 },
  categoryHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  searchBar: { height: 40, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10, borderRadius: 5, marginBottom: 10, backgroundColor: 'white' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  imageContainer: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  placeholderText: { color: '#777', fontSize: 12 },
  textContainer: { flex: 1 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sub: { fontSize: 14, color: '#777', marginTop: 4 },
  actionsContainer: { flexDirection: 'row', gap: 12, marginLeft: 12 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
  addButton: { position: 'absolute', bottom: 70, right: 20, backgroundColor: '#1492cc', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  clearButton: { position: 'absolute', bottom: 10, alignSelf: 'center', backgroundColor: '#eee', paddingHorizontal: 20, paddingVertical: 10, marginVertical: 45, borderRadius: 20 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', alignItems: 'center' },
  modalImage: { width: '100%', height: 200, resizeMode: 'cover' },
  closeButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 20, padding: 4, zIndex: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 12, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginTop: 4, paddingHorizontal: 16, textAlign: 'center' },
  modalPrice: { fontSize: 18, color: '#FF9800', fontWeight: 'bold', marginTop: 10, marginBottom: 16 },
  editInput: { borderBottomWidth: 1, borderColor: '#ccc', width: '80%', fontSize: 18, marginTop: 10, textAlign: 'center' },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  confirmButton: { backgroundColor: '#2196F3', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F44336', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
});
