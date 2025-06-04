// client/src/screens/ManageItemsScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import commonStyles from "../styles/commonStyles";
import SERVER_URL from "../api/config";

export default function ManageItemsScreen({ token, goBack, navigateToCreate, navigateToEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/menu`);
      const data = await response.json();
      if (response.status === 200) {
        setItems(data);
      } else {
        Alert.alert("Erro", "Não foi possível obter itens do cardápio");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha na conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar",
      "Deseja realmente deletar este item?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const response = await fetch(`${SERVER_URL}/menu/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await response.json();
              if (response.status === 200) {
                Alert.alert("Sucesso", "Item deletado");
                fetchItems();
              } else {
                Alert.alert("Erro", data.message || "Falha ao deletar");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Erro", "Falha na conexão com o servidor");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={commonStyles.container}>
      {/* Cabeçalho: Voltar – Título – Criar */}
      <View style={commonStyles.manageHeader}>
        <TouchableOpacity style={commonStyles.squareButton} onPress={goBack}>
          <Text style={commonStyles.squareButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={commonStyles.manageTitle}>Gerenciar Itens</Text>
        <TouchableOpacity style={commonStyles.squareButton} onPress={navigateToCreate}>
          <Text style={commonStyles.squareButtonText}>Criar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de itens com botões Editar/Deletar */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const formattedId = String(item.id).padStart(2, "0");
          return (
            <View style={commonStyles.listItemContainer}>
              <View>
                <Text style={commonStyles.listItemText}>
                  {formattedId}. {item.name}
                </Text>
                <Text style={{ color: "#757575" }}>R$ {item.price.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={commonStyles.smallButton}
                  onPress={() => navigateToEdit(item)}
                >
                  <Text style={commonStyles.smallButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyles.smallButton, { backgroundColor: "#F44336" }]}
                  onPress={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  <Text style={commonStyles.smallButtonText}>
                    {deletingId === item.id ? "..." : "Deletar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum item encontrado</Text>
        }
      />
    </View>
  );
}
