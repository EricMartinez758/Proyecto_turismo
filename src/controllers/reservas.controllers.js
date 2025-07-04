// src/controllers/reservas.controller.js
import { pool } from '../db.js';

// --- FUNCIONES PARA OBTENER DATOS AUXILIARES ---

/**
 * Obtiene la lista de clientes disponibles (id, primer_nombre, primer_apellido, numero_documento, telefono)
 * Necesario para el modal de creación de reservas.
 * Las columnas coinciden con turtmper y turttcli.
 */
export const getAvailableClients = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                tc.id,
                tmp.primer_nombre,
                tmp.primer_apellido,
                tmp.numero_documento,
                tmp.telefono
            FROM turttcli tc
            JOIN turtmper tmp ON tc.persona = tmp.id
            -- TEMPORALMENTE ELIMINAMOS EL FILTRO DE ESTADO PARA DEPURAR
            -- WHERE tc.estado = 'activo'
            ORDER BY tmp.primer_nombre, tmp.primer_apellido ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener clientes.' });
    }
};




// src/controllers/reservas.controller.js

export const getAvailableActivities = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                descripcion,
                tipo_id,        -- Incluimos tipo_id para ver su valor
                precio_persona,
                fecha_actividad,
                hora_actividad,
                estado
            FROM turttact
            -- TEMPORALMENTE ELIMINAMOS EL FILTRO DE ESTADO PARA DEPURAR
            -- WHERE estado = 'activo'
            -- TEMPORALMENTE ELIMINAMOS EL JOIN A Turtmtac PARA DEPURAR
            -- JOIN Turtmtac tmt ON ta.tipo_id = tmt.id
            ORDER BY descripcion ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener actividades disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener actividades.' });
    }
};

// src/controllers/reservas.controller.js

export const getReservations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                tr.id AS reservation_id,
                tr.fecha AS reservation_date,
                tr.estado AS reservation_status,
                -- Columnas de turttres que NO existen según tus imágenes.
                -- Si las añades a turttres, descomenta aquí y en INSERT/UPDATE.
                -- tr.cantidad_personas,
                -- tr.metodo_pago,
                -- tr.pagado,
                tr.usuario_id,
                tu.correo AS user_email,
                tr.cliente_id,
                tmp.primer_nombre AS client_first_name,
                tmp.primer_apellido AS client_last_name,
                tmp.numero_documento AS client_id_number,
                tmp.telefono AS client_phone,
                tr.actividad_id,
                -- Columnas de turttact (usando alias 'ta'):
                ta.descripcion AS activity_description,      -- Descripción de la actividad específica
                ta.precio_persona AS activity_price_per_person, -- Precio por persona
                ta.fecha_actividad AS activity_original_date, -- Fecha de la actividad original
                ta.hora_actividad AS activity_original_time,  -- Hora de la actividad original
                tmt.nombre AS activity_type_name             -- Nombre del tipo de actividad (ej. 'tour')
            FROM turttres tr
            JOIN turttusu tu ON tr.usuario_id = tu.id
            JOIN turttcli tc ON tr.cliente_id = tc.id
            JOIN turtmper tmp ON tc.persona = tmp.id
            JOIN turttact ta ON tr.actividad_id = ta.id        -- Alias 'ta' para turttact
            JOIN Turtmtac tmt ON ta.tipo_id = tmt.id           -- ¡Nuevo JOIN a Turtmtac!
            ORDER BY tr.fecha DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener reservas.' });
    }
};

/**
 * Crea una nueva reserva.
 * REQUISITO: Este es un candidato IDEAL para un PROCESO ALMACENADO.
 * Las columnas insertadas coinciden con turttres.
 * NOTA: `cantidad_personas`, `metodo_pago`, `pagado` NO ESTÁN EN TURTTRES según tus imágenes.
 * Si las necesitas, debes añadirlas a la tabla turttres en tu BD.
 */
