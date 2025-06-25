// PedidosFormScreen.js - Atualizado com forma de pagamento e campo de troco
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { loadProdutos } from '../../storage/produtosStorage';
import { Picker } from '@react-native-picker/picker';

export default function PedidosFormScreen({ navigation, route }) {
  const draft = route.params?.pedidoDraft;

  const [produtos, setProdutos] = useState([]);
  const [cliente, setCliente] = useState(draft?.cliente || '');
  const [produtoInput, setProdutoInput] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacaoItem, setObservacaoItem] = useState('');
  const [horaPedido, setHoraPedido] = useState('');
  const [itens, setItens] = useState(draft?.itens || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorTroco, setValorTroco] = useState('');
  const [formaEntrega, setFormaEntrega] = useState('');
  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    complemento: '',
    referencia: '',
  });

  useEffect(() => {
    const fetchProdutos = async () => {
      const all = await loadProdutos();
      setProdutos(all);
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    const now = new Date();
    const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setHoraPedido(hora);
  }, []);

  const handleQuantidadeChange = (delta) => {
    setQuantidade((prev) => Math.max(1, prev + delta));
  };

  const handleSelectProduto = (produto) => {
    setProdutoSelecionado(produto);
    setProdutoInput(`${produto.nome} (${produto.codigo})`);
    setShowDropdown(false);
  };

  const filteredProdutos = produtos.filter((p) => {
    const query = produtoInput.toLowerCase();
    return p.nome.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query);
  });

  const handleAddItem = () => {
    if (!produtoInput.trim()) {
      alert('Informe o produto.');
      return;
    }

    const produtoFinal = produtoSelecionado || { nome: produtoInput, codigo: produtoInput, preco: 0 };
    const novoItem = { produto: produtoFinal, quantidade, observacao: observacaoItem };
    setItens([...itens, novoItem]);
    setProdutoInput('');
    setProdutoSelecionado(null);
    setQuantidade(1);
    setObservacaoItem('');
    setShowDropdown(false);
  };

  const handleRemoveItem = (index) => {
    const updatedItens = [...itens];
    updatedItens[index].quantidade > 1 ? updatedItens[index].quantidade-- : updatedItens.splice(index, 1);
    setItens(updatedItens);
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + (item.produto.preco || 0) * item.quantidade, 0);
  };

  const handleNext = () => {
    if (itens.length === 0) return alert('Adicione ao menos um item ao pedido.');
    const pedido = {
      id: draft?.id || Date.now().toString(),
      cliente,
      itens,
      horaPedido,
      status: 'Em Andamento',
      formaPagamento,
      valorTroco: formaPagamento === 'dinheiro' ? valorTroco : null,
      formaEntrega,
      enderecoEntrega: formaEntrega === 'entrega' ? endereco : null,
    };
    navigation.navigate('PedidosConfirm', { pedidoDraft: pedido });
  };

  const total = calcularTotal();
  const trocoCalculado = valorTroco && !isNaN(valorTroco) ? (parseFloat(valorTroco) - total).toFixed(2) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>
      <TextInput style={styles.input} placeholder="Nome do Cliente" value={cliente} onChangeText={setCliente} />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Digite nome ou código..."
          value={produtoInput}
          onChangeText={(text) => {
            setProdutoInput(text);
            setProdutoSelecionado(null);
            setShowDropdown(text.length >= 3);
          }}
          onFocus={() => setShowDropdown(produtoInput.length >= 3)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name="add-circle" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {showDropdown && filteredProdutos.length > 0 && (
        <FlatList
          data={filteredProdutos}
          keyExtractor={(item) => item.id.toString()}
          style={styles.dropdown}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectProduto(item)}>
              <Text>{item.nome} ({item.codigo})</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantidadeChange(-1)}>
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantidade}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={() => handleQuantidadeChange(1)}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textarea}
        placeholder="Observação (opcional)"
        multiline
        value={observacaoItem}
        onChangeText={setObservacaoItem}
      />

      <View style={styles.entregaContainer}>
        {['loja', 'retirada', 'entrega'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.entregaOption,
              formaEntrega === tipo && styles.entregaOptionSelected,
            ]}
            onPress={() => setFormaEntrega(tipo)}
          >
            <Text style={{ color: formaEntrega === tipo ? '#fff' : '#333' }}>
              {tipo === 'loja'
                ? 'Consumir na Loja'
                : tipo === 'retirada'
                ? 'Retirada'
                : 'Entrega'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {formaEntrega === 'entrega' && (
        <View style={{ width: '80%' }}>
          <TextInput
            style={styles.input}
            placeholder="CEP"
            value={endereco.cep}
            onChangeText={(v) => setEndereco({ ...endereco, cep: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={endereco.rua}
            onChangeText={(v) => setEndereco({ ...endereco, rua: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={endereco.bairro}
            onChangeText={(v) => setEndereco({ ...endereco, bairro: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={endereco.numero}
            onChangeText={(v) => setEndereco({ ...endereco, numero: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Complemento"
            value={endereco.complemento}
            onChangeText={(v) => setEndereco({ ...endereco, complemento: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Ponto de Referência"
            value={endereco.referencia}
            onChangeText={(v) => setEndereco({ ...endereco, referencia: v })}
          />
        </View>
      )}

      <View style={styles.input}> 
        <Picker
          selectedValue={formaPagamento}
          onValueChange={setFormaPagamento}
          style={Platform.OS === 'ios' ? {} : { height: 48 }}
        >
          <Picker.Item label="Escolher forma de pagamento" value="" />
          <Picker.Item label="PIX" value="pix" />
          <Picker.Item label="Crédito/Débito" value="cartao" />
          <Picker.Item label="Dinheiro" value="dinheiro" />
        </Picker>
      </View>

      {formaPagamento === 'dinheiro' && (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Troco pra quanto?"
          value={valorTroco}
          onChangeText={setValorTroco}
        />
      )}

      <Button mode="contained" onPress={handleNext} style={styles.avancarButton} contentStyle={{ paddingVertical: 8 }}>
        Avançar
      </Button>

      {itens.length > 0 && (
        <View style={styles.comandaBox}>
          <Text style={styles.comandaTitle}>Itens da Comanda:</Text>
          {itens.map((item, index) => (
            <View key={index} style={styles.itemBox}>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.quantidade}x {item.produto.nome || item.produto.codigo}
                  {typeof item.produto.preco === 'number' ? ` (R$${item.produto.preco.toFixed(2)})` : ''}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <Ionicons name="remove-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
              {item.observacao ? <Text style={styles.itemObs}>Obs: {item.observacao}</Text> : null}
            </View>
          ))}
          <Text style={[styles.itemName, { marginTop: 8 }]}>Total da Comanda: R$ {total.toFixed(2)}</Text>
          {formaPagamento === 'dinheiro' && trocoCalculado > 0 && (
            <Text style={[styles.itemName, { marginTop: 4 }]}>Troco: R$ {trocoCalculado}</Text>
          )}

          
        </View>
      )}
    </ScrollView>
  );
}

// Estilos permanecem os mesmos do seu código anterior


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 14,
  },
  textarea: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: 'white',
    fontSize: 14,
  },
  row: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qtyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  qtyText: {
    marginHorizontal: 14,
    fontSize: 16,
  },
  avancarButton: {
    width: 140,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  comandaBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  comandaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  itemBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemObs: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  entregaContainer: {
  width: '80%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
},
entregaOption: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  borderRadius: 6,
  alignItems: 'center',
  marginHorizontal: 4,
  backgroundColor: '#eee',
},
entregaOptionSelected: {
  backgroundColor: '#2196F3',
},

});
