# 🍽️ Buscador de Recetas con Detección de Ingredientes  

## 📌 Descripción  

Este proyecto es una **aplicación móvil** desarrollada con **React Native** que permite a los usuarios buscar recetas a partir de **ingredientes ingresados manualmente** o **detectados desde una imagen**.  

La aplicación utiliza **FastAPI** en el backend y **YOLOv8** en Roboflow para la detección de ingredientes en imágenes. Además, integra la **traducción automática** de ingredientes para mejorar la búsqueda en una base de datos de recetas.  

---

## 🎯 **Características Principales**  

✅ **Búsqueda de recetas** ingresando ingredientes manualmente.  
✅ **Detección de ingredientes en imágenes** con inteligencia artificial usando YOLOv8.  
✅ **Traducción automática** de ingredientes para mejorar la búsqueda.  
✅ **Interfaz moderna y atractiva** con colores llamativos y botones estilizados.  
✅ **Backend en FastAPI** con integración de detección de imágenes y consulta de recetas.  
✅ **Consumo de API con Axios** para la comunicación entre la app y el servidor en AWS.  

---

## 🛠️ **Tecnologías Utilizadas**  

### **Frontend (Aplicación Móvil)**  
- **React Native** 📱  
- **Expo** 🏗️  
- **Axios** (para consumir la API)  
- **expo-image-picker** (para cargar imágenes)  
- **react-navigation** (para manejar las pantallas)  
- **expo-linear-gradient** (para estilos llamativos)  
- **FontAwesome5** (para iconos)  

### **Backend (API en AWS)**  
- **FastAPI** ⚡  
- **YOLOv8 en Roboflow** 🤖  
- **Google Translate API** 🌍 (para traducir ingredientes)  
- **Pandas** 🐼 (para manejar el dataset de recetas)  
- **Uvicorn** (para correr el servidor en AWS)  
- **Python Multiprocessing** (para mejorar rendimiento)  

---

## 🚀 **Instalación y Configuración**  

### **1️⃣ Configuración del Backend en AWS**  
#### **Paso 1: Configurar la instancia en AWS**
- Crear una instancia **EC2 con Ubuntu 22.04**.  
- Asignar una **Elastic IP** para evitar que cambie la IP pública.  
- Abrir el puerto `8720` en **Security Groups** para permitir acceso a la API.  

#### **Paso 2: Instalar Dependencias en el Servidor**  
Ejecuta los siguientes comandos en tu instancia:  
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip -y
pip install fastapi uvicorn googletrans pandas roboflow pillow python-multipart
```

#### **Paso 3: Configurar y Ejecutar FastAPI**
Sube el archivo main.py y ejecuta:
``` bash
uvicorn main:app --host 0.0.0.0 --port 8720 --reload
```
Contenido del main.py (Backend en FastAPI)

``` python
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from googletrans import Translator
from roboflow import Roboflow
import pandas as pd
import shutil
import os

app = FastAPI()

# 📌 Cargar el dataset de recetas
recipes_df = pd.read_csv("data/dataset/full_dataset.csv")

# 📌 Traductor para convertir ingredientes de español a inglés
translator = Translator()

# 📌 Configuración de Roboflow para detección de imágenes
rf = Roboflow(api_key="TU_API_KEY")  # 🔹 Reemplaza con tu API Key
project = rf.project("food_items-0mgej")  # 🔹 Modelo preentrenado de ingredientes
model = project.version(6).model  # 🔹 Versión del modelo YOLO

# 📂 Carpeta para almacenar imágenes temporalmente
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

### ✅ **1️⃣ Endpoint para Buscar Recetas con Ingredientes en Texto**
class IngredientsRequest(BaseModel):
    ingredients: list

