// src/controllers/reservas.controller.js
import { pool } from '../db.js';

// --- FUNCIONES PARA OBTENER DATOS AUXILIARES ---

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
            WHERE tc.estado = 'Activo'
            ORDER BY tmp.primer_nombre, tmp.primer_apellido ASC
        `);
        console.log('Backend (getAvailableClients): Raw clients data from DB:', result.rows); // Log de clientes
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener clientes.' });
    }
};

export const getAvailableActivities = async (req, res) => {
    try {
        const ratesResult = await pool.query(`
            SELECT
                tasa_usd_bs,
                tasa_usd_eur,
                tasa_usd_cop,
                fecha
            FROM Turtmcmb
            ORDER BY fecha DESC
            LIMIT 1;
        `);
        const latestRates = ratesResult.rows[0] || { tasa_usd_bs: 0, tasa_usd_eur: 0, tasa_usd_cop: 0 };

        const activitiesResult = await pool.query(`
            SELECT
                ta.id,
                ta.descripcion,
                ta.tipo_id,
                ta.precio_persona,
                ta.fecha_actividad,
                ta.hora_actividad,
                ta.estado,
                tmt.nombre AS tipo_actividad_nombre
            FROM turttact ta
            JOIN Turtmtac tmt ON ta.tipo_id = tmt.id
            WHERE ta.estado = 'Activo'
            ORDER BY ta.descripcion ASC
        `);
        console.log('Backend (getAvailableActivities): Raw activities data from DB:', activitiesResult.rows); // Log de actividades

        const activitiesWithPrices = activitiesResult.rows.map(activity => {
            const prices = {};
            prices['USD'] = activity.precio_persona; 
            prices['VES'] = activity.precio_persona * (latestRates.tasa_usd_bs || 0);
            prices['EUR'] = activity.precio_persona * (latestRates.tasa_usd_eur || 0);
            prices['COP'] = activity.precio_persona * (latestRates.tasa_usd_cop || 0);

            return {
                id: activity.id,
                type: activity.tipo_actividad_nombre,
                description: activity.descripcion,
                price: prices,
                originalDate: activity.fecha_actividad,
                originalTime: activity.hora_actividad,
                status: activity.estado
            };
        });
        console.log('Backend (getAvailableActivities): Mapped activities data to send to frontend:', activitiesWithPrices); // Log de actividades mapeadas

        res.json(activitiesWithPrices);
    } catch (error) {
        console.error('Error al obtener actividades disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener actividades.' });
    }
};

/**
 * Obtiene todas las reservas con detalles completos, incluyendo información de pago de Turttpag.
 */
export const getReservations = async (req, res) => {
    try {
        // Obtener la última tasa de cambio de Turtmcmb
        const ratesResult = await pool.query(`
            SELECT
                tasa_usd_bs,
                tasa_usd_eur,
                tasa_usd_cop,
                fecha
            FROM Turtmcmb
            ORDER BY fecha DESC
            LIMIT 1;
        `);
        const latestRates = ratesResult.rows[0] || { tasa_usd_bs: 0, tasa_usd_eur: 0, tasa_usd_cop: 0 };

        // Obtener las reservas con todos los JOINs necesarios
        const reservationsResult = await pool.query(`
            SELECT
                tr.id AS reservation_id,
                tr.fecha AS reservation_date,
                tr.estado AS reservation_status,
                tr.cantidad_personas,
                tr.usuario_id,
                tu.correo AS user_email,
                tr.cliente_id,
                tmp.primer_nombre AS client_first_name,
                tmp.primer_apellido AS client_last_name,
                tmp.numero_documento AS client_id_number,
                tmp.telefono AS client_phone,
                tr.actividad_id,
                ta.descripcion AS activity_description,
                ta.precio_persona AS activity_price_per_person,
                ta.fecha_actividad AS activity_original_date,
                ta.hora_actividad AS activity_original_time,
                ta.estado AS activity_status,
                tmt.nombre AS activity_type_name,
                tp.total_pago AS payment_total_paid,
                tp.estado_pago AS payment_status,
                tmtpg.nombre AS payment_method_name
            FROM turttres tr
            JOIN turttusu tu ON tr.usuario_id = tu.id
            JOIN turttcli tc ON tr.cliente_id = tc.id
            JOIN turtmper tmp ON tc.persona = tmp.id
            JOIN turttact ta ON tr.actividad_id = ta.id
            JOIN Turtmtac tmt ON ta.tipo_id = tmt.id
            LEFT JOIN Turttpag tp ON tr.id = tp.reserva_id
            LEFT JOIN Turtmtpg tmtpg ON tp.tipo_pago_id = tmtpg.id
            ORDER BY tr.fecha DESC, tr.id DESC
        `);

       

        // Mapear resultados y calcular precios dinámicamente
        const reservationsWithPrices = reservationsResult.rows.map(res => {
            const prices = {};
            prices['USD'] = res.activity_price_per_person;
            prices['VES'] = res.activity_price_per_person * (latestRates.tasa_usd_bs || 0);
            prices['EUR'] = res.activity_price_per_person * (latestRates.tasa_usd_eur || 0);
            prices['COP'] = res.activity_price_per_person * (latestRates.tasa_usd_cop || 0);

            return {
                id: res.reservation_id, // <-- Asegúrate de que reservation_id no sea null/0 en la DB
                reservationCode: `RES-${String(res.reservation_id || '').padStart(3, '0')}`,
                reservationDate: res.reservation_date,
                activity: {
                    id: res.actividad_id,
                    type: res.activity_type_name,
                    description: res.activity_description,
                    location: 'N/A',
                    price: prices, // <-- Objeto de precios completo
                    originalDate: res.activity_original_date,
                    originalTime: res.activity_original_time, // <-- Corregido
                    status: res.activity_status
                },
                client: {
                    id: res.cliente_id,
                    firstName: res.client_first_name,
                    lastName: res.client_last_name,
                    idNumber: res.client_id_number,
                    phone: res.client_phone
                },
                groupMembers: [],
                people: res.cantidad_personas || 1,
                paymentMethod: res.payment_method_name || 'USD',
                active: res.reservation_status === 'activa',
                canceled: res.reservation_status === 'cancelada',
                paid: res.payment_status === 'completado'
            };
        });

        

        res.json(reservationsWithPrices);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener reservas.' });
    }
};

export const createReservation = async (req, res) => {
    const { user: currentUser } = req;
    const usuario_id = currentUser ? currentUser.id : null;

    const {
        cliente_id,
        actividad_id,
        fecha,
        estado = 'pendiente',
        cantidad_personas,
    } = req.body;

    if (!usuario_id || !cliente_id || !actividad_id || !fecha || !cantidad_personas) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear la reserva (cliente_id, actividad_id, fecha, cantidad_personas).' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO turttres (usuario_id, cliente_id, actividad_id, fecha, estado, cantidad_personas)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, usuario_id, cliente_id, actividad_id, fecha, estado, cantidad_personas`,
            [usuario_id, cliente_id, actividad_id, fecha, estado, cantidad_personas]
        );

        const newReservation = result.rows[0];
        res.status(201).json({ message: 'Reserva creada exitosamente.', reservation: newReservation });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al crear reserva.' });
    }
};

