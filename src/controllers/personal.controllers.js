import {
  createPersona,
  createBancoPersona,
  createHistorialMedico,
  getPersonas,
  getPersonaById,
  updatePersona,
  updateBancoPersona,
  updateHistorialMedico,
  togglePersonaStatus,
  getBancos,
  getTiposCondicionMedica
} from '../models/persona.models.js';

export const createPersonal = async (req, res) => {
  try {
    const { persona, banco, historialMedico } = req.body;

    // Crear persona
    const personaId = await createPersona(persona);

    // Crear información bancaria si se proporcionó
    if (banco) {
      await createBancoPersona({
        persona_id: personaId,
        banco_id: banco.banco_id,
        numero_cuenta: banco.numero_cuenta,
        tipo_cuenta: banco.tipo_cuenta
      });
    }

    // Crear historial médico si se proporcionó
    if (historialMedico && historialMedico.length > 0) {
      for (const item of historialMedico) {
        await createHistorialMedico({
          persona_id: personaId,
          tipo: item.tipo,
          descripcion_alergia: item.descripcion
        });
      }
    }

    res.status(201).json({
      message: 'Personal creado exitosamente',
      id: personaId
    });
  } catch (error) {
    console.error('Error al crear personal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPersonal = async (req, res) => {
  try {
    const personas = await getPersonas();
    res.json(personas);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPersonalById = async (req, res) => {
  try {
    const { id } = req.params;
    const persona = await getPersonaById(id);

    if (!persona) {
      return res.status(404).json({ error: 'Personal no encontrado' });
    }

    res.json(persona);
  } catch (error) {
    console.error('Error al obtener personal por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updatePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const { persona, banco, historialMedico } = req.body;

    // Actualizar persona
    await updatePersona(id, persona);

    // Actualizar información bancaria
    if (banco) {
      await updateBancoPersona(id, banco);
    }

    // Actualizar historial médico
    if (historialMedico) {
      await updateHistorialMedico(id, historialMedico);
    }

    res.json({ message: 'Personal actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar personal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const newStatus = await togglePersonaStatus(id);
    
    res.json({ 
      message: `Estado del personal actualizado a ${newStatus}`,
      estado: newStatus
    });
  } catch (error) {
    console.error('Error al cambiar estado del personal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getBancosList = async (req, res) => {
  try {
    const bancos = await getBancos();
    res.json(bancos);
  } catch (error) {
    console.error('Error al obtener lista de bancos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTiposCondicionMedicaList = async (req, res) => {
  try {
    const tipos = await getTiposCondicionMedica();
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de condición médica:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};