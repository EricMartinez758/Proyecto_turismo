// src/controllers/admin.controller.js
import { pool } from '../db.js'; // Asegúrate de que esta ruta a tu configuración de la BD sea correcta
import bcrypt from 'bcryptjs'; // Necesitas importar bcryptjs para hashear contraseñas

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

/**
 * Actualiza el rol y el estado de un trabajador específico.
 */
export const updateTrabajador = async (req, res) => {
    const { id } = req.params;
    const { rol_id, estado } = req.body; // 'estado' se espera como 'activo' o 'inactivo'

    try {
        // Validar que el rol_id sea un número entero y exista
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
        // Obtener el nombre del rol actualizado para la respuesta
        const roleNameResult = await pool.query('SELECT nombre FROM turtmrol WHERE id = $1', [updatedTrabajador.rol_id]);
        updatedTrabajador.role = roleNameResult.rows[0].nombre; // Añadir el nombre del rol a la respuesta

        res.json({ message: 'Trabajador actualizado exitosamente.', trabajador: updatedTrabajador });
    } catch (error) {
        console.error('Error al actualizar trabajador:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar trabajador.' });
    }
};

/**
 * Obtiene la lista de todos los roles disponibles de la tabla turtmrol.
 */
export const getRolesList = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre FROM turtmrol ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la lista de roles.' });
    }
};

/**
 * Crea un nuevo trabajador. Solo para uso administrativo (superusuario).
 */
export const createTrabajador = async (req, res) => {
    const { correo, contrasena, rol_id, estado } = req.body;

    // Validaciones básicas
    if (!correo || !contrasena || !rol_id || typeof estado === 'undefined') {
        return res.status(400).json({ message: "Todos los campos son requeridos: correo, contraseña, rol y estado." });
    }

    try {
        // 1. Verificar si el correo ya existe
        const existingUser = await pool.query('SELECT id FROM turttusu WHERE correo = $1', [correo]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "El correo ya está registrado." });
        }

        // 2. Verificar que el rol_id sea válido (opcional pero recomendado)
        const roleExists = await pool.query('SELECT id FROM turtmrol WHERE id = $1', [rol_id]);
        if (roleExists.rows.length === 0) {
            return res.status(400).json({ message: "ID de rol inválido. El rol especificado no existe." });
        }

        // 3. Hashear la contraseña
        const passwordHash = await bcrypt.hash(contrasena, 10); // 10 es un buen valor de salt rounds

        // 4. Convertir estado booleano (del frontend) a string 'activo'/'inactivo' para la BD
        // El frontend envía 'estado' como true/false, tu ENUM espera 'activo'/'inactivo'
        const estadoDB = estado ? 'activo' : 'inactivo';

        // 5. Insertar el nuevo trabajador en la base de datos
        // Asumiendo que 'creacion' es una columna con DEFAULT NOW() o que quieres establecerla aquí
        const newTrabajadorResult = await pool.query(
            `INSERT INTO turttusu (correo, contraseña, rol_id, estado, creacion)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id, correo, rol_id, estado, creacion`, // Retorna los datos insertados
            [correo, passwordHash, rol_id, estadoDB]
        );

        const newTrabajador = newTrabajadorResult.rows[0];

        res.status(201).json({
            message: "Trabajador creado exitosamente.",
            trabajador: {
                id: newTrabajador.id,
                correo: newTrabajador.correo,
                rol_id: newTrabajador.rol_id,
                estado: newTrabajador.estado,
                creacion: newTrabajador.creacion
            }
        });

    } catch (error) {
        console.error("Error al crear trabajador:", error);
        res.status(500).json({ message: "Error interno del servidor al crear trabajador." });
    }
};