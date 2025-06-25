//pedidosStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
const PEDIDOS_KEY = '@app:pedidos';

export const loadPedidos = async () => {
  try {
    const json = await AsyncStorage.getItem(PEDIDOS_KEY);
    if (!json) return [];
    return JSON.parse(json);
  } catch (e) {
    console.error('Erro ao carregar pedidos', e);
    return [];
  }
};

export const savePedidos = async (pedidos) => {
  try {
    await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
  } catch (e) {
    console.error('Erro ao salvar pedidos', e);
  }
};

//deletar pedidos
export const deletePedido = async (id) => {
  try {
    const all = await loadPedidos();
    const filtered = all.filter(p => p.id !== id);
    await savePedidos(filtered);
  } catch (e) {
    console.error('Erro ao excluir pedido', e);
  }
};

export const updatePedido = async (pedidoAtualizado) => {
  try {
    const all = await loadPedidos();
    const updated = all.map(p =>
      p.id === pedidoAtualizado.id ? pedidoAtualizado : p
    );
    await savePedidos(updated);
  } catch (e) {
    console.error('Erro ao atualizar pedido', e);
  }
};

export const clearPedidos = async () => {
  try {
    await AsyncStorage.removeItem(PEDIDOS_KEY);
    console.log('Storage de pedidos limpo.');
  } catch (e) {
    console.error('Erro ao limpar storage de pedidos', e);
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage todo limpo.');
  } catch (e) {
    console.error('Erro ao limpar AsyncStorage', e);
  }
};
