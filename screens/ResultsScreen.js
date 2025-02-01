import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'; // 📌 Para íconos
import axios from "axios";
import RecipeCard from "../components/RecipeCard"; // 📌 Importamos el componente

export default function ResultsScreen({ route, navigation }) {
  const { ingredients, selectedImage } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = "http://34.232.143.130:8720";

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    
    try {
      let detectedIngredients = [];
  
      // 📌 Si hay una imagen, primero hacemos la detección de ingredientes
      if (selectedImage) {
        let localUri = selectedImage;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append("file", { uri: localUri, name: filename, type });

        const detectResponse = await axios.post(`${SERVER_URL}/detect`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        detectedIngredients = detectResponse.data.detected_ingredients;
        console.log("Ingredientes detectados:", detectedIngredients);

        if (detectedIngredients.length === 0) {
          Alert.alert("⚠️ No se detectaron ingredientes en la imagen.");
          setLoading(false);
          return;
        }
      }

      // 📌 Luego buscamos recetas con los ingredientes detectados o ingresados
      const ingredientsToUse = detectedIngredients.length > 0 ? detectedIngredients : ingredients.split(",").map((item) => item.trim());

      const response = await axios.post(`${SERVER_URL}/predict`, {
        ingredients: ingredientsToUse,
      });

      setRecipes(response.data.recipes);
    } catch (error) {
      console.error("Error buscando recetas:", error);
      Alert.alert("❌ Error", "No se pudieron obtener recetas.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Recetas Encontradas</Text>

      {/* Mostrar imagen seleccionada */}
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

      {/* Animación de carga */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" />
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
        />
      ) : (
        <Text style={styles.noResults}>❌ No se encontraron recetas.</Text>
      )}

      {/* BOTÓN DE NUEVA BÚSQUEDA */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        <Text style={styles.buttonText}> Nueva Búsqueda</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF5722", // 🔥 Color llamativo
    marginBottom: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  noResults: {
    fontSize: 18,
    color: "#757575",
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});