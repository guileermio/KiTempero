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

export default function LoginScreen({ onLoginSuccess, goToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Preencha usuário e senha');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.status === 200 && data.token) {
        onLoginSuccess(data.token);
      } else {
        setErrorMessage(data.message || 'Erro ao fazer login');
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
      <Text style={commonStyles.title}>Login – KiTempero</Text>
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
      <TouchableOpacity style={commonStyles.button} onPress={handleLogin} disabled={loading}>
        <Text style={commonStyles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToRegister}>
        <Text style={commonStyles.linkText}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
