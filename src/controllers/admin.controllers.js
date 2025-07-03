
import { pool } from '../db.js';


export const getTrabajadores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         tu.id,
         tu.correo,
         tu.estado,
         tu.rol_id,
         tr.nombre as role
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
    // Opcional: Validar que el rol_id sea un número entero y exista
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