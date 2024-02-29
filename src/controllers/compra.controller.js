import { db } from "../db.js";

export const createUser=async(req,res)=>{
    const {movieID,userID}=req.body;
    try {
        
        const movieRef = ref(db, `peliculas/${movieID}`);
    const userRef = ref(db, `usuarios/${userID}`);

    // Genera una nueva compra con la información proporcionada
    const compraRef = ref(db, 'compras'); // Cambié el nombre de 'usuarios' a 'compras' para reflejar mejor la intención
    const nuevaCompra = {
      user: userRef,
      movie: movieRef,
      date: new Date().toISOString(), // Puedes ajustar cómo deseas almacenar la fecha
    };

    // Agrega la nueva compra a la base de datos
    const compraSnapshot = await set(compraRef, nuevaCompra);

    // Obtén el ID de la nueva compra (opcional)
    const id = compraSnapshot.key;

    console.log('Compra registrada exitosamente con ID:', id);
    res.status(201).json({ mensaje: 'Compra registrada exitosamente', compraId: id });
      } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
      }
}