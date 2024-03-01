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

export const createRentals = async (req, res) => {
    const { movieID, userID } = req.body;

    try {
        const userRef = ref(db, `usuarios/${userID}`);
        const movieRef = ref(db, `peliculas/${movieID}`);

        const rentalRef = push(ref(db, "alquileres"));
        const rentalId = rentalRef.key;

        const movieSnapshot = await get(movieRef);
        const movieDetails = {
            movieID: movieSnapshot.key,
            title: movieSnapshot.val().titulo,
        };

        // Calcula la fecha de devolución (hoy + días de alquiler)
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 3);

        // Guarda la información del alquiler
        await set(rentalRef, {
            user: userRef.key,
            movie: movieRef.key,
            rentalDate: today.toISOString().split("T")[0],
            returnDate: returnDate.toISOString().split("T")[0],
            penalty: 0, // Inicialmente sin penalización
            ...movieDetails,
        });

        // Obtiene la lista actual de alquileres del usuario y la actualiza
        const userSnapshot = await get(userRef);
        const userRentals = userSnapshot.val().alquileres || {};
        console.log(userRentals);
        userRentals[rentalId] = {
            rentalDate: today.toISOString().split("T")[0],
            returnDate: returnDate.toISOString().split("T")[0],
            penalty: 0, // Inicialmente sin penalización
            ...movieDetails,
        };

        // Actualiza la lista de alquileres del usuario
        await set(userRef, { ...userSnapshot.val(), alquileres: userRentals });

        console.log("Alquiler registrado exitosamente con ID:", rentalId);
        res
            .status(201)
            .json({ mensaje: "Alquiler registrado exitosamente", rentalId });
    } catch (error) {
        console.error("Error al registrar el alquiler:", error.message);
        res.status(500).json({ mensaje: "Error al registrar el alquiler" });
    }
};
export const getRentas = async (req, res) => {
  const moviesRef = ref(db, "alquileres");

  await get(moviesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(201).json(data);
      } else {
        console.log('No hay datos en la referencia "alquileres".');
        res.status(201).json({});
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos:", error.message);
      res.status(404).json({ mensaje: error.message });
    });
};
export const delRenta = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el ID del usuario asociado al alquiler
    const rentalRef = ref(db, `alquileres/${id}`);
    const userId = (await rentalRef.get()).val()?.user;

    if (userId) {
      // Obtener la referencia al alquiler en la lista del usuario
      const userRentalRef = ref(db, `usuarios/${userId}/alquileres/${id}`);
      console.log("hola");

      // Eliminar el alquiler de la lista del usuario
      await remove(userRentalRef);
    }

    // Eliminar el alquiler de la lista general
    await remove(rentalRef);

    return res.status(200).json({ mensaje: "Alquiler eliminado exitosamente" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
export const addRecargo = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener una referencia al alquiler en la base de datos
    const rentalRef = ref(db, `alquileres/${id}`);
    const rentalSnapshot = await get(rentalRef);

    if (!rentalSnapshot.exists()) {
      return res.status(404).json({ mensaje: "Alquiler no encontrado" });
    }

    const rentalDetails = rentalSnapshot.val();

    // Calcular la fecha actual y verificar si hay retraso
    const today = new Date();
    const returnDate = new Date(rentalDetails.returnDate);

    if (today > returnDate) {
      // Calcular la cantidad de días de retraso
      const daysLate = Math.floor((today - returnDate) / (24 * 60 * 60 * 1000));

      // Aplicar el recargo de $1 por día de retraso
      const penalty = daysLate * 1;

      // Actualizar el alquiler con la penalización
      await set(rentalRef, { ...rentalDetails, penalty });

      return res
        .status(200)
        .json({ mensaje: "Recargo aplicado exitosamente", penalty });
    }

    return res.status(200).json({ mensaje: "No hay retraso, sin recargo" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
