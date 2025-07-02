// src/controllers/auth.controllers.js
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

// Eliminamos la importación de getRoleNameById porque no la necesitamos si hacemos JOINs

export const register = async (req, res) => {
    const { correo, contraseña } = req.body;
    const defaultRoleId = 2; // Asumiendo que 2 es el ID para 'usuario' en turtmrol

    try {
        const userExists = await pool.query('SELECT id FROM turttusu WHERE correo = $1', [correo]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: "El correo ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // MODIFICACIÓN IMPORTANTE AQUÍ: Insertamos el usuario y luego hacemos un JOIN para obtener el nombre del rol.
        // Esto es un enfoque común: insertar primero y luego seleccionar el usuario recién creado con su rol.
        const insertResult = await pool.query(
            'INSERT INTO turttusu (correo, contraseña, rol_id) VALUES ($1, $2, $3) RETURNING id',
            [correo, hashedPassword, defaultRoleId]
        );
        const newUserId = insertResult.rows[0].id; // Obtener el ID del usuario recién creado

        // Ahora, selecciona el usuario recién creado junto con el nombre de su rol
        const userResult = await pool.query(
            'SELECT tu.id, tu.correo, tr.nombre as role FROM turttusu tu JOIN turtmrol tr ON tu.rol_id = tr.id WHERE tu.id = $1',
            [newUserId]
        );
        const newUser = userResult.rows[0]; // Este objeto newUser ya contendrá 'role'

        if (!newUser) {
            // Esto no debería suceder si la inserción fue exitosa, pero es una buena práctica de manejo de errores
            return res.status(500).json({ message: "Error al recuperar el usuario recién registrado." });
        }

        const token = await createAccessToken({ id: newUser.id, correo: newUser.correo, role: newUser.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000 // 1 hora
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente.",
            user: {
                id: newUser.id,
                correo: newUser.correo,
                role: newUser.role // Ya viene en newUser
            }
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar usuario." });
    }
};

export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // MODIFICACIÓN IMPORTANTE AQUÍ: Hacemos el JOIN directamente en la consulta de login
        const result = await pool.query(
            'SELECT tu.id, tu.correo, tu.contraseña, tr.nombre as role FROM turttusu tu JOIN turtmrol tr ON tu.rol_id = tr.id WHERE tu.correo = $1',
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

        // El nombre del rol ya está disponible en user.role
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
                role: user.role // Ya viene en user
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