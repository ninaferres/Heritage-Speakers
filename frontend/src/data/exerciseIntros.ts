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
    B2: {
      topic: 'Narrativa y Debate Oral',
      icon: '🎤',
      explanationEs: 'En B2, contamos historias complejas y participamos en debates. Usamos tiempos pasados variados: pretérito, imperfecto, pluscuamperfecto. Construimos argumentos con introducciones, desarrollos y conclusiones. Usamos conectores como: además, sin embargo, por otro lado, en conclusión.',
      explanationEn: 'At B2, we tell complex stories and participate in debates. We use varied past tenses: preterite, imperfect, pluperfect. We build arguments with introductions, developments, and conclusions. We use connectors like: además, sin embargo, por otro lado, en conclusión.',
      example: 'Por ejemplo: "Había una vez un hombre que viajaba a España. Pasó tres meses allí. Sin embargo, lo que más le gustó fue la gente. En conclusión, regresó cada año."',
      exampleEn: 'For example: "Once there was a man who traveled to Spain. He spent three months there. However, what he liked most was the people. In conclusion, he returned every year."',
      subtitles: [
        { time: 0, es: 'Narrativa y Debate Oral', en: 'Narrative and Oral Debate' },
        { time: 2, es: 'Contamos historias complejas y participamos en debates.', en: 'We tell complex stories and participate in debates.' },
        { time: 5, es: 'Usamos tiempos pasados: pretérito, imperfecto, pluscuamperfecto.', en: 'We use past tenses: preterite, imperfect, pluperfect.' },
        { time: 9, es: 'Conectores: además, sin embargo, por otro lado, en conclusión.', en: 'Connectors: además, sin embargo, por otro lado, en conclusión.' },
      ],
    },
    C1: {
      topic: 'Discurso Persuasivo y Sofisticado',
      icon: '🎯',
      explanationEs: 'En C1, hablamos con elegancia y sofisticación. Podemos persuadir, argumentar críticamente y analizar temas profundos. Usamos vocabulario avanzado, estructuras gramaticales complejas y técnicas retóricas. Nuestro lenguaje es preciso, matizado y culturalmente apropiado.',
      explanationEn: 'At C1, we speak with elegance and sophistication. We can persuade, argue critically, and analyze deep topics. We use advanced vocabulary, complex grammatical structures, and rhetorical techniques. Our language is precise, nuanced, and culturally appropriate.',
      example: 'Por ejemplo: "Aunque es innegable que la tecnología ha revolucionado nuestras vidas, cabría argumentar que simultáneamente ha erosionado ciertos vínculos humanos fundamentales."',
      exampleEn: 'For example: "Although it is undeniable that technology has revolutionized our lives, one could argue that it has simultaneously eroded certain fundamental human connections."',
      subtitles: [
        { time: 0, es: 'Discurso Persuasivo y Sofisticado', en: 'Persuasive and Sophisticated Discourse' },
        { time: 2, es: 'Hablamos con elegancia y sofisticación.', en: 'We speak with elegance and sophistication.' },
        { time: 4, es: 'Persuadimos, argumentamos críticamente, analizamos.', en: 'We persuade, argue critically, analyze.' },
        { time: 6, es: 'Vocabulario avanzado y estructuras complejas.', en: 'Advanced vocabulary and complex structures.' },
      ],
    },
    C2: {
      topic: 'Maestría Lingüística y Expresión Artística',
      icon: '✨',
      explanationEs: 'En C2, dominamos el español con maestría casi nativa. Podemos expresar matices sutiles, jugar con la lengua de formas creativas y apropiadas. Comprendemos y usamos referencias culturales, ironía sofisticada y ambigüedad intencional. Nuestro discurso es fluido, espontáneo y altamente persuasivo.',
      explanationEn: 'At C2, we master Spanish with near-native proficiency. We can express subtle nuances, play with language in creative and appropriate ways. We understand and use cultural references, sophisticated irony, and intentional ambiguity. Our discourse is fluid, spontaneous, and highly persuasive.',
      example: 'Por ejemplo: "La vida no es sino una sucesión de momentos efímeros que buscamos, inútilmente acaso, tejer en un tapiz de significado."',
      exampleEn: 'For example: "Life is nothing but a succession of fleeting moments that we seek, perhaps in vain, to weave into a tapestry of meaning."',
      subtitles: [
        { time: 0, es: 'Maestría Lingüística y Expresión Artística', en: 'Linguistic Mastery and Artistic Expression' },
        { time: 2, es: 'Dominamos el español con maestría casi nativa.', en: 'We master Spanish with near-native proficiency.' },
        { time: 4, es: 'Expresamos matices sutiles de forma creativa.', en: 'We express subtle nuances creatively.' },
        { time: 6, es: 'Referencias culturales, ironía sofisticada, ambigüedad intencional.', en: 'Cultural references, sophisticated irony, intentional ambiguity.' },
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
    B2: {
      topic: 'Comprensión de Discursos Extensos',
      icon: '🎧',
      explanationEs: 'En B2, escuchas discursos largos, presentaciones y debates. Necesitas entender no solo palabras clave, sino también la estructura del argumento. Identifica el propósito del hablante, sus argumentos principales, y cómo llega a sus conclusiones. Reconoce la actitud y el registro del orador.',
      explanationEn: 'At B2, you listen to lengthy speeches, presentations, and debates. You need to understand not just key words, but also the structure of the argument. Identify the speaker\'s purpose, main arguments, and how they reach conclusions. Recognize the speaker\'s attitude and register.',
      example: 'Escuchas un debate sobre educación. Debes identificar los argumentos a favor y en contra, quién habla formalmente y cuál es la conclusión.',
      exampleEn: 'You hear a debate about education. You must identify arguments for and against, who speaks formally, and what the conclusion is.',
      subtitles: [
        { time: 0, es: 'Comprensión de Discursos Extensos', en: 'Understanding Extended Speeches' },
        { time: 2, es: 'Escuchas discursos largos y presentaciones.', en: 'You listen to lengthy speeches and presentations.' },
        { time: 4, es: 'Identifica estructura, argumentos y conclusiones.', en: 'Identify structure, arguments, and conclusions.' },
        { time: 6, es: 'Reconoce actitud y registro del orador.', en: 'Recognize speaker\'s attitude and register.' },
      ],
    },
    C1: {
      topic: 'Análisis Crítico de Discurso Complejo',
      icon: '🧠',
      explanationEs: 'En C1, analizas discursos complejos, películas, documentales y conferencias. Comprendes suposiciones implícitas, ironía sofisticada y referencias culturales. Puedes seguir argumentos intrincados, diferenciar hechos de opiniones, y comprender la intención subyacente del hablante.',
      explanationEn: 'At C1, you analyze complex speeches, films, documentaries, and lectures. You understand implicit assumptions, sophisticated irony, and cultural references. You can follow intricate arguments, differentiate facts from opinions, and understand the speaker\'s underlying intention.',
      example: 'Escuchas un monólogo sobre política donde hay varias capas de significado. Debes identificar lo literal, lo implícito y la crítica social subyacente.',
      exampleEn: 'You hear a monologue about politics with multiple layers of meaning. You must identify the literal, implicit, and underlying social criticism.',
      subtitles: [
        { time: 0, es: 'Análisis Crítico de Discurso Complejo', en: 'Critical Analysis of Complex Discourse' },
        { time: 2, es: 'Analizas discursos complejos y documentales.', en: 'You analyze complex speeches and documentaries.' },
        { time: 4, es: 'Comprendes ironía, referencias culturales, suposiciones.', en: 'You understand irony, cultural references, assumptions.' },
        { time: 6, es: 'Diferencia hechos de opiniones e intenciones.', en: 'Differentiate facts from opinions and intentions.' },
      ],
    },
    C2: {
      topic: 'Maestría Auditiva y Comprensión Profunda',
      icon: '👂',
      explanationEs: 'En C2, comprendes prácticamente todo lo que escuchas en español, incluyendo discursos rápidos, acentos variados, humor sofisticado y referencias obscuras. Captas matices lingüísticos, giros idiomáticos y cambios de intención. Tu comprensión es prácticamente de hablante nativo.',
      explanationEn: 'At C2, you understand practically everything you hear in Spanish, including rapid speech, varied accents, sophisticated humor, and obscure references. You catch linguistic nuances, idiomatic expressions, and shifts in intention. Your comprehension is practically that of a native speaker.',
      example: 'Puedes escuchar una película española, un podcast literario o un debate político y comprenderlo completamente sin dificultad.',
      exampleEn: 'You can listen to a Spanish film, literary podcast, or political debate and understand it completely without difficulty.',
      subtitles: [
        { time: 0, es: 'Maestría Auditiva y Comprensión Profunda', en: 'Auditory Mastery and Deep Understanding' },
        { time: 2, es: 'Comprendes prácticamente todo en español.', en: 'You understand practically everything in Spanish.' },
        { time: 4, es: 'Hablas rápidos, acentos variados, humor sofisticado.', en: 'Fast speech, varied accents, sophisticated humor.' },
        { time: 6, es: 'Tu comprensión es prácticamente de hablante nativo.', en: 'Your comprehension is practically native-speaker level.' },
      ],
    },
  },
};
