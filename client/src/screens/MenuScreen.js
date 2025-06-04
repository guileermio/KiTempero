// client/src/screens/MenuScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MenuItemCard from "../components/MenuItemCard";
import commonStyles from "../styles/commonStyles";
import SERVER_URL from "../api/config";

export default function MenuScreen({ token, onLogout, navigateToManage }) {
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
        Alert.alert("Erro", "Não foi possível obter o cardápio do KiTempero");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha na conexão com o servidor KiTempero");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (menuItemId) => {
    setOrderLoadingId(menuItemId);
    try {
      const response = await fetch(`${SERVER_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuItemId, quantity: 1 }),
      });
      const data = await response.json();
      if (response.status === 201) {
        Alert.alert("Sucesso", "Pedido realizado com sucesso no KiTempero!");
      } else {
        Alert.alert("Erro", data.message || "Falha ao fazer pedido");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha na conexão com o servidor KiTempero");
    } finally {
      setOrderLoadingId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={commonStyles.container}>
      {/* Cabeçalho: título + logout */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={commonStyles.title}>Cardápio KiTempero</Text>
        <TouchableOpacity style={commonStyles.squareButton} onPress={onLogout}>
          <Text style={commonStyles.squareButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Gerenciar Itens */}
      <TouchableOpacity style={commonStyles.squareButton} onPress={navigateToManage}>
        <Text style={commonStyles.squareButtonText}>Gerenciar Itens</Text>
      </TouchableOpacity>

      {/* Lista de itens do cardápio */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={commonStyles.menuList}
        renderItem={({ item }) => {
          // Formata ID como 2 dígitos
          const formattedId = String(item.id).padStart(2, "0");
          return (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: "#757575", marginLeft: 4 }}>
                ID: {formattedId}
              </Text>
              <MenuItemCard item={item} onOrder={(id) => handleOrder(id)} />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>Sem itens no cardápio</Text>
        }
      />
    </View>
  );
}