export const updateReservationStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

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

export const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { cliente_id, actividad_id, fecha, estado, cantidad_personas } = req.body;

    if (!cliente_id || !actividad_id || !fecha || !estado || !cantidad_personas) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para actualizar la reserva (cliente_id, actividad_id, fecha, estado, cantidad_personas).' });
    }

    try {
        const result = await pool.query(
            `UPDATE turttres SET
                cliente_id = $1,
                actividad_id = $2,
                fecha = $3,
                estado = $4,
                cantidad_personas = $5
             WHERE id = $6
             RETURNING id, cliente_id, actividad_id, fecha, estado, cantidad_personas`,
            [cliente_id, actividad_id, fecha, estado, cantidad_personas, id]
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

export const processPayment = async (req, res) => {
    const { id } = req.params;
    const { currency, amount, reference, paymentDate } = req.body;

    const { user: currentUser } = req;
    const usuario_id = currentUser ? currentUser.id : null;

    if (!usuario_id) {
        return res.status(401).json({ message: 'Usuario no autenticado para procesar el pago.' });
    }
    if (!currency || !amount || !reference || !paymentDate) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para el pago: moneda, monto, referencia, fecha.' });
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'El monto del pago debe ser un número positivo.' });
    }

    try {
        await pool.query('BEGIN');

        let tipo_pago_id = null;
        try {
            const tipoPagoResult = await pool.query(`SELECT id FROM Turtmtpg WHERE nombre = $1`, [currency]);
            tipo_pago_id = tipoPagoResult.rows[0]?.id;
            if (!tipo_pago_id) {
                tipo_pago_id = 1; 
                console.warn(`Tipo de pago '${currency}' no encontrado en Turtmtpg. Usando ID por defecto: ${tipo_pago_id}`);
            }
        } catch (err) {
            console.error('Error al buscar tipo de pago en Turtmtpg:', err);
            tipo_pago_id = 1;
        }

        const insertPaymentResult = await pool.query(
            `INSERT INTO Turttpag (usuario_id, reserva_id, tipo_pago_id, total_pago, estado_pago, fecha)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *;`,
            [usuario_id, id, tipo_pago_id, parseFloat(amount), 'completado', paymentDate]
        );

        await pool.query('COMMIT');

        res.json({ message: 'Pago procesado y reserva marcada como pagada.', payment: insertPaymentResult.rows[0] });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error al procesar pago:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al procesar pago.' });
    }
};