export const createReservation = async (req, res) => {
    // usuario_id debe venir del token/sesión, no del body para seguridad
    const { user: currentUser } = req; // Asume que req.user es establecido por authRequired
    const usuario_id = currentUser ? currentUser.id : null; // Obtener ID del usuario logueado

    const {
        cliente_id,
        actividad_id,
        fecha, // Fecha de la reserva/actividad
        estado = 'pendiente', // Estado por defecto
        // Estas columnas NO están en turttres según tus imágenes.
        // Si las añades a turttres, descomenta y úsalas en el INSERT.
        // cantidad_personas,
        // metodo_pago,
        // pagado = false
    } = req.body;

    // Validaciones básicas
    if (!usuario_id || !cliente_id || !actividad_id || !fecha) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear la reserva.' });
    }
    // Si añades cantidad_personas, metodo_pago, pagado a turttres, valida también aquí:
    // if (!cantidad_personas || !metodo_pago || typeof pagado === 'undefined') { ... }

    try {
        // Asegúrate de que las columnas en el INSERT coincidan con tu tabla turttres.
        // Si añadiste 'cantidad_personas', 'metodo_pago', 'pagado' a turttres, inclúyelas aquí.
        const result = await pool.query(
            `INSERT INTO turttres (usuario_id, cliente_id, actividad_id, fecha, estado)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, usuario_id, cliente_id, actividad_id, fecha, estado`,
            [usuario_id, cliente_id, actividad_id, fecha, estado]
            // Si añadiste columnas: [usuario_id, cliente_id, actividad_id, fecha, estado, cantidad_personas, metodo_pago, pagado]
        );

        const newReservation = result.rows[0];
        res.status(201).json({ message: 'Reserva creada exitosamente.', reservation: newReservation });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al crear reserva.' });
    }
};

/**
 * Actualiza el estado de una reserva (ej. activo/inactivo, o un estado específico).
 */
export const updateReservationStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Nuevo estado (ej. 'confirmada', 'cancelada', 'activa', 'inactiva')

    if (!estado) {
        return res.status(400).json({ message: 'El nuevo estado es requerido.' });
    }

    try {
        const result = await pool.query(
            'UPDATE turttres SET estado = $1 WHERE id = $2 RETURNING id, estado',
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }
        res.json({ message: 'Estado de reserva actualizado exitosamente.', reservation: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar estado de reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al actualizar estado de reserva.' });
    }
};

/**
 * Cancela una reserva (cambia su estado a 'cancelada').
 */
export const cancelReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE turttres SET estado = 'cancelada' WHERE id = $1 RETURNING id, estado`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }
        res.json({ message: 'Reserva cancelada exitosamente.', reservation: result.rows[0] });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al cancelar reserva.' });
    }
};

/**
 * Actualiza los detalles de una reserva (para el modal de edición).
 * NOTA: `cantidad_personas`, `metodo_pago`, `pagado` NO ESTÁN EN TURTTRES según tus imágenes.
 * Si las necesitas, debes añadirlas a la tabla turttres en tu BD.
 */
export const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { cliente_id, actividad_id, fecha, estado, /*cantidad_personas, metodo_pago, pagado*/ } = req.body;

    // Validaciones básicas (ajusta si añades más columnas a turttres)
    if (!cliente_id || !actividad_id || !fecha || !estado) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar la reserva.' });
    }
    // Si añades cantidad_personas, metodo_pago, pagado a turttres, valida también aquí:
    // if (!cantidad_personas || typeof metodo_pago === 'undefined' || typeof pagado === 'undefined') { ... }

    try {
        // Asegúrate de que las columnas en el UPDATE coincidan con tu tabla turttres.
        // Si añadiste 'cantidad_personas', 'metodo_pago', 'pagado' a turttres, inclúyelas aquí.
        const result = await pool.query(
            `UPDATE turttres SET
                cliente_id = $1,
                actividad_id = $2,
                fecha = $3,
                estado = $4
                -- cantidad_personas = $5, -- Descomentar si añades esta columna
                -- metodo_pago = $6,       -- Descomentar si añades esta columna
                -- pagado = $7             -- Descomentar si añades esta columna
             WHERE id = $5 -- Ajusta el índice del parámetro si añades columnas arriba
             RETURNING id, cliente_id, actividad_id, fecha, estado`,
            [cliente_id, actividad_id, fecha, estado, id]
            // Si añades columnas: [cliente_id, actividad_id, fecha, estado, cantidad_personas, metodo_pago, pagado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }
        res.json({ message: 'Reserva actualizada exitosamente.', reservation: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al actualizar reserva.' });
    }
};
