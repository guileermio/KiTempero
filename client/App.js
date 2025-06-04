// client/App.js

import React, { useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MenuScreen from './src/screens/MenuScreen';
import ManageItemsScreen from './src/screens/ManageItemsScreen';
import CreateItemScreen from './src/screens/CreateItemScreen';
import EditItemScreen from './src/screens/EditItemScreen';
import commonStyles from './src/styles/commonStyles';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [token, setToken] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Chamado após login bem‐sucedido
  const handleLoginSuccess = (jwt) => {
    setToken(jwt);
    setScreen('menu');
  };

  // Logout: limpa token e volta para login
  const handleLogout = () => {
    setToken(null);
    setScreen('login');
  };

  // Helpers para navegar entre telas:
  const goToRegister = () => setScreen('register');
  const goToLogin = () => setScreen('login');
  const goToMenu = () => setScreen('menu');

  const goToManage = () => setScreen('manage');
  const goToCreate = () => setScreen('create');

  const goToEdit = (item) => {
    setEditingItem(item);
    setScreen('edit');
  };

  // Renderiza a tela correta com base em `screen`
  if (screen === 'login') {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <LoginScreen onLoginSuccess={handleLoginSuccess} goToRegister={goToRegister} />
      </View>
    );
  }

  if (screen === 'register') {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <RegisterScreen goToLogin={goToLogin} />
      </View>
    );
  }

  if (screen === 'menu') {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <MenuScreen
          token={token}
          onLogout={handleLogout}
          navigateToManage={goToManage}
        />
      </View>
    );
  }

  if (screen === 'manage') {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <ManageItemsScreen
          token={token}
          goBack={goToMenu}
          navigateToCreate={goToCreate}
          navigateToEdit={goToEdit}
        />
      </View>
    );
  }

  if (screen === 'create') {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <CreateItemScreen
          token={token}
          goBack={() => {
            setScreen('manage');
          }}
        />
      </View>
    );
  }

  if (screen === 'edit' && editingItem) {
    return (
      <View style={commonStyles.container}>
        <StatusBar barStyle="dark-content" />
        <EditItemScreen
          token={token}
          goBack={() => {
            setScreen('manage');
            setEditingItem(null);
          }}
          item={editingItem}
        />
      </View>
    );
  }

  // Estado padrão (qualquer outro) → ActivityIndicator
  return (
    <View style={commonStyles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}
