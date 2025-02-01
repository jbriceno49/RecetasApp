import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from '@expo/vector-icons'; // 📌 Para íconos
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const [ingredients, setIngredients] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]); 
  const [loading, setLoading] = useState(false);
  const SERVER_URL = "http://34.232.143.130:8720"; // 🔹 Elastic IP de AWS

  // 📌 Función para seleccionar imagen
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      detectIngredients(result.assets[0].uri);
    }
  };

  // 📌 Función para detectar ingredientes en la imagen
  const detectIngredients = async (imageUri) => {
    setLoading(true);

    let localUri = imageUri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });

    try {
      const response = await axios.post(`${SERVER_URL}/detect`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.detected_ingredients.length > 0) {
        setDetectedIngredients(response.data.detected_ingredients);
        setIngredients(response.data.detected_ingredients.join(", "));
        Alert.alert("✅ Ingredientes detectados", response.data.detected_ingredients.join(", "));
      } else {
        Alert.alert("⚠️ No se detectaron ingredientes en la imagen.");
      }
    } catch (error) {
      console.error("Error detectando ingredientes:", error);
      Alert.alert("❌ Error", "No se pudo procesar la imagen.");
    }

    setLoading(false);
  };

  // 📌 Enviar la búsqueda a la siguiente pantalla y limpiar estados
  const searchRecipes = () => {
    if (!ingredients.trim() && !selectedImage) {
      Alert.alert("⚠️ Error", "Ingresa ingredientes o sube una imagen.");
      return;
    }

    setSelectedImage(null);
    setDetectedIngredients([]);

    navigation.navigate("Results", { ingredients, selectedImage });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        {/* LOGO UNAB */}
        <Image source={require("../assets/unab-logo.png")} style={styles.logo} />

        <Text style={styles.title}>🍽️ Buscador de Recetas</Text>
        <Text style={styles.subtitle}>🔎 Ingresa ingredientes o sube una imagen</Text>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <FontAwesome5 name="carrot" size={18} color="#FF5722" />
          <TextInput
            style={styles.input}
            placeholder="Ej: pollo, cebolla, ajo"
            value={ingredients}
            onChangeText={setIngredients}
            returnKeyType="done"
          />
        </View>

        {/* BOTÓN PARA SUBIR IMAGEN */}
        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
          <FontAwesome5 name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}> Subir Imagen</Text>
        </TouchableOpacity>

        {/* MOSTRAR IMAGEN SELECCIONADA */}
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

        {/* MOSTRAR INGREDIENTES DETECTADOS */}
        {detectedIngredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.boldText}>📝 Ingredientes detectados:</Text>
            <Text style={styles.recipeText}>{detectedIngredients.join(", ")}</Text>
          </View>
        )}

        {/* BOTÓN DE BÚSQUEDA */}
        <TouchableOpacity style={styles.buttonPrimary} onPress={searchRecipes} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome5 name="search" size={20} color="#fff" />
              <Text style={styles.buttonText}> Buscar Recetas</Text>
            </>
          )}
        </TouchableOpacity>

        {/* FIRMA */}
        <Text style={styles.footer}>👨‍🍳 Desarrollado por Ing. Juanse Briceño</Text>
        <Text style={styles.footer}>   Universidad Autonoma de Bucaramanga</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 🎨 **Estilos Mejorados**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF5722",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#616161",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF5722",
    backgroundColor: "#FFF8E1",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  ingredientsContainer: {
    marginTop: 10,
    backgroundColor: "#FFE0B2",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeText: {
    fontSize: 14,
    textAlign: "center",
  },
  buttonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: "100%",
    justifyContent: "center",
  },
  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: "italic",
    color: "#616161",
  },
});
