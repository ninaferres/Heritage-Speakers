import { CefrLevel, SkillId, ExerciseQuestion } from './types';

interface AssessmentQuestion {
  question: string;
  type: 'mc' | 'matching' | 'speaking-assessment' | 'listening-assessment';
  options?: string[];
  answer?: string;
  pairs?: { left: string; right: string }[];
  prompt?: string;
  maxDuration?: number;
  audioText?: string;
}

const assessmentData: Record<SkillId, Record<CefrLevel, AssessmentQuestion[]>> = {
  Reading: {
    A1: [
      {
        type: 'mc',
        question: 'Un cartel en una tienda dice: "ABIERTO de nueve de la mañana a seis de la tarde". ¿A qué hora cierra la tienda?',
        options: ['A las nueve de la mañana', 'Al mediodía', 'A las seis de la tarde', 'A las seis de la mañana'],
        answer: 'A las seis de la tarde',
      },
      {
        type: 'mc',
        question: '"Ana compra pan en la panadería." ¿Dónde está Ana?',
        options: ['En el supermercado', 'En la panadería', 'En su casa', 'En el restaurante'],
        answer: 'En la panadería',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: 'Mensaje de un amigo: "Oye, ¿nos vemos a las cinco en el café de la esquina?". ¿Qué te está proponiendo?',
        options: ['Llamarte por teléfono', 'Quedar a las cinco en un café', 'Ir a tu casa', 'Cancelar un plan'],
        answer: 'Quedar a las cinco en un café',
      },
      {
        type: 'mc',
        question: 'Instrucciones de una receta: "Primero corta la cebolla, luego añádela a la sartén con aceite." ¿Qué se hace primero?',
        options: ['Añadir el aceite', 'Cortar la cebolla', 'Encender la sartén', 'Servir el plato'],
        answer: 'Cortar la cebolla',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'Anuncio de trabajo: "Se busca camarero con experiencia, turno de tarde, incorporación inmediata." ¿Qué NO dice el anuncio?',
        options: ['El horario es de tarde', 'Piden experiencia previa', 'El sueldo es muy alto', 'Puedes empezar pronto'],
        answer: 'El sueldo es muy alto',
      },
      {
        type: 'matching',
        question: 'Empareja cada conector con lo que expresa en una frase cotidiana:',
        pairs: [
          { left: 'Aunque', right: 'Introduce una dificultad o contraste' },
          { left: 'Por lo tanto', right: 'Introduce una conclusión' },
          { left: 'Sin embargo', right: 'Señala algo inesperado o contrario' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'Correo de tu casero: "Le escribo para informarle de que la revisión de la caldera tendrá lugar el próximo martes." ¿Qué tono tiene este mensaje?',
        options: ['Muy informal, como a un amigo', 'Formal y educado', 'Enfadado', 'Confuso'],
        answer: 'Formal y educado',
      },
      {
        type: 'mc',
        question: 'En un contrato de alquiler lees: "El inquilino se compromete a notificar cualquier desperfecto en un plazo de cuarenta y ocho horas." ¿Qué debe hacer el inquilino si algo se rompe?',
        options: ['Repararlo él mismo', 'Avisar en menos de dos días', 'Esperar al final del contrato', 'No hacer nada'],
        answer: 'Avisar en menos de dos días',
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'En un chat de trabajo, alguien escribe: "Qué bien, otra reunión más a última hora del viernes...". ¿Qué quiere decir realmente?',
        options: ['Está muy contento con la reunión', 'Está siendo sarcástico, le molesta', 'No tiene ninguna opinión', 'Pregunta la hora'],
        answer: 'Está siendo sarcástico, le molesta',
      },
      {
        type: 'mc',
        question: 'Comparando estos dos mensajes: "Necesito el informe ya" y "Cuando puedas, ¿me pasarías el informe? Gracias", ¿qué diferencia principal hay?',
        options: ['Piden cosas distintas', 'Uno es mucho más formal y cortés que el otro', 'Uno está en pasado', 'No hay ninguna diferencia'],
        answer: 'Uno es mucho más formal y cortés que el otro',
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'Un amigo te dice: "Al final tiró la toalla con el proyecto." ¿Qué significa esta expresión?',
        options: ['Terminó el proyecto con éxito', 'Abandonó, dejó de intentarlo', 'Empezó un proyecto nuevo', 'Ganó un premio'],
        answer: 'Abandonó, dejó de intentarlo',
      },
      {
        type: 'mc',
        question: 'Titular de opinión: "Otra vez la misma promesa de siempre, a ver si esta vez es verdad." ¿Qué actitud transmite el autor?',
        options: ['Confianza total', 'Escepticismo, duda que se cumpla', 'Indiferencia absoluta', 'Entusiasmo'],
        answer: 'Escepticismo, duda que se cumpla',
      },
    ],
  },
  Writing: {
    A1: [
      {
        type: 'mc',
        question: '¿Cómo se escribe correctamente? "Ella ____ muy inteligente."',
        options: ['es', 'está', 'somos', 'soy'],
        answer: 'es',
      },
      {
        type: 'mc',
        question: 'Completa: "Yo ____ un libro en la biblioteca."',
        options: ['compro', 'busco', 'encontré', 'leo'],
        answer: 'leo',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: '¿Cuál es el orden correcto? (1) tengo (2) yo (3) hermanos (4) dos',
        options: ['2-1-4-3', '2-4-1-3', '1-2-3-4', '3-4-2-1'],
        answer: '2-4-1-3',
      },
      {
        type: 'mc',
        question: 'Estás escribiendo un mensaje sobre algo que ya terminaste: "Ya ____ la tarea." ¿Qué usas?',
        options: ['escribía', 'escribiré', 'he escrito', 'escribo'],
        answer: 'he escrito',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'Quieres escribir "Espero que ____ bien el examen" a un amigo antes de su prueba. ¿Qué forma usas?',
        options: ['apruebas', 'apruebes', 'aprobarás', 'aprobar'],
        answer: 'apruebes',
      },
      {
        type: 'matching',
        question: 'Empareja cada conector con su uso al escribir:',
        pairs: [
          { left: 'Aunque', right: 'Para introducir una dificultad' },
          { left: 'Por lo tanto', right: 'Para introducir una conclusión' },
          { left: 'Sin embargo', right: 'Para señalar una contrariedad' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'Vas a escribir un correo formal para pedir información a una empresa. ¿Cuál es el saludo más apropiado?',
        options: ['¡Qué pasa!', 'Estimados señores:', 'Hola k tal', 'Oye, una cosa'],
        answer: 'Estimados señores:',
      },
      {
        type: 'mc',
        question: 'Estás redactando una queja formal por un servicio defectuoso. ¿Qué frase es la más apropiada para el cierre del correo?',
        options: ['Nos vemos, chao', 'Quedo a la espera de su respuesta. Atentamente,', 'Ya me dirás algo', 'Bueno, eso es todo'],
        answer: 'Quedo a la espera de su respuesta. Atentamente,',
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'Le escribes a un compañero de trabajo por un malentendido. ¿Cuál de estas frases suena más profesional y a la vez cordial?',
        options: [
          '"Creo que ha habido un malentendido, ¿podríamos aclararlo cuando tengas un momento?"',
          '"Esto no es lo que dijiste."',
          '"Da igual, ya lo arreglo yo."',
          '"???"',
        ],
        answer: '"Creo que ha habido un malentendido, ¿podríamos aclararlo cuando tengas un momento?"',
      },
      {
        type: 'mc',
        question: 'Estás reescribiendo un mensaje muy informal ("oye macho pásame el documento ya") para enviarlo a tu jefe. ¿Cuál es la mejor versión?',
        options: [
          '"¿Podrías enviarme el documento cuando puedas? Gracias."',
          '"Pásame el documento."',
          '"Oye macho pásame el documento ya, jefe."',
          '"Documento ya, porfa."',
        ],
        answer: '"¿Podrías enviarme el documento cuando puedas? Gracias."',
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'Quieres pedir un favor grande a un amigo cercano sin sonar exigente. ¿Cuál de estas opciones suena más natural en español?',
        options: [
          '"Exijo que me ayudes con esto."',
          '"¿Te importaría echarme una mano con esto? Te lo agradecería mucho."',
          '"Ayúdame."',
          '"Es tu obligación ayudarme."',
        ],
        answer: '"¿Te importaría echarme una mano con esto? Te lo agradecería mucho."',
      },
      {
        type: 'mc',
        question: 'Estás escribiendo una reseña negativa pero educada de un restaurante. ¿Qué frase suena más natural para un hablante nativo?',
        options: [
          '"La comida fue mala y el servicio pésimo, no vuelvo."',
          '"Aunque el ambiente era agradable, la comida no estuvo a la altura y el servicio podría mejorar."',
          '"Todo mal."',
          '"No recomiendo para nada este sitio, es horrible."',
        ],
        answer: '"Aunque el ambiente era agradable, la comida no estuvo a la altura y el servicio podría mejorar."',
      },
    ],
  },
  Listening: {
    A1: [
      {
        type: 'listening-assessment',
        question: 'Escucha el saludo. ¿Qué respuesta es apropiada?',
        audioText: 'Hola, ¿cómo estás?',
        options: ['Adiós', 'Bien, gracias, ¿y tú?', 'Me llamo Juan', '¿Dónde está?'],
        answer: 'Bien, gracias, ¿y tú?',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el día que dice. ¿Cuál es?',
        audioText: 'Hoy es lunes',
        options: ['Martes', 'Lunes', 'Domingo', 'Miércoles'],
        answer: 'Lunes',
      },
    ],
    A2: [
      {
        type: 'listening-assessment',
        question: 'Escucha la pregunta. ¿Qué se pregunta?',
        audioText: '¿Qué tal tu fin de semana?',
        options: ['Cómo estuvo tu fin de semana', 'Dónde vives', 'Tu nombre', 'Tu edad'],
        answer: 'Cómo estuvo tu fin de semana',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha y elige el objeto descrito',
        audioText: 'Es un líquido transparente que bebemos',
        options: ['Café', 'Agua', 'Leche', 'Vino'],
        answer: 'Agua',
      },
    ],
    B1: [
      {
        type: 'listening-assessment',
        question: 'Escucha cómo lo dice. ¿Cómo se siente la persona en realidad?',
        audioText: 'Está bien...',
        options: ['Muy triste', 'Conforme, aunque no del todo convencida', 'Muy alegre', 'Confundida'],
        answer: 'Conforme, aunque no del todo convencida',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha la frase. ¿Qué transmite la persona?',
        audioText: 'No me importa',
        options: ['Le importa mucho', 'Está muy contenta', 'Le da igual', 'No entiende'],
        answer: 'Le da igual',
      },
    ],
    B2: [
      {
        type: 'listening-assessment',
        question: 'Escucha la pausa. ¿Qué está haciendo la persona?',
        audioText: 'Este... creo que no estoy de acuerdo',
        options: ['Tiene prisa', 'Está buscando las palabras adecuadas', 'Ha terminado de hablar', 'No le interesa el tema'],
        answer: 'Está buscando las palabras adecuadas',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el mensaje. ¿En qué situación se diría esto?',
        audioText: 'Buenos días, me gustaría solicitar información sobre sus servicios',
        options: ['Hablando con un amigo', 'Llamando a una empresa', 'En una fiesta', 'Con un niño pequeño'],
        answer: 'Llamando a una empresa',
      },
    ],
    C1: [
      {
        type: 'listening-assessment',
        question: 'Un jefe le dice esto a un empleado. ¿Qué le está diciendo en realidad?',
        audioText: 'Su desempeño necesita mejorar',
        options: ['Le está felicitando', 'Le está criticando, pero con suavidad', 'Le está haciendo una pregunta', 'Le está dando el día libre'],
        answer: 'Le está criticando, pero con suavidad',
      },
      {
        type: 'listening-assessment',
        question: 'Un cliente llama al banco. ¿Cuántos días tiene para reclamar el cobro?',
        audioText: 'Para reclamar ese cobro, dispone usted de catorce días desde la fecha del cargo.',
        options: ['Siete días', 'Catorce días', 'Treinta días', 'Un día'],
        answer: 'Catorce días',
      },
    ],
    C2: [
      {
        type: 'listening-assessment',
        question: 'Escucha esta queja en un servicio de atención al cliente. ¿Qué tono usa la persona, a pesar de estar molesta?',
        audioText: 'Entiendo que tienen mucho trabajo, pero esta ya es la tercera vez que llamo por este mismo asunto, y me gustaría que por fin se resolviera.',
        options: ['Muy grosero', 'Educado pero firme', 'Totalmente indiferente', 'Alegre'],
        answer: 'Educado pero firme',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el acento. ¿De qué país es probablemente esta persona?',
        audioText: 'Gracias por la ayuda, vos sos muy amable',
        options: ['España', 'México', 'Argentina', 'Colombia'],
        answer: 'Argentina',
      },
    ],
  },
  Speaking: {
    A1: [
      {
        type: 'speaking-assessment',
        question: 'Preséntate brevemente',
        prompt: 'Introduce yourself with your name and one thing about you (e.g., "Me llamo... Soy...")',
        maxDuration: 10,
      },
      {
        type: 'speaking-assessment',
        question: 'Responde: ¿Cómo te llamas?',
        prompt: 'Answer the question with your name in Spanish',
        maxDuration: 5,
      },
    ],
    A2: [
      {
        type: 'speaking-assessment',
        question: 'Describe tu fin de semana',
        prompt: 'Describe what you did this weekend (3-4 sentences)',
        maxDuration: 15,
      },
      {
        type: 'speaking-assessment',
        question: 'Habla sobre tu comida favorita',
        prompt: 'Talk about your favorite food and why you like it',
        maxDuration: 10,
      },
    ],
    B1: [
      {
        type: 'speaking-assessment',
        question: 'Da tu opinión sobre un tema cotidiano',
        prompt: 'Give your opinion on an everyday topic (your job, a hobby, your city) with reasons',
        maxDuration: 20,
      },
      {
        type: 'speaking-assessment',
        question: 'Cuéntame una anécdota personal',
        prompt: 'Tell a brief personal story or anecdote in the past tense',
        maxDuration: 20,
      },
    ],
    B2: [
      {
        type: 'speaking-assessment',
        question: 'Convence a alguien de algo con argumentos',
        prompt: 'Try to convince someone of a practical proposal (a plan, a purchase, a change at work) with clear reasons',
        maxDuration: 25,
      },
      {
        type: 'speaking-assessment',
        question: 'Explica un problema cotidiano y propón soluciones',
        prompt: 'Explain an everyday problem (at work, at home, with a service) and propose practical solutions',
        maxDuration: 25,
      },
    ],
    C1: [
      {
        type: 'speaking-assessment',
        question: 'Da una presentación breve sobre tu trabajo o área de estudio',
        prompt: 'Give a short professional presentation about your job or field, as if speaking to new colleagues',
        maxDuration: 30,
      },
      {
        type: 'speaking-assessment',
        question: 'Explica y resuelve un malentendido',
        prompt: 'Explain a misunderstanding with a coworker or friend and how you would resolve it, being diplomatic',
        maxDuration: 30,
      },
    ],
    C2: [
      {
        type: 'speaking-assessment',
        question: 'Participa en un debate sobre un tema de actualidad',
        prompt: 'Defend your position on a current everyday topic (work-life balance, a local issue, a piece of news) with fluent, natural Spanish',
        maxDuration: 35,
      },
      {
        type: 'speaking-assessment',
        question: 'Responde con naturalidad a una pregunta inesperada de entrevista de trabajo',
        prompt: 'Respond naturally, as a native speaker would, to an unexpected job interview question',
        maxDuration: 35,
      },
    ],
  },
};

export function getAssessmentQuestions(skill: SkillId, level: CefrLevel): ExerciseQuestion[] {
  const questions = assessmentData[skill]?.[level] || [];
  return questions.map((q) => ({
    ...q,
    type: q.type as 'mc' | 'matching' | 'speaking-assessment' | 'listening-assessment',
  } as ExerciseQuestion));
}
