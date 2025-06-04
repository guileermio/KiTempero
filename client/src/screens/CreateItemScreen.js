// client/src/screens/CreateItemScreen.js

import React, { useState, useEffect } from "react";
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

export default function CreateItemScreen({ token, goBack }) {
  const [nextId, setNextId] = useState("01");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Calcular nextId ao montar
    (async () => {
      try {
        const response = await fetch(`${SERVER_URL}/menu`);
        const data = await response.json();
        if (response.status === 200) {
          const maxId = data.reduce((max, item) => (item.id > max ? item.id : max), 0);
          const newId = String(maxId + 1).padStart(2, "0");
          setNextId(newId);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

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
      // No SDK 49+, resultado vem em result.assets[0].uri
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleCreate = async () => {
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

      // Preparar arquivo de imagem
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

      const response = await fetch(`${SERVER_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.status === 201) {
        Alert.alert("Sucesso", `Item #${nextId} criado com sucesso.`);
        goBack();
      } else {
        Alert.alert("Erro", data.message || "Falha ao criar item");
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
        <Text style={commonStyles.title}>Criar Item</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Campo ID (não editável, acinzentado) */}
      <TextInput
        value={nextId}
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

      {/* Campos de entrada */}
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

      {/* Picker de imagem */}
      <TouchableOpacity
        style={[commonStyles.squareButton, { backgroundColor: "#FFC107" }]}
        onPress={pickImage}
      >
        <Text style={commonStyles.squareButtonText}>
          {imageUri ? "Trocar Imagem" : "Selecionar Imagem"}
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

      {/* Botão Criar */}
      <TouchableOpacity
        style={commonStyles.squareButton}
        onPress={handleCreate}
        disabled={uploading}
      >
        <Text style={commonStyles.squareButtonText}>
          {uploading ? "Enviando..." : "Criar Item"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
