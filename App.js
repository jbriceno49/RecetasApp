import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ResultsScreen from "./screens/ResultsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Buscador de Recetas" }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: "Resultados" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// import React, { useState } from "react";
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   Button, 
//   FlatList, 
//   Image, 
//   StyleSheet, 
//   ActivityIndicator, 
//   Keyboard, 
//   TouchableWithoutFeedback, 
//   Alert 
// } from "react-native";
// import * as ImagePicker from "expo-image-picker"; // Para seleccionar imágenes
// import axios from "axios";

// export default function App() {
//   const [ingredients, setIngredients] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [detectedIngredients, setDetectedIngredients] = useState([]);
//   const [visibleRecipes, setVisibleRecipes] = useState(5); //  Mostrar 5 recetas al inicio

//   const SERVER_URL = "http://174.129.190.234:8720"; //  IP de AWS

//   //  Buscar recetas con ingredientes ingresados manualmente
//   const fetchRecipes = async () => {
//     if (!ingredients.trim()) {
//       Alert.alert("Error", "Ingresa al menos un ingrediente o sube una imagen.");
//       return;
//     }

//     setLoading(true);
//     Keyboard.dismiss();  
//     try {
//       const response = await axios.post(`${SERVER_URL}/predict`, {
//         ingredients: ingredients.split(",").map((item) => item.trim()),
//       });
//       setRecipes(response.data.recipes);
//       setVisibleRecipes(5); //  Reiniciar la cantidad visible
//     } catch (error) {
//       console.error("Error buscando recetas:", error);
//       Alert.alert("Error", "No se pudieron obtener recetas.");
//     }
//     setLoading(false);
//   };

//   //  Seleccionar imagen desde la galería
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//       detectIngredients(result.assets[0].uri);
//     }
//   };

//   //  Detectar ingredientes en la imagen
//   const detectIngredients = async (imageUri) => {
//     setLoading(true);

//     let localUri = imageUri;
//     let filename = localUri.split("/").pop();
//     let match = /\.(\w+)$/.exec(filename);
//     let type = match ? `image/${match[1]}` : `image`;

//     let formData = new FormData();
//     formData.append("file", { uri: localUri, name: filename, type });

//     try {
//       const response = await axios.post(`${SERVER_URL}/detect`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data.detected_ingredients.length > 0) {
//         setDetectedIngredients(response.data.detected_ingredients);
//         setIngredients(response.data.detected_ingredients.join(", "));
//         Alert.alert("Ingredientes detectados", response.data.detected_ingredients.join(", "));
//       } else {
//         Alert.alert("No se detectaron ingredientes.");
//       }
//     } catch (error) {
//       console.error("Error detectando ingredientes:", error);
//       Alert.alert("Error", "No se pudo procesar la imagen.");
//     }

//     setLoading(false);
//   };

//   //  Cargar más recetas
//   const loadMore = () => {
//     setVisibleRecipes((prev) => prev + 5);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         {/* LOGO UNAB - Ajustado */}
//         <Image 
//           source={{ uri: "https://unab.edu.co/wp-content/uploads/2023/11/logo-unab-azul.png" }} 
//           style={styles.logo} 
//           resizeMode="contain"
//         />

//         <Text style={styles.title}>Buscador de Recetas</Text>
//         <Text style={styles.subtitle}>Ingresa los ingredientes o sube una imagen:</Text>

//         {/* INPUT */}
//         <TextInput
//           style={styles.input}
//           placeholder="Ej: pollo, cebolla, ajo"
//           value={ingredients}
//           onChangeText={setIngredients}
//           returnKeyType="done"
//           onSubmitEditing={fetchRecipes}
//         />

//         {/* BOTÓN PARA SELECCIONAR IMAGEN */}
//         <Button title="Seleccionar Imagen" onPress={pickImage} />

//         {/* MUESTRA LA IMAGEN SELECCIONADA */}
//         {selectedImage && (
//           <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
//         )}

//         {/* BOTÓN DE CONSULTA */}
//         {loading ? (
//           <ActivityIndicator size="large" color="#1E3A8A" />
//         ) : (
//           <Button title="Buscar Recetas" onPress={fetchRecipes} />
//         )}

//         {/* RESULTADOS */}
//         <FlatList
//           data={recipes.slice(0, visibleRecipes)}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.recipeCard}>
//               <Text style={styles.recipeTitle}>{item.title}</Text>

//               {/* Ingredientes con negrilla */}
//               <Text style={styles.boldText}>Ingredientes:</Text>
//               <Text style={styles.recipeText}>{item.ingredients.join(", ")}</Text>

//               {/* Instrucciones con negrilla */}
//               <Text style={styles.boldText}>Instrucciones:</Text>
//               <Text style={styles.recipeText}>{item.directions}</Text>
//             </View>
//           )}
//           ListFooterComponent={visibleRecipes < recipes.length ? (
//             <Button title="Cargar más recetas" onPress={loadMore} />
//           ) : null}
//         />

//         {/* FIRMA */}
//         <Text style={styles.footer}>Desarrollado por Ing. Juanse Briceño</Text>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// //  **ESTILOS**
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     alignItems: "center",
//     padding: 20,
//   },
//   logo: {
//     width: 250, 
//     height: 100, 
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#1E3A8A",
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   imagePreview: {
//     width: 200,
//     height: 200,
//     marginVertical: 10,
//     borderRadius: 10,
//   },
//   recipeCard: {
//     backgroundColor: "#fff",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     width: "100%",
//   },
//   recipeTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#D97706",
//   },
//   boldText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 5,
//   },
//   recipeText: {
//     fontSize: 14,
//     marginTop: 2,
//   },
//   footer: {
//     marginTop: 20,
//     fontSize: 14,
//     fontStyle: "italic",
//   },
// });