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

export const createUser=async(req,res)=>{
    const {id,name}=req.body;
    try {
        
        const usersRef = ref(db, 'usuarios');
        set(usersRef, {
          [id]: {
            nombre:name,
            compras: [],
            alquileres: []
          }
        });
    
        console.log('Usuario registrado exitosamente con ID:', id);
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', userId: id });
      } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
      }
}
// export const createUser = async (req, res) => {
//     const { gmail, password } = req.body;
  
//     try {
//       // Crea un nuevo usuario en Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, gmail, password);
  
//       // Usuario registrado exitosamente
//       const nuevoUsuario = userCredential.user;
//       console.log('Nuevo usuario registrado con ID:', nuevoUsuario.uid);
  
//       res.status(201).json({ mensaje: 'Usuario registrado exitosamente', userId: nuevoUsuario.uid });
//     } catch (error) {
//       console.error('Error al registrar el usuario:', error.message);
//       res.status(500).json({ mensaje: 'Error al registrar el usuario' });
//     }
// }