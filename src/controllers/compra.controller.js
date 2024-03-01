import { db } from "../db.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

export const createPurchases = async (req, res) => {
  const { movieID, userID } = req.body;

  try {
    const userRef = ref(db, `usuarios/${userID}`);
    const movieRef = ref(db, `peliculas/${movieID}`);

    // Utiliza push para generar una clave única para cada compra
    const compraRef = push(ref(db, "compras"));
    const compraId = compraRef.key;

    // Guarda solo la referencia (ID) en la base de datos
    await set(compraRef, {
      user: userRef.key, // Guarda solo el ID del usuario
      movie: movieRef.key, // Guarda solo el ID de la película
      date: new Date().toISOString().split("T")[0],
    });
    const movieSnapshot = await get(movieRef);
    const movieDetails = {
        movieID: movieSnapshot.key,
        title: movieSnapshot.val().titulo
      };
  
      // Actualiza el array de compras en el nodo del usuario
      await set(userRef, { compras: { [compraId]: movieDetails } }, { merge: true });

    console.log("Compra registrada exitosamente con ID:", compraId);
    res
      .status(201)
      .json({ mensaje: "Compra registrada exitosamente", compraId });
  } catch (error) {
    console.error("Error al registrar la compra:", error.message);
    res.status(500).json({ mensaje: "Error al registrar la compra" });
  }
};
export const getPurchases = async (req, res) => {
  try {
    const comprasRef = ref(db, "compras");

    // Obtiene los datos de la referencia 'movies'
    await get(comprasRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(201).json(data);
      } else {
        console.log('No hay datos en la referencia "compras".');
        res.status(201).json({});
      }
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error.message);
    res.status(500).json({ mensaje: "Error al obtener los datos" });
  }
};
