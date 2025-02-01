import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RecipeCard = ({ recipe }) => {
  return (
    <View style={styles.card}>
      {/* Título de la receta */}
      <Text style={styles.recipeTitle}>{recipe.title}</Text>

      {/* Ingredientes */}
      <Text style={styles.boldText}>Ingredientes:</Text>
      <Text style={styles.recipeText}>{recipe.ingredients.join(", ")}</Text>

      {/* Instrucciones */}
      {recipe.directions && (
        <>
          <Text style={styles.boldText}>Instrucciones:</Text>
          <Text style={styles.recipeText}>{recipe.directions}</Text>
        </>
      )}
    </View>
  );
};

// 🎨 **Estilos**
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D97706",
    marginBottom: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  recipeText: {
    fontSize: 14,
    marginTop: 2,
    color: "#444",
  },
});

export default RecipeCard;