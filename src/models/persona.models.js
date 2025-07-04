import { pool } from '../db.js';

export const createPersona = async (personaData) => {
  const {
    numero_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    nacionalidad,
    telefono,
    direccion,
    tipo_persona
  } = personaData;

  const query = `
    INSERT INTO turtmper (
      numero_documento, 
      primer_nombre, 
      segundo_nombre, 
      primer_apellido, 
      segundo_apellido, 
      fecha_nacimiento, 
      nacionalidad, 
      telefono, 
      direccion, 
      estado, 
      creacion
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'activo', NOW()) 
    RETURNING id
  `;

  const values = [
    numero_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    nacionalidad || 'Venezolana',
    telefono,
    direccion
  ];

  const { rows } = await pool.query(query, values);
  const personaId = rows[0].id;

  // Crear relación según el tipo de persona
  if (tipo_persona === 'guia') {
    await pool.query(
      'INSERT INTO turttgui (id, persona, estado, creacion) VALUES ($1, $2, $3, NOW())',
      [personaId, personaId, 'activo']
    );
  } else if (tipo_persona === 'conductor') {
    await pool.query(
      'INSERT INTO turttcho (id, persona, estado, creacion) VALUES ($1, $2, $3, NOW())',
      [personaId, personaId, 'activo']
    );
  } 
    await pool.query(
      'INSERT INTO turttcli (id, persona, estado, creacion) VALUES ($1, $2, $3, NOW())',
      [personaId, personaId, 'activo']
    );
  

  return personaId;
};

