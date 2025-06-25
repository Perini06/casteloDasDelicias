// AvancarPedidoUserScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { savePedidos, loadPedidos } from '../../storage/pedidosStorage';
import uuid from 'react-native-uuid';

export default function AvancarPedidoUserScreen({ route, navigation }) {
  const { sacola } = route.params;

  const [cliente, setCliente] = useState('');
  const [observacao, setObservacao] = useState('');
  const [formaEntrega, setFormaEntrega] = useState('entrega'); // padrão: entrega
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorTroco, setValorTroco] = useState('');
  const [endereco, setEndereco] = useState({
    cep: '', rua: '', bairro: '', numero: '', complemento: '', referencia: ''
  });

  const total = sacola.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  const horaPedido = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!cliente.trim()) {
      return Alert.alert('Erro', 'Informe o nome do cliente.');
    }

    const novoPedido = {
      id: uuid.v4(),
      cliente,
      itens: sacola,
      observacao,
      status: 'Em Andamento',
      horaPedido: horaPedido(),
      formaPagamento,
      valorTroco: formaPagamento === 'dinheiro' ? valorTroco : null,
      formaEntrega,
      enderecoEntrega: formaEntrega === 'entrega' ? endereco : null,
    };

    const todos = await loadPedidos();
    await savePedidos([...todos, novoPedido]);

    Alert.alert('Pronto!', 'Pedido realizado com sucesso.');
    navigation.popToTop(); // volta para o Cardápio
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Finalizar Pedido</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <TextInput
        style={styles.textarea}
        placeholder="Observações"
        value={observacao}
        onChangeText={setObservacao}
        multiline
      />

      <Text style={styles.label}>Como deseja consumir?</Text>
      <View style={styles.entregaContainer}>
        {['loja', 'retirada', 'entrega'].map(tipo => (
          <TouchableOpacity
            key={tipo}
            style={[styles.entregaBtn, formaEntrega === tipo && styles.entregaSelecionado]}
            onPress={() => setFormaEntrega(tipo)}
          >
            <Text style={formaEntrega === tipo ? styles.entregaSelecionadoText : styles.entregaText}>
              {tipo === 'loja' ? 'Na Loja' : tipo === 'retirada' ? 'Retirada' : 'Entrega'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {formaEntrega === 'entrega' && (
        <>
          <TextInput style={styles.input} placeholder="CEP" value={endereco.cep} onChangeText={v => setEndereco({ ...endereco, cep: v })} />
          <TextInput style={styles.input} placeholder="Rua" value={endereco.rua} onChangeText={v => setEndereco({ ...endereco, rua: v })} />
          <TextInput style={styles.input} placeholder="Bairro" value={endereco.bairro} onChangeText={v => setEndereco({ ...endereco, bairro: v })} />
          <TextInput style={styles.input} placeholder="Número" value={endereco.numero} onChangeText={v => setEndereco({ ...endereco, numero: v })} />
          <TextInput style={styles.input} placeholder="Complemento" value={endereco.complemento} onChangeText={v => setEndereco({ ...endereco, complemento: v })} />
          <TextInput style={styles.input} placeholder="Referência" value={endereco.referencia} onChangeText={v => setEndereco({ ...endereco, referencia: v })} />
        </>
      )}

      <Text style={styles.label}>Forma de Pagamento</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={formaPagamento}
          onValueChange={setFormaPagamento}
          style={Platform.OS === 'ios' ? {} : { height: 48 }}
        >
          <Picker.Item label="Escolher..." value="" />
          <Picker.Item label="PIX" value="pix" />
          <Picker.Item label="Cartão" value="cartao" />
          <Picker.Item label="Dinheiro" value="dinheiro" />
        </Picker>
      </View>

      {formaPagamento === 'dinheiro' && (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Troco para quanto?"
          value={valorTroco}
          onChangeText={setValorTroco}
        />
      )}

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f8f8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
    backgroundColor: 'white',
  },
  textarea: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 12, minHeight: 60, textAlignVertical: 'top',
    backgroundColor: 'white', marginBottom: 16,
  },
  entregaContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12,
  },
  entregaBtn: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    marginHorizontal: 4, padding: 10, borderRadius: 6,
    alignItems: 'center', backgroundColor: '#eee',
  },
  entregaSelecionado: {
    backgroundColor: '#2196F3',
  },
  entregaText: { color: '#333' },
  entregaSelecionadoText: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginBottom: 4, marginLeft: 4 },
  total: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  confirmBtn: {
    backgroundColor: '#4CAF50', padding: 12,
    borderRadius: 8, alignItems: 'center',
  },
});
