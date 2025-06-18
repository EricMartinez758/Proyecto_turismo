import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js'; 



export const register = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const userExists = await pool.query('SELECT id FROM turttusu WHERE correo = $1', [correo]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: "El correo ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const result = await pool.query(
            'INSERT INTO turttusu (correo, contraseña) VALUES ($1, $2) RETURNING id, correo',
            [correo, hashedPassword]
        );
        const newUser = result.rows[0];

       
        const token = await createAccessToken({ id: newUser.id, correo: newUser.correo });

    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente.",
            user: { id: newUser.id, correo: newUser.correo }
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar usuario." });
    }
};


export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const result = await pool.query('SELECT id, correo, contraseña FROM turttusu WHERE correo = $1', [correo]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        
        const token = await createAccessToken({ id: user.id, correo: user.correo });

    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000
        });

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            user: { id: user.id, correo: user.correo }
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor al iniciar sesión." });
    }
};



export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        expires: new Date(0) 
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    try {
      
        const result = await pool.query(
            'SELECT id, correo, creacion FROM turttusu WHERE id = $1', 
            [req.user.id] 
        );
        const userFound = result.rows[0];

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

     
        return res.json({
            id: userFound.id,
            correo: userFound.correo,
            createdAt: userFound.creacion 
        });

    } catch (error) {
        console.error("Error al obtener el perfil de usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener el perfil." });
    }
};