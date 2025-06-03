import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import commonStyles from '../styles/commonStyles';
import SERVER_URL from '../api/config';

export default function RegisterScreen({ goToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setErrorMessage('Todos os campos são obrigatórios');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Senhas não batem');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Cadastro realizado no KiTempero. Faça login.');
        goToLogin();
      } else {
        setErrorMessage(data.message || 'Erro ao cadastrar');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={commonStyles.title}>Registrar – KiTempero</Text>
      {errorMessage ? <Text style={commonStyles.errorText}>{errorMessage}</Text> : null}
      <TextInput
        placeholder="Usuário"
        style={commonStyles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Senha"
        style={commonStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirmar Senha"
        style={commonStyles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleRegister} disabled={loading}>
        <Text style={commonStyles.buttonText}>{loading ? 'Cadastrando...' : 'Registrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToLogin}>
        <Text style={commonStyles.linkText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}
