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
        question: '¿Cuál es el singular de "gatos"?',
        options: ['gato', 'gata', 'gatos', 'gatitos'],
        answer: 'gato',
      },
      {
        type: 'mc',
        question: 'La palabra "mesa" es un:',
        options: ['verbo', 'sustantivo', 'adjetivo', 'pronombre'],
        answer: 'sustantivo',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: '¿Cuál es la forma correcta? Yo ____ a la escuela todos los días.',
        options: ['voy', 'vas', 'va', 'vamos'],
        answer: 'voy',
      },
      {
        type: 'mc',
        question: 'El antónimo de "pequeño" es:',
        options: ['minúsculo', 'grande', 'diminuto', 'chiquito'],
        answer: 'grande',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'Si no ____ estudiado, habría aprobado el examen.',
        options: ['hubiese', 'hubiera', 'he', 'haya'],
        answer: 'hubiera',
      },
      {
        type: 'matching',
        question: 'Empareja las palabras con sus definiciones:',
        pairs: [
          { left: 'Diligente', right: 'Cuidadoso y atento' },
          { left: 'Vívido', right: 'Lleno de vida y color' },
          { left: 'Efímero', right: 'Pasajero o de corta duración' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'El subjuntivo se usa para expresar:',
        options: ['certeza', 'duda o deseo', 'hechos', 'pasado'],
        answer: 'duda o deseo',
      },
      {
        type: 'matching',
        question: 'Empareja conceptos literarios:',
        pairs: [
          { left: 'Metáfora', right: 'Comparación imaginativa entre dos cosas' },
          { left: 'Ironía', right: 'Expresar lo contrario de lo que se piensa' },
          { left: 'Paradoja', right: 'Afirmación que parece contradictoria' },
        ],
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'La distinción entre "por" y "para" es fundamentalmente:',
        options: ['dialectal', 'arcaica', 'de causa vs. finalidad', 'regional'],
        answer: 'de causa vs. finalidad',
      },
      {
        type: 'matching',
        question: 'Relaciona movimientos literarios con características:',
        pairs: [
          { left: 'Generación del 98', right: 'Crisis de identidad nacional española' },
          { left: 'Realismo mágico', right: 'Lo fantástico dentro de lo ordinario' },
          { left: 'Ultraísmo', right: 'Rechazo de la lógica y la métrica tradicional' },
        ],
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'El concepto de "diglosia" en lingüística refiere a:',
        options: [
          'La coexistencia de dos variantes de una lengua con funciones diferenciadas',
          'La pérdida gradual de una lengua',
          'La evolución fonética',
          'La mezcla de alfabetos',
        ],
        answer: 'La coexistencia de dos variantes de una lengua con funciones diferenciadas',
      },
      {
        type: 'matching',
        question: 'Empareja autores con obras representativas:',
        pairs: [
          { left: 'Jorge Luis Borges', right: 'Ficciones' },
          { left: 'Octavio Paz', right: 'El laberinto de la soledad' },
          { left: 'Elena Garro', right: 'Los recuerdos del porvenir' },
        ],
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
        question: 'El pretérito perfecto de "escribir" es:',
        options: ['escribía', 'escribiré', 'he escrito', 'escribo'],
        answer: 'he escrito',
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'Para expresar un deseo, uso:',
        options: ['indicativo', 'condicional', 'subjuntivo', 'imperativo'],
        answer: 'subjuntivo',
      },
      {
        type: 'matching',
        question: 'Empareja conectores con usos:',
        pairs: [
          { left: 'Aunque', right: 'Expresa una dificultad' },
          { left: 'Por lo tanto', right: 'Introduce una conclusión' },
          { left: 'Sin embargo', right: 'Señala una contrariedad' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'La coherencia textual se logra mediante:',
        options: [
          'Letras mayúsculas',
          'Relaciones lógicas entre ideas y oraciones',
          'Palabras largas',
          'Párrafos cortos',
        ],
        answer: 'Relaciones lógicas entre ideas y oraciones',
      },
      {
        type: 'matching',
        question: 'Tipos de párrafos según estructura:',
        pairs: [
          { left: 'Deductivo', right: 'Idea principal → detalles de apoyo' },
          { left: 'Inductivo', right: 'Detalles → conclusión general' },
          { left: 'Analítico', right: 'Tema → análisis de componentes' },
        ],
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'El registro formal se distingue por:',
        options: [
          'Uso de diminutivos',
          'Léxico especializado y estructuras complejas',
          'Palabras informales',
          'Oraciones muy cortas',
        ],
        answer: 'Léxico especializado y estructuras complejas',
      },
      {
        type: 'matching',
        question: 'Técnicas retóricas avanzadas:',
        pairs: [
          { left: 'Alusión', right: 'Referencia implícita a otro texto' },
          { left: 'Polisíndeton', right: 'Repetición de conjunciones' },
          { left: 'Zeugma', right: 'Una palabra con dos significados' },
        ],
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'La "preciosidad" en el lenguaje se caracteriza por:',
        options: [
          'Claridad extrema',
          'Busca de lo inusual y elaborado en la expresión',
          'Uso de regionalismos',
          'Frases monosilábicas',
        ],
        answer: 'Busca de lo inusual y elaborado en la expresión',
      },
      {
        type: 'matching',
        question: 'Empareja corrientes estilísticas con características:',
        pairs: [
          { left: 'Conceptismo', right: 'Juego de palabras e ingenio' },
          { left: 'Culteranismo', right: 'Sintaxis compleja y léxico erudito' },
          { left: 'Barroquismo', right: 'Ornamentación exuberante' },
        ],
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
        question: 'Escucha el tono y determina el sentimiento',
        audioText: 'Está bien',
        options: ['Tristeza', 'Conformidad o sarcasmo', 'Alegría', 'Confusión'],
        answer: 'Conformidad o sarcasmo',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha la expresión. ¿Qué transmite?',
        audioText: 'No me importa',
        options: ['Aceptación', 'Entusiasmo', 'Indiferencia', 'Desacuerdo'],
        answer: 'Indiferencia',
      },
    ],
    B2: [
      {
        type: 'listening-assessment',
        question: 'Escucha la pausa. ¿Qué indica?',
        audioText: 'Este... creo que no estoy de acuerdo',
        options: ['Prisa', 'Búsqueda de palabras', 'Fin de conversación', 'Desinterés'],
        answer: 'Búsqueda de palabras',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el contexto. ¿Qué registro se usa?',
        audioText: 'Buenos días, me gustaría solicitar información sobre sus servicios',
        options: ['Coloquial', 'Formal', 'Técnico', 'Infantil'],
        answer: 'Formal',
      },
    ],
    C1: [
      {
        type: 'listening-assessment',
        question: 'Escucha la ironía. ¿Cuál es el significado implícito?',
        audioText: 'Sí, claro, eso es una excelente idea',
        options: ['Acuerdo genuino', 'Rechazo con ironía', 'Confusión', 'Alegría'],
        answer: 'Rechazo con ironía',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el eufemismo. ¿Qué se comunica?',
        audioText: 'Su desempeño necesita mejorar',
        options: ['Felicitación', 'Crítica suave', 'Pregunta', 'Apoyo'],
        answer: 'Crítica suave',
      },
    ],
    C2: [
      {
        type: 'listening-assessment',
        question: 'Analiza el discurso. ¿Qué estructura observas?',
        audioText: 'Primero, considere los hechos históricos. Segundo, analice el contexto cultural. Finalmente, extraiga conclusiones.',
        options: ['Narrativa', 'Descriptiva', 'Argumentativa estructurada', 'Poética'],
        answer: 'Argumentativa estructurada',
      },
      {
        type: 'listening-assessment',
        question: 'Escucha el acento y dialecto. ¿De dónde proviene?',
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
        question: 'Presenta una introducción simple de ti mismo',
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
        question: 'Expresa tu opinión sobre un tema',
        prompt: 'Give your opinion on a topic (travel, music, education, etc.) with reasons',
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
        question: 'Argumenta a favor o en contra de una proposición',
        prompt: 'Present arguments for or against a proposal with nuanced explanations',
        maxDuration: 25,
      },
      {
        type: 'speaking-assessment',
        question: 'Resume un problema y propón soluciones',
        prompt: 'Summarize a problem and propose thoughtful solutions',
        maxDuration: 25,
      },
    ],
    C1: [
      {
        type: 'speaking-assessment',
        question: 'Entrega una presentación sobre un tema especializado',
        prompt: 'Present a topic in depth using sophisticated vocabulary and structures',
        maxDuration: 30,
      },
      {
        type: 'speaking-assessment',
        question: 'Analiza un concepto abstracto',
        prompt: 'Discuss an abstract concept (justice, identity, progress) with nuance',
        maxDuration: 30,
      },
    ],
    C2: [
      {
        type: 'speaking-assessment',
        question: 'Diserta sobre un tema complejo',
        prompt: 'Deliver a sophisticated discourse on a complex topic with multiple perspectives',
        maxDuration: 35,
      },
      {
        type: 'speaking-assessment',
        question: 'Responde a preguntas desafiantes',
        prompt: 'Address nuanced questions about language, culture, or philosophy',
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
