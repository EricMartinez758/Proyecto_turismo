import { pool } from '../db.js';

export const createEvent = async (req, res) => {
  try {
    const {
      description,
      tipo_id,
      precio_persona,
      fecha_actividad,
      hora_actividad,
      fecha_fin,
      hora_fin,
      numero_total,
      guias = [],
      conductores = [],
    } = req.body;

    console.log('Datos recibidos en backend:', req.body);

    // Validación detallada
    const missingFields = [];
    if (!description?.trim()) missingFields.push('descripción');
    if (!tipo_id) missingFields.push('tipo de actividad');
    if (!fecha_actividad) missingFields.push('fecha de actividad');
    if (!hora_actividad) missingFields.push('hora de actividad');
    if (precio_persona === undefined || precio_persona === null)
      missingFields.push('precio por persona');
    if (numero_total === undefined || numero_total === null)
      missingFields.push('número total de clientes');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
        missingFields,
        receivedData: req.body,
      });
    }

    // Validación de tipos
    if (isNaN(Number(tipo_id))) {
      return res.status(400).json({ message: 'tipo_id debe ser un número' });
    }

    // Iniciar transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insertar la actividad principal
      const actividadQuery = `
        INSERT INTO Turttact (
          tipo_id, 
          fecha_actividad, 
          hora_actividad, 
          fecha_fin, 
          hora_fin, 
          precio_persona, 
          numero_total,
          descripcion, 
          estado
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo') 
        RETURNING id
      `;

      const actividadValues = [
        tipo_id,
        fecha_actividad,
        hora_actividad,
        fecha_fin,
        hora_fin,
        precio_persona,
        numero_total,
        description,
      ];

      const actividadResult = await client.query(
        actividadQuery,
        actividadValues
      );
      const actividadId = actividadResult.rows[0].id;

      // 2. Insertar relaciones con guías (Turttgac)
      if (guias && guias.length > 0) {
        for (const guiaId of guias) {
          await client.query(
            'INSERT INTO Turttgac (personas_id, actividad_id) VALUES ($1, $2)',
            [guiaId, actividadId]
          );
        }
      }

      // 3. Insertar relaciones con conductores (Turttacv)
      if (conductores && conductores.length > 0) {
        for (const conductorId of conductores) {
          await client.query(
            'INSERT INTO Turttacv (persona_id, actividad_id) VALUES ($1, $2)',
            [conductorId, actividadId]
          );
        }
      }

      await client.query('COMMIT');

      return res.status(201).json({
        message: 'Evento creado exitosamente',
        eventId: actividadId,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al crear evento:', error);
    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
};

export const getEventTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM Turtmtac');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos de actividad:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getGuides = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.id, p.numero_documento, p.primer_nombre, p.primer_apellido 
      FROM Turttgui g
      JOIN Turtmper p ON g.persona = p.id
      WHERE g.estado = 'activo'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener guías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, p.numero_documento, p.primer_nombre, p.primer_apellido 
      FROM Turttcho c
      JOIN Turtmper p ON c.persona = p.id
      WHERE c.estado = 'activo'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.descripcion,
        a.tipo_id,
        t.nombre as tipo_nombre,
        a.fecha_actividad,
        a.hora_actividad,
        a.fecha_fin,
        a.hora_fin,
        a.precio_persona,
        a.numero_total,
        a.estado
      FROM Turttact a
      JOIN Turtmtac t ON a.tipo_id = t.id
      ORDER BY a.fecha_actividad DESC, a.hora_actividad DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