@app.post("/predict")
async def predict_recipes(request: IngredientsRequest):
    # 📌 Traducir ingredientes ingresados al inglés
    try:
        user_ingredients = [translator.translate(ing, src="es", dest="en").text.lower() for ing in request.ingredients]
    except Exception as e:
        return {"error": f"Error al traducir los ingredientes: {str(e)}"}

    user_ingredients_set = set(user_ingredients)
    matching_recipes = []

    # 📌 Filtrar recetas que coincidan con los ingredientes
    for _, row in recipes_df.iterrows():
        recipe_ingredients = set(str(row["ingredients"]).split(", "))
        if user_ingredients_set & recipe_ingredients:
            matching_recipes.append({
                "title": row["title"],
                "ingredients": recipe_ingredients,
                "instructions": row.get("directions", "No hay instrucciones disponibles")
            })

    return {"recipes": matching_recipes}

### ✅ **2️⃣ Endpoint para Detectar Ingredientes desde una Imagen**
@app.post("/detect")
async def detect_ingredients(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    # 📌 Guardar la imagen en AWS temporalmente
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 📌 Enviar la imagen a Roboflow para detección de ingredientes
    predictions = model.predict(file_path, confidence=30, overlap=20).json()

    # 📌 Extraer los ingredientes detectados
    detected_ingredients = list(set([pred["class"] for pred in predictions["predictions"]]))

    return {"detected_ingredients": detected_ingredients}
```
### **2️⃣ Instalación del Frontend (React Native con Expo)**
Paso 1: Clonar el repositorio y entrar al proyecto
``` bash
git clone https://github.com/jbriceno49/RecetasApp.git
cd RecetasApp
```
Paso 2: Instalar Dependencias
``` bash
npm install
expo install expo-image-picker expo-linear-gradient react-navigation @react-navigation/native
expo install @react-navigation/stack @react-navigation/bottom-tabs @expo/vector-icons axios
```
Paso 3: Ejecutar la Aplicación en Expo
``` bash
expo start
```
## 📸 Ejemplo de Uso
### 1️⃣ Ingresando Ingredientes Manualmente
🔹 Escribe ingredientes separados por comas y presiona "Buscar Recetas".
![WhatsApp Image 2025-02-01 at 10 21 07](https://github.com/user-attachments/assets/58982704-47f1-4177-b627-dd298dc1df88)
## 2️⃣ Subiendo una Imagen para Detectar Ingredientes
🔹 Sube una imagen con ingredientes y la app detectará los productos automáticamente.
![WhatsApp Image 2025-02-01 at 10 21 08 (1)](https://github.com/user-attachments/assets/2153582b-77dd-481f-953a-b6cd140a1165)
![WhatsApp Image 2025-02-01 at 10 21 08 (2)](https://github.com/user-attachments/assets/c777cfa0-9d4a-450f-b810-b54afa9c1b12)

## 3️⃣ Resultados de la Búsqueda
🔹 Se muestran recetas con título, ingredientes y pasos.
![WhatsApp Image 2025-02-01 at 10 21 08](https://github.com/user-attachments/assets/5864a3b6-472d-495c-a549-a87076e3105a)
![WhatsApp Image 2025-02-01 at 10 21 08 (3)](https://github.com/user-attachments/assets/da9e144e-4d36-47f4-a949-65e73f255f75)

## 📁 Estructura del Proyecto
``` bash
📦 Buscador-Recetas
 ┣ 📂 backend  
 ┃ ┣ 📜 main.py  # Código de FastAPI  
 ┃ ┗ 📂 data  
 ┃   ┗ 📜 full_dataset.csv  # Dataset de recetas  
 ┣ 📂 frontend  
 ┃ ┣ 📂 assets  
 ┃ ┣ 📂 components  
 ┃ ┃ ┗ 📜 RecipeCard.js  # Tarjetas de recetas  
 ┃ ┣ 📜 App.js  # Entrada principal  
 ┃ ┣ 📜 HomeScreen.js  # Pantalla principal  
 ┃ ┣ 📜 ResultsScreen.js  # Pantalla de resultados  
 ┃ ┗ 📜 navigation.js  # Configuración de navegación  
 ┣ 📜 README.md  
 ┗ 📜 package.json 
```
## ⚡ Autor
👨‍💻 Desarrollado por: Juan Sebastian Briceño Davila
