export interface ExerciseIntro {
  topic: string;
  icon: string;
  explanationEs: string;
  explanationEn: string;
  example?: string;
  exampleEn?: string;
  subtitles: Array<{ time: number; es: string; en: string }>;
}

export const exerciseIntros: Record<string, Record<string, ExerciseIntro>> = {
  'speaking-assessment': {
    A1: {
      topic: 'Presentación Personal',
      icon: '🎯',
      explanationEs: 'En este ejercicio, vas a aprender a presentarte en español. Esto es lo primero que haces cuando conoces a alguien nuevo. Empezamos con información básica: tu nombre, de dónde eres, y quizás qué haces. Es simple pero muy importante.',
      explanationEn: 'In this exercise, you will learn how to introduce yourself in Spanish. This is the first thing you do when you meet someone new. We start with basic information: your name, where you are from, and perhaps what you do. It\'s simple but very important.',
      example: 'Por ejemplo: "Me llamo Ana. Soy de México. Soy estudiante."',
      exampleEn: 'For example: "My name is Ana. I am from Mexico. I am a student."',
      subtitles: [
        { time: 0, es: 'Presentación Personal', en: 'Personal Introduction' },
        { time: 2, es: 'En este ejercicio, vas a aprender a presentarte en español.', en: 'In this exercise, you will learn how to introduce yourself in Spanish.' },
        { time: 6, es: 'Esto es lo primero que haces cuando conoces a alguien nuevo.', en: 'This is the first thing you do when you meet someone new.' },
        { time: 10, es: 'Empezamos con: nombre, origen, y profesión.', en: 'We start with: name, origin, and profession.' },
        { time: 14, es: 'Por ejemplo: "Me llamo Ana. Soy de México. Soy estudiante."', en: 'For example: "My name is Ana. I am from Mexico. I am a student."' },
      ],
    },
    A2: {
      topic: 'Describiendo tu Fin de Semana',
      icon: '📅',
      explanationEs: 'Ahora practicamos cómo hablar sobre eventos pasados. Usamos el pretérito para contar qué hicimos el fin de semana. Esto es conversación natural y cotidiana. Vamos a usar verbos simples como: fui, comí, vi, hablé.',
      explanationEn: 'Now we practice how to talk about past events. We use the preterite to tell what we did on the weekend. This is natural, everyday conversation. We\'ll use simple verbs like: fui, comí, vi, hablé.',
      example: 'Por ejemplo: "El sábado fui al parque. Comí con mis amigos. Fue un día muy bonito."',
      exampleEn: 'For example: "On Saturday I went to the park. I ate with my friends. It was a beautiful day."',
      subtitles: [
        { time: 0, es: 'Describiendo tu Fin de Semana', en: 'Describing Your Weekend' },
        { time: 2, es: 'Practicamos cómo hablar sobre eventos pasados.', en: 'We practice how to talk about past events.' },
        { time: 5, es: 'Usamos el pretérito para contar qué hicimos.', en: 'We use the preterite to tell what we did.' },
        { time: 8, es: 'Verbos importantes: fui, comí, vi, hablé.', en: 'Important verbs: fui, comí, vi, hablé.' },
        { time: 12, es: 'El sábado fui al parque. Comí con mis amigos. Fue un día bonito.', en: 'On Saturday I went to the park. I ate with my friends. It was beautiful.' },
      ],
    },
    B1: {
      topic: 'Expresando tu Opinión',
      icon: '💭',
      explanationEs: 'En nivel B1, expresamos opiniones completas sobre temas interesantes. No solo decimos qué pensamos, sino también explicamos por qué lo pensamos. Usamos frases como: "Creo que...", "En mi opinión...", "Porque..." para dar razones claras.',
      explanationEn: 'At B1 level, we express complete opinions about interesting topics. We don\'t just say what we think, but also explain why we think it. We use phrases like: "Creo que...", "En mi opinión...", "Porque..." to give clear reasons.',
      example: 'Por ejemplo: "Creo que viajar es importante porque aprendes sobre otras culturas y personas diferentes."',
      exampleEn: 'For example: "I think traveling is important because you learn about other cultures and different people."',
      subtitles: [
        { time: 0, es: 'Expresando tu Opinión', en: 'Expressing Your Opinion' },
        { time: 2, es: 'Expresamos opiniones completas sobre temas interesantes.', en: 'We express complete opinions about interesting topics.' },
        { time: 5, es: 'No solo qué pensamos, sino también por qué.', en: 'Not just what we think, but also why.' },
        { time: 8, es: 'Frases útiles: "Creo que...", "En mi opinión...", "Porque..."', en: 'Useful phrases: "Creo que...", "En mi opinión...", "Porque..."' },
        { time: 12, es: 'Creo que viajar es importante porque aprendes sobre otras culturas.', en: 'I think traveling is important because you learn about other cultures.' },
      ],
    },
  },
  'listening-assessment': {
    A1: {
      topic: 'Entendiendo Saludos Básicos',
      icon: '👋',
      explanationEs: 'Escuchamos diálogos simples en español. En nivel A1, nos enfocamos en frases de saludo y despedida. Estas son palabras que escucharás muy frecuentemente. Aprenderás a reconocer: Hola, buenos días, buenas noches, ¿cómo estás?, adiós.',
      explanationEn: 'We listen to simple dialogues in Spanish. At A1 level, we focus on greetings and farewells. These are words you will hear very frequently. You will learn to recognize: Hola, buenos días, buenas noches, ¿cómo estás?, adiós.',
      example: 'Ejemplo: Alguien dice "Hola, ¿cómo estás?" y debes reconocer que es un saludo.',
      exampleEn: 'Example: Someone says "Hola, ¿cómo estás?" and you must recognize it\'s a greeting.',
      subtitles: [
        { time: 0, es: 'Entendiendo Saludos Básicos', en: 'Understanding Basic Greetings' },
        { time: 2, es: 'Escuchamos diálogos simples en español.', en: 'We listen to simple dialogues in Spanish.' },
        { time: 4, es: 'Nos enfocamos en frases de saludo y despedida.', en: 'We focus on greetings and farewells.' },
        { time: 6, es: 'Palabras frecuentes: Hola, buenos días, ¿cómo estás?', en: 'Common words: Hola, buenos días, ¿cómo estás?' },
        { time: 10, es: 'Escucha atentamente y selecciona la respuesta correcta.', en: 'Listen carefully and select the correct answer.' },
      ],
    },
    A2: {
      topic: 'Información en Conversaciones Cotidianas',
      icon: '🎧',
      explanationEs: 'Ahora escuchamos conversaciones un poco más largas. El hablante da información importante: qué hace, dónde vive, sus actividades. Debes entender los detalles principales, aunque no entiendas cada palabra. Escucha palabras clave como: "trabajo", "vivo", "me gusta", "hago".',
      explanationEn: 'Now we listen to slightly longer conversations. The speaker gives important information: what they do, where they live, their activities. You must understand the main details, even if you don\'t understand every word. Listen for key words like: "trabajo", "vivo", "me gusta", "hago".',
      example: 'Si escuchas: "Yo trabajo en un hospital y me gusta ayudar a la gente", debes identificar que trabaja en medicina.',
      exampleEn: 'If you hear: "Yo trabajo en un hospital y me gusta ayudar a la gente", you should identify they work in medicine.',
      subtitles: [
        { time: 0, es: 'Información en Conversaciones', en: 'Information in Conversations' },
        { time: 2, es: 'Escuchamos conversaciones más largas.', en: 'We listen to longer conversations.' },
        { time: 4, es: 'El hablante da información importante.', en: 'The speaker gives important information.' },
        { time: 6, es: 'Entiende los detalles principales.', en: 'Understand the main details.' },
        { time: 8, es: 'Palabras clave: trabajo, vivo, me gusta, hago.', en: 'Key words: trabajo, vivo, me gusta, hago.' },
      ],
    },
    B1: {
      topic: 'Entendiendo Matices y Contexto',
      icon: '🎯',
      explanationEs: 'En B1, no solo entiendes palabras, sino también el contexto y los matices. Debes reconocer cuándo alguien está siendo sarcástico, formal o casual. El tono de voz importa. Escucha cambios de entonación que pueden cambiar el significado de la frase.',
      explanationEn: 'At B1, you understand not just words, but also context and nuance. You must recognize when someone is being sarcastic, formal, or casual. The tone of voice matters. Listen for changes in intonation that can change the meaning of the sentence.',
      example: 'Si alguien dice "Sí, claro" con tono sarcástico, significa que no está de acuerdo. El contexto es crucial.',
      exampleEn: 'If someone says "Sí, claro" with a sarcastic tone, it means they disagree. Context is crucial.',
      subtitles: [
        { time: 0, es: 'Entendiendo Matices y Contexto', en: 'Understanding Nuance and Context' },
        { time: 2, es: 'No solo palabras, sino también contexto.', en: 'Not just words, but also context.' },
        { time: 4, es: 'Reconoce sarcasmo, tono formal o casual.', en: 'Recognize sarcasm, formal or casual tone.' },
        { time: 6, es: 'La entonación puede cambiar el significado.', en: 'Intonation can change the meaning.' },
        { time: 8, es: '"Sí, claro" - con sarcasmo significa desacuerdo.', en: '"Sí, claro" - with sarcasm means disagreement.' },
      ],
    },
  },
};
