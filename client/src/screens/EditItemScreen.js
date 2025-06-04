// client/src/screens/EditItemScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import commonStyles from "../styles/commonStyles";
import SERVER_URL from "../api/config";

export default function EditItemScreen({ token, goBack, item }) {
  // item = { id, name, description, price, imageUrl }
  const formattedId = String(item.id).padStart(2, "0");
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());
  const [imageUri, setImageUri] = useState(item.imageUrl);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de permissão para acessar a galeria.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !price.trim() || !imageUri) {
      Alert.alert("Erro", "Nome, preço e imagem são obrigatórios.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price.trim());

      // Se escolher nova imagem (URI local)
      if (!imageUri.startsWith("http")) {
        const uriParts = imageUri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        let fileType = "image/jpeg";
        if (fileName.toLowerCase().endsWith(".png")) {
          fileType = "image/png";
        }
        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        });
      }

      const response = await fetch(`${SERVER_URL}/menu/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.status === 200) {
        Alert.alert("Sucesso", `Item #${formattedId} atualizado.`);
        goBack();
      } else {
        Alert.alert("Erro", data.message || "Falha ao atualizar item");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha na conexão com o servidor");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity style={commonStyles.squareButton} onPress={goBack}>
          <Text style={commonStyles.squareButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={commonStyles.title}>Editar Item #{formattedId}</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Campo ID (não editável) */}
      <TextInput
        value={formattedId}
        editable={false}
        style={[
          commonStyles.input,
          {
            backgroundColor: "#E0E0E0",
            color: "#757575",
            textAlign: "center",
          },
        ]}
      />

      {/* Campos */}
      <TextInput
        placeholder="Nome"
        style={commonStyles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Descrição"
        style={commonStyles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Preço (ex: 25.50)"
        style={commonStyles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Picker de Imagem */}
      <TouchableOpacity
        style={[commonStyles.squareButton, { backgroundColor: "#FFC107" }]}
        onPress={pickImage}
      >
        <Text style={commonStyles.squareButtonText}>
          {imageUri.startsWith("http") ? "Trocar Imagem" : "Selecionar Imagem"}
        </Text>
      </TouchableOpacity>

      {/* Preview da imagem */}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 120,
            height: 120,
            marginVertical: 16,
            borderRadius: 12,
            alignSelf: "center",
          }}
        />
      )}

      {/* Botão Salvar */}
      <TouchableOpacity
        style={commonStyles.squareButton}
        onPress={handleUpdate}
        disabled={uploading}
      >
        <Text style={commonStyles.squareButtonText}>
          {uploading ? "Atualizando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
