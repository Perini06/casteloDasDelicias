import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUTOS_KEY = '@app:produtos';
const CATEGORIAS_KEY = '@app:categorias';

export const loadProdutos = async () => {
  try {
    const json = await AsyncStorage.getItem(PRODUTOS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Erro carregando produtos', e);
    return [];
  }
};

export const saveProdutos = async (produtos) => {
  try {
    const json = JSON.stringify(produtos);
    await AsyncStorage.setItem(PRODUTOS_KEY, json);

    // Atualizar lista de categorias salvas
    const categoriasUnicas = [
      ...new Set(produtos.map(p => (p.categoria ? p.categoria : 'Sem Categoria'))),
    ];
    await AsyncStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasUnicas));
  } catch (e) {
    console.error('Erro salvando produtos', e);
  }
};

export const loadCategorias = async () => {
  try {
    const json = await AsyncStorage.getItem(CATEGORIAS_KEY);
    return json != null ? JSON.parse(json) : ['Sem Categoria'];
  } catch (e) {
    console.error('Erro carregando categorias', e);
    return ['Sem Categoria'];
  }
};

export const deleteProduto = async (id) => {
  try {
    const todos = await loadProdutos();
    const atualizados = todos.filter(p => p.id !== id);
    await saveProdutos(atualizados);
    console.log('Produto excluído com sucesso.');
  } catch (e) {
    console.error('Erro excluindo produto', e);
  }
};

export const updateProduto = async (produtoAtualizado) => {
  try {
    const todos = await loadProdutos();
    const atualizados = todos.map(p =>
      p.id === produtoAtualizado.id ? produtoAtualizado : p
    );
    await saveProdutos(atualizados);
  } catch (e) {
    console.error('Erro atualizando produto', e);
  }
};

export const clearProdutos = async () => {
  try {
    await AsyncStorage.removeItem(PRODUTOS_KEY);
    await AsyncStorage.removeItem(CATEGORIAS_KEY);
    console.log('Storage de produtos e categorias limpo.');
  } catch (e) {
    console.error('Erro ao limpar storage de produtos', e);
  }
};

export const clearAllProdutos = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage todo limpo.');
  } catch (e) {
    console.error('Erro ao limpar todo o AsyncStorage', e);
  }
};
