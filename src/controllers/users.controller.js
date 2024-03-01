import { auth } from "../db.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

export const createUser = async (req, res) => {
  const { id, name,rol } = req.body;
  
  try {
    const usersRef = ref(db, "usuarios");
    set(usersRef, {
      [id]: {
        nombre: name,
        compras: [],
        alquileres: [],
        rol:rol
      },
    });

    console.log("Usuario registrado exitosamente con ID:", id);
    res
      .status(201)
      .json({ mensaje: "Usuario registrado exitosamente", userId: id });
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