export const createBancoPersona = async (bancoData) => {
  const { persona_id, banco_id, numero_cuenta, tipo_cuenta } = bancoData;
  
  const query = `
    INSERT INTO turttbpc (
      persona_id, 
      banco_id, 
      numero_cuenta, 
      tipo_cuenta
    ) 
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const values = [persona_id, banco_id, numero_cuenta, tipo_cuenta || 'corriente'];
  const { rows } = await pool.query(query, values);
  return rows[0].id;
};

export const createHistorialMedico = async (historialData) => {
  const { persona_id, tipo, descripcion_alergia } = historialData;
  
  const query = `
    INSERT INTO turtthmd (
      persona_id, 
      tipo, 
      descripcion_alergia
    ) 
    VALUES ($1, $2, $3)
    RETURNING id
  `;

  const values = [persona_id, tipo, descripcion_alergia];
  const { rows } = await pool.query(query, values);
  return rows[0].id;
};

export const getPersonas = async () => {
  const query = `
    SELECT 
      p.id,
      p.numero_documento,
      p.primer_nombre,
      p.segundo_nombre,
      p.primer_apellido,
      p.segundo_apellido,
      p.fecha_nacimiento,
      p.telefono,
      p.direccion,
      p.estado,
      b.nombre as banco,
      bpc.numero_cuenta as numero_cuenta_bancaria,
      CASE 
        WHEN gui.id IS NOT NULL THEN 'guia'
        WHEN cho.id IS NOT NULL THEN 'conductor'
        WHEN cli.id IS NOT NULL THEN 'cliente'
        ELSE 'otro'
      END as tipo_persona
    FROM turtmper p
    LEFT JOIN turttbpc bpc ON p.id = bpc.persona_id
    LEFT JOIN turtmbco b ON bpc.banco_id = b.id
    LEFT JOIN turttgui gui ON p.id = gui.persona
    LEFT JOIN turttcho cho ON p.id = cho.persona
    LEFT JOIN turttcli cli ON p.id = cli.persona
    ORDER BY p.primer_nombre, p.primer_apellido
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getPersonaById = async (id) => {
  const query = `
    SELECT 
      p.*,
      b.id as banco_id,
      b.nombre as banco,
      bpc.numero_cuenta,
      bpc.tipo_cuenta,
      CASE 
        WHEN gui.id IS NOT NULL THEN 'guia'
        WHEN cho.id IS NOT NULL THEN 'conductor'
        WHEN cli.id IS NOT NULL THEN 'cliente'
        ELSE 'otro'
      END as tipo_persona,
      json_agg(
        json_build_object(
          'id', hm.id,
          'tipo', tn.nombre,
          'descripcion', hm.descripcion_alergia
        )
      ) as historial_medico
    FROM turtmper p
    LEFT JOIN turttbpc bpc ON p.id = bpc.persona_id
    LEFT JOIN turtmbco b ON bpc.banco_id = b.id
    LEFT JOIN turttgui gui ON p.id = gui.persona
    LEFT JOIN turttcho cho ON p.id = cho.persona
    LEFT JOIN turttcli cli ON p.id = cli.persona
    LEFT JOIN turtthmd hm ON p.id = hm.persona_id
    LEFT JOIN turtmtnm tn ON hm.tipo = tn.id
    WHERE p.id = $1
    GROUP BY p.id, b.id, bpc.id, gui.id, cho.id, cli.id
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updatePersona = async (id, personaData) => {
  const {
    numero_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    nacionalidad,
    telefono,
    direccion,
    tipo_persona
  } = personaData;

  const query = `
    UPDATE turtmper 
    SET 
      numero_documento = $1,
      primer_nombre = $2,
      segundo_nombre = $3,
      primer_apellido = $4,
      segundo_apellido = $5,
      fecha_nacimiento = $6,
      nacionalidad = $7,
      telefono = $8,
      direccion = $9
    WHERE id = $10
  `;

  const values = [
    numero_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    nacionalidad || 'Venezolana',
    telefono,
    direccion,
    id
  ];

  await pool.query(query, values);

  // Actualizar tipo de persona si es necesario
  if (tipo_persona) {
    // Primero eliminar relaciones existentes
    await pool.query('DELETE FROM turttgui WHERE persona = $1', [id]);
    await pool.query('DELETE FROM turttcho WHERE persona = $1', [id]);
    await pool.query('DELETE FROM turttcli WHERE persona = $1', [id]);

    // Crear nueva relación según el tipo
    if (tipo_persona === 'guia') {
      await pool.query(
        'INSERT INTO turttgui (id, persona, estado, creacion) VALUES ($1, $2, $3, NOW())',
        [id, id, 'activo']
      );
    } else if (tipo_persona === 'conductor') {
      await pool.query(
        'INSERT INTO turttcho (id, persona, estado, creacion) VALUES ($1, $2, $3, NOW())',
        [id, id, 'activo']
      );
    } 
  }
};

export const updateBancoPersona = async (persona_id, bancoData) => {
  const { banco_id, numero_cuenta, tipo_cuenta } = bancoData;
  
  // Verificar si ya existe un registro bancario para esta persona
  const existing = await pool.query(
    'SELECT id FROM turttbpc WHERE persona_id = $1',
    [persona_id]
  );

  if (existing.rows.length > 0) {
    // Actualizar registro existente
    const query = `
      UPDATE turttbpc 
      SET 
        banco_id = $1,
        numero_cuenta = $2,
        tipo_cuenta = $3
      WHERE persona_id = $4
    `;
    await pool.query(query, [banco_id, numero_cuenta, tipo_cuenta || 'corriente', persona_id]);
  } else {
    // Crear nuevo registro
    await createBancoPersona({ persona_id, banco_id, numero_cuenta, tipo_cuenta });
  }
};

export const updateHistorialMedico = async (persona_id, historialData) => {
  // Primero eliminamos el historial médico existente para esta persona
  await pool.query('DELETE FROM turtthmd WHERE persona_id = $1', [persona_id]);

  // Luego insertamos los nuevos registros
  for (const item of historialData) {
    await createHistorialMedico({
      persona_id,
      tipo: item.tipo,
      descripcion_alergia: item.descripcion
    });
  }
};

export const togglePersonaStatus = async (id) => {
  const query = `
    UPDATE turtmper 
    SET estado = CASE WHEN estado = 'activo' THEN 'inactivo' ELSE 'activo' END
    WHERE id = $1
    RETURNING estado
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0].estado;
};

export const getBancos = async () => {
  const { rows } = await pool.query('SELECT id, nombre FROM turtmbco ORDER BY nombre');
  return rows;
};

export const getTiposCondicionMedica = async () => {
  const { rows } = await pool.query('SELECT id, nombre FROM turtmtnm ORDER BY nombre');
  return rows;
};