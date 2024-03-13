import { ref, push, set, get, update, remove } from "firebase/database";
import { db } from "../db.js";

export const getMovieByID = async (req, res) => {
  const { id } = req.params;
  try {
    const movieRef = ref(db, `peliculas/${id}`);
    await get(movieRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(201).json(data);
      } else {
        console.log("No hay datos en la referencia de ", id);
        res.status(400).json({ mensaje: "No se encontro la pelicula" });
      }
    });
  } catch (error) {
    res.status(400).json({ mensaje: "No se encontro la pelicula" });
  }
};
export const postMovie = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      imagen,
      stock,
      precioAlquiler,
      precioVenta,
      disponibilidad,
    } = req.body;

    // Validaciones de campos requeridos y tipos de datos
    if (
      !titulo ||
      !imagen ||
      isNaN(stock) ||
      isNaN(precioAlquiler) ||
      isNaN(precioVenta) ||
      typeof disponibilidad !== "boolean" ||
      !descripcion
    ) {
      return res
        .status(400)
        .json({
          mensaje:
            "Todos los campos son obligatorios y deben tener el formato correcto.",
        });
    }

    // Guarda la película en la base de datos
    const peliculasRef = ref(db, "peliculas");
    const nuevaPeliculaRef = push(peliculasRef);

    const nuevaPeliculaData = {
      titulo,
      descripcion,
      imagen,
      stock,
      precioAlquiler,
      precioVenta,
      disponibilidad,
      likes: 0,
      userLikes: [0],
    };

    // Logs para depuración
    console.log("Nueva película a crear:", nuevaPeliculaData);

    await set(nuevaPeliculaRef, nuevaPeliculaData);

    res.status(201).json({ mensaje: "Película creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la película:", error);

    // Envía una respuesta más detallada al cliente
    res
      .status(500)
      .json({ mensaje: "Error al crear la película", error: error.message });
  }
};
export const getMovies = async (req, res) => {
  const moviesRef = ref(db, "peliculas");

  // Obtiene los datos de la referencia 'movies'
  await get(moviesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(201).json(data);
      } else {
        console.log('No hay datos en la referencia "movies".');
        res.status(201).json({});
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos:", error.message);
      res.status(404).json({ mensaje: error.message });
    });
};
export const putLike = async (req, res) => {
  const isLike = req.params.true === "true"; // Convierte el parámetro a booleano
  const movieId = req.params.movieId;
  const userId = req.params.userId;

  try {
    const movieRef = ref(db, `peliculas/${movieId}`);
    const snapshot = await get(movieRef);

    if (snapshot.exists()) {
      const currentLikes = snapshot.val().likes || 0;

      // Actualiza el array de usuarios que le han dado like
      let updatedUserLikes = snapshot.val().userLikes || [0];

      // Verifica si el usuario ya ha dado like
      const userHasLiked = updatedUserLikes.includes(userId);

      // Agrega o elimina el usuario actual del array
      if (isLike && !userHasLiked) {
        updatedUserLikes.push(userId);
      } else if (!isLike && userHasLiked) {
        updatedUserLikes = updatedUserLikes.filter(
          (existingUserId) => existingUserId !== userId
        );
      }

      const nuevosDatos = {
        likes: isLike && !userHasLiked
          ? currentLikes + 1
          : !isLike && userHasLiked
          ? currentLikes - 1
          : currentLikes,
        userLikes: updatedUserLikes,
        // ... otros campos que desees actualizar
      };

      // Modifica la lógica para asegurar que la propiedad userLikes existe
      if (!snapshot.val().userLikes) {
        nuevosDatos.userLikes = updatedUserLikes;
      }

      await update(movieRef, nuevosDatos);

      console.log("Elemento modificado exitosamente.");
      res.status(200).json({
        mensaje: isLike
          ? "Like agregado exitosamente."
          : "Like eliminado exitosamente.",
      });
    } else {
      console.error("La película no existe.", movieId);
      res.status(404).json({ mensaje: "La película no existe." });
    }
  } catch (error) {
    console.error("Error al modificar la película:", error.message);
    res.status(500).json({ mensaje: "Error al modificar la película." });
  }
};
export const delMovies = async (req, res) => {
  const { id } = req.params;

  const postRef = ref(db, `/peliculas/${id}`);

  try {
    const snapshot = await get(postRef);

    if (snapshot.exists()) {
      remove(postRef);

      res.status(200).json({ mensaje: "Post eliminado exitosamente." });
    } else {
      res.status(403).json({
        mensaje:
          "No se puede eliminar el post. El post no existe o no tienes permisos.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el post:", error.message);
    res.status(500).json({ mensaje: "Error al eliminar el post." });
  }
};
