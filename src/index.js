
import app from "./server.js";
// Configuración del servidor Express

const PORT = process.env.PORT || 3000;

// Define tus rutas y lógica de servidor aquí

// Inicia el servidor
app.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});