import { auth } from "../db.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../db.js";
import {
  
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

export const createUser = async (req, res) => {
  const { id, name,rol } = req.body;
  
  try {
    if (!id || !name || !rol) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    const usersRef = ref(db, `usuarios/${id}`);

    // Verifica si ya existe un usuario con el mismo ID
    const existingUserSnapshot = await get(usersRef);

    if (existingUserSnapshot.exists()) {
      // El usuario ya está registrado, retorna un mensaje de error
      return res.status(400).json({ mensaje: "El usuario ya está registrado" });
    }
    set(usersRef, {

        nombre: name,
        compras: [],
        alquileres: {},
        rol:rol
    
    });
    const userSnapshot = await get(usersRef);
    const userData = userSnapshot.val();

    console.log("Usuario registrado exitosamente con ID:", id);
    res
      .status(201)
      .json({ mensaje: "Usuario registrado exitosamente", id: id ,userData});
  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
    res.status(500).json({ mensaje: "Error al registrar el usuario" });
  }
};
export const getUsers = async (req, res) => {
  
  try {
    const userRef = ref(db, "usuarios");

    // Obtiene los datos de la referencia 'movies'
    await get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.status(201).json(data);
      } else {
        console.log('No hay datos en la referencia "usuarios".');
        res.status(201).json({});
      }
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error.message);
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};
export const delUser = async (req, res) => {
  const { id } = req.params;

  const postRef = ref(db, `/usuarios/${id}`);

  try {

    const snapshot = await get(postRef);

    if (snapshot.exists()) {
    
      remove(postRef);

      res.status(200).json({ mensaje: "user eliminado exitosamente." });
    } else {
      res.status(403).json({
        mensaje:
          "No se puede eliminar el user. El user no existe o no tienes permisos.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el user:", error.message);
    res.status(500).json({ mensaje: "Error al eliminar el user." });
  }
};
export const getUserByID =async(req,res)=>{
  try {
    const { id } = req.params;

    // Obtener la referencia al usuario en la base de datos
    const userRef = ref(db, `usuarios/${id}`);
    
    // Obtener la información del usuario
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({userData, id});
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }

}
