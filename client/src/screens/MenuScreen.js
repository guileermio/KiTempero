import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import MenuItemCard from '../components/MenuItemCard';
import commonStyles from '../styles/commonStyles';
import SERVER_URL from '../api/config';

export default function MenuScreen({ token }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoadingId, setOrderLoadingId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/menu`);
      const data = await response.json();
      if (response.status === 200) {
        setMenuItems(data);
      } else {
        Alert.alert('Erro', 'Não foi possível obter o cardápio do KiTempero');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha na conexão com o servidor KiTempero');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (menuItemId) => {
    setOrderLoadingId(menuItemId);
    try {
      const response = await fetch(`${SERVER_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ menuItemId, quantity: 1 })
      });
      const data = await response.json();
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Pedido realizado com sucesso no KiTempero!');
      } else {
        Alert.alert('Erro', data.message || 'Falha ao fazer pedido');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha na conexão com o servidor KiTempero');
    } finally {
      setOrderLoadingId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={[commonStyles.title, { marginTop: 0 }]}>Cardápio KiTempero</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={commonStyles.menuList}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onOrder={(id) => handleOrder(id)}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Sem itens no cardápio</Text>}
      />
    </View>
  );
}
