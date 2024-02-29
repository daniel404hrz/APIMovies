import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";
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

    // Validaciones de campos requeridos
    if (
      !titulo ||
      !imagen ||
      !stock ||
      !precioAlquiler ||
      !precioVenta ||
      !descripcion
    ) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Guarda la película en la base de datos
    const peliculasRef = ref(db, "peliculas");
    const nuevaPeliculaRef = push(peliculasRef);
    await set(nuevaPeliculaRef, {
      titulo,
      descripcion,
      imagen,
      stock,
      precioAlquiler,
      precioVenta,
      disponibilidad,
      likes: 0,
    });

    res.status(201).json({ mensaje: "Película creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la película:", error);
    res.status(500).json({ mensaje: "Error al crear la película" });
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
  const isLike = req.params.true;
  const movieId = req.params.id;
  try {
    const movieRef = ref(db, `peliculas/${movieId}`);

    // Datos que deseas actualizar (reemplaza con tus nuevos datos)
    const snapshot = await get(movieRef);
    if (snapshot.exists()) {
      const currentLikes = snapshot.val().likes || 0;

      // Incrementa el valor de 'likes' en 1
      const nuevosDatos = {
        likes: isLike == "true" ? currentLikes + 1 : currentLikes - 1,
        // ... otros campos que desees actualizar
      };

      // Actualiza los datos en la referencia específica
      await update(movieRef, nuevosDatos);
      console.log("Elemento modificado exitosamente.");
      res
        .status(200)
        .json(
          isLike == "true"
            ? { mensaje: "Like agregado exitosamente." }
            : { mensaje: "Like eliminado exitosamente." }
        );

      update(movieRef, nuevosDatos)
        .then(() => {
          console.log("Elemento modificado exitosamente.");
        })
        .catch((error) => {
          console.error("Error al modificar el elemento:", error.message);
        });
    } else {
      console.error("La película no existe.", movieId);
      res.status(404).json({ mensaje: "La película no existe." });
    }
  } catch (error) {
    console.error("La película no existe.", movieId);
    res.status(404).json({ mensaje: error.message });
  }

  // Actualiza los datos en la referencia específica
};
export const delMovies = async (req, res) => {
  const { id } = req.params;

  const db = getDatabase();

  // Referencia al post específico
  const postRef = ref(db, `/peliculas/${id}`);

  try {
    // Intenta obtener el post antes de eliminarlo para verificar la propiedad 'uid'
    const snapshot = await get(postRef);

    if (snapshot.exists()) {
      // Elimina el post de la lista general de posts
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
