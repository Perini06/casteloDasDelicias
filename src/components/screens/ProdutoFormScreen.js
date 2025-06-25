// ProdutoFormScreen.js
import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
  FlatList,
} from 'react-native';
import uuid from 'react-native-uuid';
import { saveProdutos, loadProdutos, loadCategorias } from '../../storage/produtosStorage';

export default function ProdutoFormScreen({ navigation, route }) {
  const produtoToEdit = route.params?.produto;
  const isEditing = Boolean(produtoToEdit);

  const initialForm = {
    id: '',
    nome: '',
    codigo: '',
    observacao: '',
    preco: '',
    categoria: '',
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? 'Editar Produto' : 'Novo Produto',
    });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setForm({
        id: produtoToEdit.id,
        nome: produtoToEdit.nome,
        codigo: produtoToEdit.codigo,
        observacao: produtoToEdit.observacao || '',
        preco: produtoToEdit.preco,
        categoria: produtoToEdit.categoria || '',
      });
    } else {
      setForm(initialForm);
    }
    fetchCategorias();
  }, [isEditing, produtoToEdit]);

  const fetchCategorias = async () => {
    const allCategorias = await loadCategorias();
    setCategorias(allCategorias);
  };

  const onBlurField = (field) => {
    if (!form[field]?.trim() && ['nome', 'codigo', 'preco'].includes(field)) {
      setErrors((e) => ({ ...e, [field]: 'Campo obrigatório' }));
    } else {
      setErrors((e) => ({ ...e, [field]: null }));
    }
  };

  const onChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const hasErrors = () => {
    return ['nome', 'codigo', 'preco'].some((f) => !form[f]?.trim() || errors[f]);
  };

  const onSave = async () => {
    ['nome', 'codigo', 'preco'].forEach(onBlurField);
    if (hasErrors()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const produtos = await loadProdutos();
    const existe = produtos.some(
      (p) => p.codigo === form.codigo && (!isEditing || p.id !== form.id)
    );

    if (existe) {
      Alert.alert('Erro', 'Já existe um produto com esse código.');
      return;
    }

    const novoProduto = { ...form, id: form.id || uuid.v4() };

    const atualizados = isEditing
      ? produtos.map((p) => (p.id === form.id ? novoProduto : p))
      : [...produtos, novoProduto];

    await saveProdutos(atualizados);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nome do Produto *</Text>
        <TextInput
          style={styles.input}
          value={form.nome}
          onChangeText={(v) => onChange('nome', v)}
          onBlur={() => onBlurField('nome')}
        />
        {errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

        <Text style={styles.label}>Código *</Text>
        <TextInput
          style={styles.input}
          value={form.codigo}
          onChangeText={(v) => onChange('codigo', v)}
          onBlur={() => onBlurField('codigo')}
        />
        {errors.codigo && <Text style={styles.error}>{errors.codigo}</Text>}

        <Text style={styles.label}>Observação (Opcional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={form.observacao}
          onChangeText={(v) => onChange('observacao', v)}
        />

        <Text style={styles.label}>Preço Unitário *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.preco}
          onChangeText={(v) => onChange('preco', v)}
          onBlur={() => onBlurField('preco')}
        />
        {errors.preco && <Text style={styles.error}>{errors.preco}</Text>}

        <Text style={styles.label}>Categoria (Opcional)</Text>
        <TextInput
          style={styles.input}
          value={form.categoria}
          onChangeText={(v) => {
            onChange('categoria', v);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && categorias.length > 0 && (
          <View style={styles.dropdownBox}>
            <FlatList
              data={categorias}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onChange('categoria', item);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, hasErrors() && styles.buttonDisabled]}
          onPress={onSave}
          disabled={hasErrors()}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: '#fff',
    marginBottom: 14,
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  error: {
    color: '#f44336',
    marginBottom: 8,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 14,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
};
