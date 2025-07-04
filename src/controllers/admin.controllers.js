// src/controllers/admin.controller.js
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export const getTrabajadores = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                tu.id,
                tu.correo,
                tu.estado,
                tu.rol_id,
                tr.nombre as role -- Asume que 'nombre' es la columna del nombre del rol en turtmrol
            FROM turttusu tu
            JOIN turtmrol tr ON tu.rol_id = tr.id
            ORDER BY tu.id ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener trabajadores:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener trabajadores.' });
    }
};


export const updateTrabajador = async (req, res) => {
    const { id } = req.params;
    const { rol_id, estado } = req.body;

    try {
        if (typeof rol_id !== 'number' || !['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ message: 'Datos de entrada inválidos para rol_id o estado.' });
        }

        const roleExists = await pool.query('SELECT id FROM turtmrol WHERE id = $1', [rol_id]);
        if (roleExists.rows.length === 0) {
            return res.status(400).json({ message: 'El ID de rol proporcionado no es válido.' });
        }

        const result = await pool.query(
            'UPDATE turttusu SET rol_id = $1, estado = $2 WHERE id = $3 RETURNING id, correo, rol_id, estado',
            [rol_id, estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Trabajador no encontrado.' });
        }

        const updatedTrabajador = result.rows[0];

        const roleNameResult = await pool.query('SELECT nombre FROM turtmrol WHERE id = $1', [updatedTrabajador.rol_id]);
        updatedTrabajador.role = roleNameResult.rows[0].nombre;

        res.json({ message: 'Trabajador actualizado exitosamente.', trabajador: updatedTrabajador });
    } catch (error) {
        console.error('Error al actualizar trabajador:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar trabajador.' });
    }
};

export const getRolesList = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre FROM turtmrol ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la lista de roles.' });
    }
};

export const createTrabajador = async (req, res) => {
    const { correo, contrasena, rol_id, estado } = req.body;

    if (!correo || !contrasena || !rol_id || typeof estado === 'undefined') {
        console.log('Validación inicial falló: campos requeridos faltantes.');
        return res.status(400).json({ message: "Todos los campos son requeridos: correo, contraseña, rol y estado." });
    }

    const parsedRolId = parseInt(rol_id);
    if (isNaN(parsedRolId)) {
        console.error("Error de validación: rol_id no es un número válido. Valor recibido:", rol_id);
        return res.status(400).json({ message: "El ID de rol proporcionado no es un número válido." });
    }
    console.log('Valor de parsedRolId (para la BD):', parsedRolId, 'Tipo:', typeof parsedRolId);


    try {
        const passwordHash = await bcrypt.hash(contrasena, 10);
        const estadoDB = estado ? 'activo' : 'inactivo';

        const result = await pool.query(
            'SELECT * FROM create_new_trabajador($1, $2, $3, $4)',
            [correo, passwordHash, parsedRolId, estadoDB] 
        );

        const newTrabajador = result.rows[0];

        res.status(201).json({
            message: "Trabajador creado exitosamente.",
            trabajador: {
                id: newTrabajador.id,        
                correo: newTrabajador.correo,
                rol_id: newTrabajador.rol_id, 
                estado: newTrabajador.estado,
                creacion: newTrabajador.creacion,
                role: newTrabajador.role_name
            }
        });

    } catch (error) {
        console.error("Error al crear trabajador:", error);
        res.status(500).json({ message: error.message || "Error interno del servidor al crear trabajador." });
    } finally {
       
    }
};