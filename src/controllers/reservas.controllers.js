// src/controllers/reservas.controller.js

import { pool } from '../db.js';

// --- FUNCIONES PARA OBTENER DATOS AUXILIARES ---

/**
 * Obtiene una lista de clientes disponibles con estado 'activo'.
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
            WHERE LOWER(tc.estado) = 'activo' -- Convertir a minúsculas para comparación insensible a mayúsculas/minúsculas
            ORDER BY tmp.primer_nombre, tmp.primer_apellido ASC
        `);
        console.log('Backend (getAvailableClients): Raw clients data from DB:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener clientes.' });
    }
};

/**
 * Obtiene una lista de actividades disponibles con sus precios calculados
 * y estados 'activo', 'disponible' o 'planificado'.
 */
export const getAvailableActivities = async (req, res) => {
    try {
        // Obtener la última tasa de cambio
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

        // Obtener las actividades
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
            WHERE LOWER(ta.estado) IN ('activo', 'disponible', 'planificado') -- Múltiples estados y comparación insensible a mayúsculas/minúsculas
            ORDER BY ta.descripcion ASC
        `);
        console.log('Backend (getAvailableActivities): Raw activities data from DB:', activitiesResult.rows);

        // Mapear resultados y calcular precios dinámicamente
        const activitiesWithPrices = activitiesResult.rows.map(activity => {
            const prices = {};
            prices['USD'] = activity.precio_persona; 
            prices['VES'] = activity.precio_persona * (latestRates.tasa_usd_bs || 0);
            prices['EUR'] = activity.precio_persona * (latestRates.tasa_usd_eur || 0);
            prices['COP'] = activity.precio_persona * (latestRates.tata_usd_cop || 0); // Corregido: tasa_usd_cop

            return {
                id: activity.id,
                type: activity.tipo_actividad_nombre,
                description: activity.descripcion,
                price: prices, // Objeto de precios completo
                originalDate: activity.fecha_actividad,
                originalTime: activity.hora_actividad,
                status: activity.estado
            };
        });
        console.log('Backend (getAvailableActivities): Mapped activities data to send to frontend:', activitiesWithPrices);

        res.json(activitiesWithPrices);
    } catch (error) {
        console.error('Error al obtener actividades disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener actividades.' });
    }
};

/**
 * Obtiene todas las reservas con detalles completos, incluyendo información de pago de Turttpag,
 * utilizando un procedimiento almacenado.
 */
export const getReservations = async (req, res) => {
    try {
        // Obtener la última tasa de cambio de Turtmcmb (esto sigue siendo necesario aquí si no lo mueves al SP)
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

        // Llama al procedimiento almacenado para obtener las reservas
        const reservationsResult = await pool.query(`SELECT * FROM get_all_reservations_details()`);

        console.log('Backend: Raw reservations data from DB (from SP):', reservationsResult.rows);

        // El mapeo sigue siendo el mismo porque el SP devuelve los mismos alias de columna
        const reservationsWithPrices = reservationsResult.rows.map(res => {
            const prices = {};
            prices['USD'] = res.activity_price_per_person;
            prices['VES'] = res.activity_price_per_person * (latestRates.tasa_usd_bs || 0);
            prices['EUR'] = res.activity_price_per_person * (latestRates.tasa_usd_eur || 0);
            prices['COP'] = res.activity_price_per_person * (latestRates.tasa_usd_cop || 0);

            return {
                id: res.reservation_id,
                reservationCode: `RES-${String(res.reservation_id || '').padStart(3, '0')}`,
                reservationDate: res.reservation_date,
                activity: {
                    id: res.actividad_id,
                    type: res.activity_type_name,
                    description: res.activity_description,
                    location: 'N/A',
                    price: prices,
                    originalDate: res.activity_original_date,
                    originalTime: res.activity_original_time,
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

        console.log('Backend: Mapped reservations data to send to frontend:', reservationsWithPrices);

        res.json(reservationsWithPrices);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener reservas.' });
    }
};

/**
 * Crea una nueva reserva utilizando un procedimiento almacenado.
 */
export const createReservation = async (req, res) => {
    const { user: currentUser } = req;
    const usuario_id = currentUser ? currentUser.id : null;

    const {
        cliente_id,
        actividad_id,
        fecha,
        estado = 'pendiente',
        cantidad_personas,
        pagado, // Recibe el estado de pagado desde el frontend
        metodo_pago, // Recibe el método de pago desde el frontend
        total_pago // Recibe el total_pago desde el frontend (calculado en el frontend)
    } = req.body;

    if (!usuario_id || !cliente_id || !actividad_id || !fecha || !cantidad_personas) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear la reserva (cliente_id, actividad_id, fecha, cantidad_personas).' });
    }

    try {
        // Llama al procedimiento almacenado
        const result = await pool.query(
            `SELECT new_reservation_id, new_reservation_estado, new_cantidad_personas FROM create_new_reservation($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                usuario_id,
                cliente_id,
                actividad_id,
                fecha,
                estado,
                cantidad_personas,
                pagado,        // Parámetro p_pagado
                metodo_pago,   // Parámetro p_metodo_pago
                total_pago     // Parámetro p_total_pago
            ]
        );

        const newReservationDetails = result.rows[0]; // El procedimiento devuelve una fila
        if (newReservationDetails) {
            res.status(201).json({
                message: 'Reserva creada exitosamente mediante procedimiento almacenado.',
                reservation: {
                    id: newReservationDetails.new_reservation_id,
                    estado: newReservationDetails.new_reservation_estado,
                    cantidad_personas: newReservationDetails.new_cantidad_personas
                    // Puedes añadir más campos si el procedimiento los devuelve
                }
            });
        } else {
            res.status(500).json({ message: 'Error al crear reserva: El procedimiento almacenado no devolvió datos.' });
        }
    } catch (error) {
        console.error('Error al crear reserva con procedimiento almacenado:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al crear reserva.' });
    }
};

