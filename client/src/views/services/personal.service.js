const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchPersonas = async () => {
  try {
    const response = await fetch(`${API_URL}/personal`);
    if (!response.ok) {
      throw new Error('Error al obtener el personal');
    }
    const data = await response.json();
    return data.map(persona => ({
      ...persona,
      historial_medico: persona.historial_medico || []
    }));
  } catch (error) {
    console.error('Error en fetchPersonas:', error);
    throw error;
  }
};

export const fetchPersonaById = async (id) => {
  try {
    // Validación exhaustiva del ID
    if (id === undefined || id === null) {
      throw new Error('ID no puede ser nulo o undefined');
    }
    
    const idString = String(id); // Conversión segura a string
    if (!idString || idString === 'undefined' || idString === 'null' || idString.includes('[object')) {
      throw new Error(`ID no válido: ${idString}`);
    }

    const response = await fetch(`${API_URL}/personal/${idString}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener persona con ID ${id}:`, error);
    throw new Error(`No se pudo cargar la persona: ${error.message}`);
  }
};
export const createPersona = async (personaData) => {
  try {
    // Validación básica en el frontend
    if (!personaData.primerNombre || !personaData.primerApellido || !personaData.numeroDocumento) {
      throw new Error('Datos básicos de la persona son requeridos');
    }

    // Preparar datos para la API
    const requestBody = {
      persona: {
        numero_documento: personaData.numeroDocumento,
        primer_nombre: personaData.primerNombre,
        segundo_nombre: personaData.segundoNombre || null,
        primer_apellido: personaData.primerApellido,
        segundo_apellido: personaData.segundoApellido || null,
        fecha_nacimiento: personaData.fechaNacimiento,
        telefono: personaData.telefono,
        direccion: personaData.direccion,
        tipo_persona: personaData.tipoPersona,
        nacionalidad: personaData.nacionalidad || 'Venezolana'
      }
    };

    // Solo incluir banco si se proporcionó
    if (personaData.banco && personaData.numeroCuentaBancaria) {
      requestBody.banco = {
        banco_id: personaData.banco.id,
        numero_cuenta: personaData.numeroCuentaBancaria,
        tipo_cuenta: personaData.tipoCuenta || 'corriente'
      };
    }

    // Solo incluir historial médico si existe
    if (personaData.historialMedico && personaData.historialMedico.length > 0) {
      requestBody.historialMedico = personaData.historialMedico.map(item => ({
        tipo: item.tipo,
        descripcion: item.descripcion
      }));
    }

    console.log('Enviando a la API:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_URL}/personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Extraer mensaje de error del backend si está disponible
      const errorMessage = responseData.message || 
                         responseData.error || 
                         'Error al crear la persona';
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Error en createPersona:', error);
    throw new Error(error.message || 'Error al comunicarse con el servidor');
  }
};


export const updatePersona = async (id, personaData) => {
  try {
    // Validación básica
    if (!id) throw new Error('ID de persona no proporcionado');
    
    // Preparar el cuerpo de la solicitud
    const requestBody = {
      persona: {
        numero_documento: personaData.numeroDocumento,
        primer_nombre: personaData.primerNombre,
        segundo_nombre: personaData.segundoNombre || null,
        primer_apellido: personaData.primerApellido,
        segundo_apellido: personaData.segundoApellido || null,
        fecha_nacimiento: personaData.fechaNacimiento,
        telefono: personaData.telefono,
        direccion: personaData.direccion,
        tipo_persona: personaData.tipoPersona,
        nacionalidad: personaData.nacionalidad || 'Venezolana',
        estado: personaData.estado || 'activo'
      }
    };

    // Agregar información bancaria si existe
    if (personaData.banco && personaData.numeroCuentaBancaria) {
      requestBody.banco = {
        banco_id: personaData.banco.id || personaData.banco,
        numero_cuenta: personaData.numeroCuentaBancaria,
        tipo_cuenta: personaData.tipoCuenta || 'corriente'
      };
    }

    // Agregar historial médico si existe
    if (personaData.historialMedico && personaData.historialMedico.length > 0) {
      requestBody.historial_medico = personaData.historialMedico.map(item => ({
        tipo: item.tipo,
        descripcion: item.descripcion
      }));
    }

    console.log('Enviando al servidor:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_URL}/personal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Error al actualizar la persona');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updatePersona:', error);
    throw error;
  }
};
export const togglePersonaStatus = async (id) => {
  try {
    const response = await fetch(`${API_URL}/personal/${id}/toggle-status`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cambiar el estado');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en togglePersonaStatus:', error);
    throw error;
  }
};

export const fetchBancos = async () => {
  try {
    const response = await fetch(`${API_URL}/bancos`);
    if (!response.ok) {
      throw new Error('Error al obtener los bancos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetchBancos:', error);
    throw error;
  }
};

export const fetchTiposCondicionMedica = async () => {
  try {
    const response = await fetch(`${API_URL}/tipos-condicion-medica`);
    if (!response.ok) {
      throw new Error('Error al obtener los tipos de condición médica');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetchTiposCondicionMedica:', error);
    throw error;
  }
};