import { db } from "../db.js";
import { ref, push, set, get, update, remove } from "firebase/database";

export const createPurchases = async (req, res) => {
  const { movieID, userID, items } = req.body;

  if (items <= 0) {
    return res
      .status(400)
      .json({ mensaje: "El número de items debe ser mayor que 0." });
  }

  try {
    const userRef = ref(db, `usuarios/${userID}`);
    const movieRef = ref(db, `peliculas/${movieID}`);

    // Obtén el stock actual de la película
    const movieSnapshot = await get(movieRef);
    const currentStock = movieSnapshot.val().stock || 0;

    // Verifica si hay suficiente stock para la compra
    if (currentStock < items) {
      return res.status(400).json({ mensaje: "No hay suficiente stock." });
    }

    // Utiliza push para generar una clave única para cada compra
    const compraRef = push(ref(db, "compras"));
    const compraId = compraRef.key;

    // Guarda solo la referencia (ID) en la base de datos
    await set(compraRef, {
      user: userRef.key, // Guarda solo el ID del usuario
      movie: movieRef.key, // Guarda solo el ID de la película
      date: new Date().toISOString().split("T")[0],
      items: items,
    });

    // Actualiza el array de compras en el nodo del usuario
    const movieDetails = {
      id: movieSnapshot.key,
      title: movieSnapshot.val().titulo,
      imagen: movieSnapshot.val().imagen,
      likes: movieSnapshot.val().likes,

      items,
    };
    const userSnapshot = await get(userRef);
    const compras = userSnapshot.val().compras || [];
    compras.push(movieDetails);
    await update(userRef, { compras: compras });

    // Ajusta el stock de la película
    const updatedStock = currentStock - items;
    await update(movieRef, { stock: updatedStock });

    console.log("Compra registrada exitosamente con ID:", compraId);
    res
      .status(201)
      .json({ mensaje: "Compra registrada exitosamente", compraId });
  } catch (error) {
    console.error("Error al registrar la compra:", error.message);
    res.status(500).json({ mensaje: error.message });
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
