import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MenuScreen from './src/screens/MenuScreen';
import commonStyles from './src/styles/commonStyles';

export default function App() {
  // Estados para controlar qual tela está ativa: 'login', 'register', 'menu'
  const [screen, setScreen] = useState('login');
  const [token, setToken] = useState(null);

  // Quando o usuário faz login com sucesso, definimos o token e vamos para Menu
  const handleLoginSuccess = (jwt) => {
    setToken(jwt);
    setScreen('menu');
  };

  // Ao clicar em "Registrar" no LoginScreen, vamos para register.
  // E no RegisterScreen, ao cadastrar com sucesso, voltamos para login.

  if (screen === 'login') {
    return (
      <View style={commonStyles.container}>
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          goToRegister={() => setScreen('register')}
        />
      </View>
    );
  } else if (screen === 'register') {
    return (
      <View style={commonStyles.container}>
        <RegisterScreen goToLogin={() => setScreen('login')} />
      </View>
    );
  } else if (screen === 'menu') {
    return (
      <View style={commonStyles.container}>
        <MenuScreen token={token} />
      </View>
    );
  } else {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
