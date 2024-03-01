import { db } from "../db.js";
import { ref, push, set, get } from "firebase/database";

export const createRentals = async (req, res) => {
  const { movieID, userID} = req.body;

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

    
    await set(rentalRef, {
      user: userRef.key, 
      movie: movieRef.key, 
      rentalDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      penalty: 0, // Inicialmente sin penalización
      ...movieDetails,
    });

    // Agrega el alquiler al array de alquileres en el nodo del usuario
    await set(userRef, { alquileres: { [rentalId]: true } }, { merge: true });

    console.log("Alquiler registrado exitosamente con ID:", rentalId);
    res
      .status(201)
      .json({ mensaje: "Alquiler registrado exitosamente", rentalId });
  } catch (error) {
    console.error("Error al registrar el alquiler:", error.message);
    res.status(500).json({ mensaje: "Error al registrar el alquiler" });
  }
};
