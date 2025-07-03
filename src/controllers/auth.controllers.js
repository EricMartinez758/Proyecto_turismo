// src/controllers/auth.controllers.js
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';


export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
       
        const result = await pool.query(
            `SELECT 
                tu.id, 
                tu.correo, 
                tu.contraseña, 
                tu.estado, -- <-- ¡Asegúrate de seleccionar la columna 'estado'!
                tr.nombre AS role 
             FROM turttusu tu 
             JOIN turtmrol tr ON tu.rol_id = tr.id 
             WHERE tu.correo = $1`,
            [correo]
        );
        const user = result.rows[0];

        
        if (!user) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

       
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        
        if (user.estado !== 'activo') {
           
            return res.status(401).json({ message: ["Tu cuenta está inactiva. Por favor, contacta al administrador."] });
        }
        
        const token = await createAccessToken({ id: user.id, correo: user.correo, role: user.role });

       
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax', 
            maxAge: 3600000 
        });

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            user: {
                id: user.id,
                correo: user.correo,
                role: user.role, 
                estado: user.estado 
            }
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
            'SELECT tu.id, tu.correo, tu.creacion, tr.nombre as role FROM turttusu tu JOIN turtmrol tr ON tu.rol_id = tr.id WHERE tu.id = $1',
            [req.user.id]
        );
        const userFound = result.rows[0];

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        return res.json({
            id: userFound.id,
            correo: userFound.correo,
            createdAt: userFound.creacion,
            role: userFound.role
        });

    } catch (error) {
        console.error("Error al obtener el perfil de usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener el perfil." });
    }
};