/**
 * Actualiza el estado de una reserva.
 */
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

/**
 * Cancela una reserva cambiando su estado a 'cancelada'.
 */
export const cancelReservation = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la reserva de los parámetros de la ruta

    try {
        const result = await pool.query(
            `UPDATE turttres SET estado = 'cancelada' WHERE id = $1 RETURNING id, estado`,
            [id]
        );

        if (result.rows.length === 0) {
            // Si no se encontró ninguna fila con ese ID, la reserva no existe
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        // Si la actualización fue exitosa, devuelve la reserva actualizada
        res.json({ message: 'Reserva cancelada exitosamente.', reservation: result.rows[0] });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al cancelar reserva.' });
    }
};

/**
 * Actualiza los detalles de una reserva existente.
 */
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

/**
 * Procesa un pago para una reserva utilizando un procedimiento almacenado.
 */
export const processPayment = async (req, res) => {
    const { id } = req.params; // ID de la reserva
    const { currency, amount, reference, paymentDate } = req.body; // Datos del pago

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
        // Llama al procedimiento almacenado para procesar el pago
        const result = await pool.query(
            `SELECT payment_id, payment_status, payment_total FROM process_reservation_payment($1, $2, $3, $4, $5, $6)`,
            [
                parseInt(id), // Asegúrate de que el ID de la reserva sea un entero si tu BD lo espera así
                usuario_id,
                currency,
                parseFloat(amount),
                reference,
                paymentDate
            ]
        );

        const newPaymentDetails = result.rows[0];
        if (newPaymentDetails) {
            res.json({
                message: 'Pago procesado exitosamente mediante procedimiento almacenado.',
                payment: {
                    id: newPaymentDetails.payment_id,
                    estado_pago: newPaymentDetails.payment_status,
                    total_pago: newPaymentDetails.payment_total
                }
            });
        } else {
            res.status(500).json({ message: 'Error al procesar pago: El procedimiento almacenado no devolvió datos.' });
        }

    } catch (error) {
        console.error('Error al procesar pago con procedimiento almacenado:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor al procesar pago.' });
    }
};
