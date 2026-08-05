import { CefrLevel, SkillId, ExerciseQuestion } from './types';

interface AssessmentQuestion {
  question: string;
  type: 'mc' | 'matching';
  options?: string[];
  answer?: string;
  pairs?: { left: string; right: string }[];
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
        type: 'mc',
        question: 'Cuando alguien dice "Hola, ¿cómo estás?", la intención es:',
        options: ['Despedirse', 'Saludar y preguntar por el estado', 'Hacer una pregunta', 'Expresar desacuerdo'],
        answer: 'Saludar y preguntar por el estado',
      },
      {
        type: 'mc',
        question: 'Si escuchas "Es lunes", ¿qué información recibes?',
        options: ['La hora', 'El día de la semana', 'El mes', 'La estación'],
        answer: 'El día de la semana',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: 'En una conversación casual, "¿Qué tal tu fin de semana?" busca:',
        options: ['Una crítica', 'Una anécdota o descripción', 'Un dato', 'Un consejo'],
        answer: 'Una anécdota o descripción',
      },
      {
        type: 'matching',
        question: 'Empareja sonidos/palabras con significados:',
        pairs: [
          { left: 'Agua', right: 'Líquido para beber' },
          { left: 'Puerta', right: 'Acceso a una habitación' },
          { left: 'Reloj', right: 'Instrumento para medir el tiempo' },
        ],
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'El tono de voz en "Está bien" puede indicar:',
        options: [
          'Claramente lo mismo siempre',
          'Conformidad o sarcasmo, según el contexto',
          'Siempre alegría',
          'Siempre tristeza',
        ],
        answer: 'Conformidad o sarcasmo, según el contexto',
      },
      {
        type: 'matching',
        question: 'Empareja expresiones con sentimientos implícitos:',
        pairs: [
          { left: '"No me importa"', right: 'Indiferencia' },
          { left: '"Claro que sí"', right: 'Aceptación enfática' },
          { left: '"Pues..."', right: 'Hesitación o duda' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'Cuando un hablante pausa y dice "este...", usualmente indica:',
        options: ['Fin de la conversación', 'Búsqueda de palabras o reflexión', 'Acuerdo total', 'Prisa'],
        answer: 'Búsqueda de palabras o reflexión',
      },
      {
        type: 'matching',
        question: 'Registro de lenguaje según contexto:',
        pairs: [
          { left: 'Formal', right: 'Entrevista de trabajo' },
          { left: 'Coloquial', right: 'Conversación entre amigos' },
          { left: 'Técnico', right: 'Explicación médica' },
        ],
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'Las implicaturas conversacionales se refieren a:',
        options: [
          'Lo que se dice literalmente',
          'Lo que se sugiere sin decirlo explícitamente',
          'Solo los errores de pronunciación',
          'El volumen de la voz',
        ],
        answer: 'Lo que se sugiere sin decirlo explícitamente',
      },
      {
        type: 'matching',
        question: 'Matices de significado en contextos:',
        pairs: [
          { left: 'Ironía', right: 'Decir algo significando lo opuesto' },
          { left: 'Eufemismo', right: 'Expresión suave de algo desagradable' },
          { left: 'Hipérbole', right: 'Exageración para enfatizar' },
        ],
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'El análisis discursivo implica comprender:',
        options: [
          'Solo palabras individuales',
          'Estructura, intención y contexto sociolingüístico del mensaje',
          'Únicamente la gramática',
          'Pronósticos',
        ],
        answer: 'Estructura, intención y contexto sociolingüístico del mensaje',
      },
      {
        type: 'matching',
        question: 'Empareja dialectos/acentos con características:',
        pairs: [
          { left: 'Español de Castilla', right: 'Distinción entre "z" y "c"' },
          { left: 'Español de América', right: 'Seseo' },
          { left: 'Español de Andalucía', right: 'Relajación de consonantes' },
        ],
      },
    ],
  },
  Speaking: {
    A1: [
      {
        type: 'mc',
        question: 'Para introducirte, ¿qué dices primero?',
        options: ['Mi opinión política', 'Mi nombre', 'Mi salario', 'Mis secretos'],
        answer: 'Mi nombre',
      },
      {
        type: 'mc',
        question: 'Si no entiendes algo, debes:',
        options: ['Guardar silencio', 'Pedir que repita o hable más lentamente', 'Marcharte', 'Fingir entender'],
        answer: 'Pedir que repita o hable más lentamente',
      },
    ],
    A2: [
      {
        type: 'mc',
        question: 'En una conversación, la entonación es importante porque:',
        options: [
          'No tiene importancia',
          'Comunica emociones y clarifica significado',
          'Solo sirve para la música',
          'Complica todo',
        ],
        answer: 'Comunica emociones y clarifica significado',
      },
      {
        type: 'matching',
        question: 'Empareja funciones comunicativas con ejemplos:',
        pairs: [
          { left: 'Pedir información', right: '¿Dónde está la estación?' },
          { left: 'Hacer un pedido', right: 'Quisiera un café, por favor' },
          { left: 'Expresar un sentimiento', right: 'Estoy muy feliz hoy' },
        ],
      },
    ],
    B1: [
      {
        type: 'mc',
        question: 'La fluidez en el habla significa:',
        options: [
          'Hablar muy rápido',
          'Hablar con ritmo natural y pocos titubeos',
          'Hablar sin parar',
          'No pensar antes de hablar',
        ],
        answer: 'Hablar con ritmo natural y pocos titubeos',
      },
      {
        type: 'matching',
        question: 'Estrategias para mantener una conversación:',
        pairs: [
          { left: 'Parafrasear', right: 'Reformular lo que otro dijo' },
          { left: 'Verificar comprensión', right: 'Preguntar "¿Entiendes?"' },
          { left: 'Cambiar tema', right: 'Introducir un nuevo tópico' },
        ],
      },
    ],
    B2: [
      {
        type: 'mc',
        question: 'El registro de habla se adapta según:',
        options: [
          'Nunca cambia',
          'La audiencia, contexto y propósito',
          'Solo el clima',
          'El día de la semana',
        ],
        answer: 'La audiencia, contexto y propósito',
      },
      {
        type: 'matching',
        question: 'Tipos de narrativa oral:',
        pairs: [
          { left: 'Anécdota', right: 'Historia breve y personal' },
          { left: 'Presentación', right: 'Información formal estructurada' },
          { left: 'Debate', right: 'Intercambio de argumentos' },
        ],
      },
    ],
    C1: [
      {
        type: 'mc',
        question: 'La elocuencia se caracteriza por:',
        options: [
          'Hablar rápido',
          'Expresión persuasiva y elegante',
          'Hablar mucho',
          'No pensar',
        ],
        answer: 'Expresión persuasiva y elegante',
      },
      {
        type: 'matching',
        question: 'Técnicas de persuasión retórica:',
        pairs: [
          { left: 'Ethos', right: 'Credibilidad del orador' },
          { left: 'Pathos', right: 'Apelación a emociones' },
          { left: 'Logos', right: 'Argumentación lógica' },
        ],
      },
    ],
    C2: [
      {
        type: 'mc',
        question: 'El análisis pragmático del discurso considera:',
        options: [
          'Solo la pronunciación',
          'Intención, contexto y efecto en la audiencia',
          'Solo la gramática',
          'Solo el vocabulario',
        ],
        answer: 'Intención, contexto y efecto en la audiencia',
      },
      {
        type: 'matching',
        question: 'Empareja actos de habla con funciones:',
        pairs: [
          { left: 'Promesa', right: 'Compromiso futuro' },
          { left: 'Ruego', right: 'Petición subordinada' },
          { left: 'Amenaza', right: 'Advertencia de consecuencia' },
        ],
      },
    ],
  },
};

export function getAssessmentQuestions(skill: SkillId, level: CefrLevel): ExerciseQuestion[] {
  const questions = assessmentData[skill]?.[level] || [];
  return questions.map((q) => ({
    ...q,
    type: q.type as 'mc' | 'matching',
  } as ExerciseQuestion));
}
