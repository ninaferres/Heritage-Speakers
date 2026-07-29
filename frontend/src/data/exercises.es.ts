import { CefrLevel, Exercise, SkillId } from './types';

/**
 * Spanish exercise bank, keyed "<level>-<skill>". This is the 'es' track;
 * a future language adds its own `exercises.<code>.ts` file with the same
 * key shape and is looked up via getExerciseBank() below.
 *
 * Listening exercises intentionally carry a `transcript` script rather than
 * a static audio URL — the old prototype pointed at dead third-party mp3
 * links. Audio is now synthesized on demand by the backend TTS endpoint
 * (ElevenLabs) in whichever regional accent the learner picks, so it never
 * goes stale.
 */
export const EXERCISES_ES: Record<string, Exercise> = {
  'A1-Speaking': {
    skill: 'Speaking',
    title: 'Presentación Personal',
    prompt: 'Preséntate: tu nombre, edad, ciudad y dos cosas que te gusta hacer.',
    suggestedDuration: '1-2 minutos',
  },
  'A2-Speaking': {
    skill: 'Speaking',
    title: 'Mi Rutina Diaria',
    prompt: 'Describe tu día típico desde que te despiertas hasta que te acuestas.',
    suggestedDuration: '2-3 minutos',
  },
  'B1-Speaking': {
    skill: 'Speaking',
    title: 'La Tecnología en mi Vida',
    prompt: 'Habla sobre cómo la tecnología ha impactado tu vida: beneficios, problemas, opinión personal.',
    suggestedDuration: '3-4 minutos',
  },
  'B2-Speaking': {
    skill: 'Speaking',
    title: 'Un Problema Social Importante',
    prompt: 'Explica un problema social importante: qué es, por qué importa, cómo afecta a la sociedad, posibles soluciones.',
    suggestedDuration: '4-5 minutos',
  },
  'C1-Speaking': {
    skill: 'Speaking',
    title: 'Análisis de Tendencias Culturales',
    prompt: 'Analiza cómo la globalización transforma culturas locales. Perspectivas positivas y negativas.',
    suggestedDuration: '5-7 minutos',
  },
  'C2-Speaking': {
    skill: 'Speaking',
    title: 'Reflexión Teórica Contemporánea',
    prompt: 'Diserta sobre una problemática del pensamiento contemporáneo: ética, epistemología, política o estética.',
    suggestedDuration: '7-10 minutos',
  },

  'A1-Reading': {
    skill: 'Reading',
    title: 'Mi Rutina Diaria',
    passage:
      'Me llamo María y vivo en Madrid. Cada mañana me despierto a las siete de la mañana sin falta. Desayuno café con tostadas mientras leo el periódico. Después me ducho durante veinte minutos y me preparo cuidadosamente para el trabajo. Trabajo como secretaria en una oficina grande desde las nueve hasta las cinco de la tarde. A mediodía como en la cafetería de la empresa con mis compañeros. Después del trabajo, voy al gimnasio tres veces a la semana. Por la noche ceno con mi familia alrededor de las ocho y media. Me acuesto a las once de la noche para descansar bien.',
    questions: [
      { type: 'open', question: '¿A qué hora se despierta María cada mañana?' },
      { type: 'open', question: '¿Cuál es el trabajo de María? Describe sus responsabilidades.' },
      { type: 'open', question: '¿Qué actividades realiza María después del trabajo?' },
    ],
  },
  'A2-Reading': {
    skill: 'Reading',
    title: 'Un Viaje Memorable a Barcelona',
    passage:
      'El mes pasado tuve la oportunidad de viajar a Barcelona con mis mejores amigos. Llegamos en tren por la mañana temprano. Nos alojamos en un hotel céntrico cerca de la Sagrada Familia. El primer día visitamos la iglesia más famosa de Barcelona. Por la tarde caminamos por las Ramblas. El segundo día fuimos a la playa del Mediterráneo. Por la noche probamos la comida tradicional catalana: paella, jamón ibérico, pan con tomate. El tercer día visitamos el Parque Güell. Fue un viaje maravilloso que nunca olvidaré.',
    questions: [
      { type: 'open', question: '¿Con quién viajó la persona a Barcelona?' },
      { type: 'open', question: '¿Cuáles fueron los tres lugares principales que visitaron?' },
      { type: 'open', question: '¿Qué comidas típicas españolas probaron durante el viaje?' },
    ],
  },
  'B1-Reading': {
    skill: 'Reading',
    title: 'El Cambio Climático',
    passage:
      'El cambio climático es uno de los desafíos más importantes que enfrenta la humanidad en el siglo veintiuno. Los científicos advierten que las temperaturas globales continuarán aumentando si no reducimos las emisiones de gases de efecto invernadero. Ya estamos presenciando sequías extremas, inundaciones catastróficas y la desaparición acelerada de especies. Sin embargo, existen soluciones viables: la transición hacia energías renovables como la solar y la eólica puede reducir significativamente nuestro impacto ambiental. Es crucial que gobiernos, empresas e individuos trabajen juntos.',
    questions: [
      { type: 'open', question: '¿Cuál es el tema principal del texto?' },
      { type: 'open', question: 'Menciona dos consecuencias devastadoras del cambio climático.' },
      { type: 'open', question: '¿Qué soluciones propone el texto?' },
    ],
  },
  'B2-Reading': {
    skill: 'Reading',
    title: 'La Inteligencia Artificial',
    passage:
      'La inteligencia artificial se ha convertido en una fuerza transformadora que permea prácticamente todos los aspectos de nuestra sociedad contemporánea. Desde algoritmos que personalizan nuestras experiencias digitales hasta sistemas de diagnóstico médico, la IA está redefiniendo lo que es posible. Sin embargo, esta revolución plantea interrogantes éticos profundos. ¿Cómo garantizamos que la IA se desarrolle de manera equitativa? ¿Qué sucede con los empleos que serán automatizados? Expertos sostienen que la solución radica en un marco regulatorio robusto que equilibre innovación y protección de derechos.',
    questions: [
      { type: 'open', question: '¿Cuál es el propósito principal del autor?' },
      { type: 'open', question: 'Proporciona dos ejemplos de cómo la IA está transformando la sociedad.' },
      { type: 'open', question: '¿Cuáles son las principales interrogantes éticas que plantea la IA?' },
    ],
  },
  'C1-Reading': {
    skill: 'Reading',
    title: 'Civilizaciones Antiguas y su Resiliencia',
    passage:
      'La historia de las civilizaciones antiguas ofrece lecciones profundas sobre los ciclos de prosperidad y declive que caracterizan el desarrollo humano. Culturas aparentemente invencibles —desde el Imperio Romano hasta la dinastía Maya— experimentaron colapsos que parecieron inexorables. Los historiadores debaten las múltiples causas: factores ambientales, presiones militares, corrupción institucional e incapacidad de adaptarse. No obstante, estos estudios revelan un patrón intrigante: las sociedades con plasticidad institucional y capacidad de reinvención frecuentemente lograban florecer nuevamente tras crisis devastadoras.',
    questions: [
      { type: 'open', question: '¿Cuáles son los principales factores multifactoriales del colapso civilizacional?' },
      { type: 'open', question: '¿Qué características presentaban las sociedades que lograron recuperarse?' },
      { type: 'open', question: '¿Cuál es la tesis central del texto respecto a la resiliencia?' },
    ],
  },
  'C2-Reading': {
    skill: 'Reading',
    title: 'Epistemología de la Alteridad Postmoderna',
    passage:
      'La alteridad constituye un eje fundamental en la reflexión filosófica postmoderna, particularmente en los trabajos de Emmanuel Levinas y Jacques Derrida. La alteridad —concebida no como una diferencia ontológica binaria sino como una irreductibilidad absoluta del Otro— desafía radicalmente los presupuestos epistemológicos que han dominado la filosofía occidental. Levinas propone una lectura ética de la responsabilidad que precede a toda cognición, estableciendo una asimetría estructural en la relación con el Otro que resiste la totalización bajo categorías racionales.',
    questions: [
      { type: 'open', question: '¿Cómo conceptualiza Levinas la alteridad?' },
      { type: 'open', question: '¿Cuál es la inversión fundamental que propone Levinas frente a la epistemología tradicional?' },
      { type: 'open', question: '¿Qué implicaciones tiene esta noción de alteridad para la teoría política contemporánea?' },
    ],
  },

  'A1-Listening': {
    skill: 'Listening',
    title: 'En el Restaurante',
    transcript:
      'MESERO: Buenas noches, ¿qué desea?\nCLIENTE: Un café y un sándwich de jamón.\nMESERO: ¿Desea algo más?\nCLIENTE: Sí, un postre de chocolate.\nMESERO: Perfecto. Son quince euros.',
    defaultAccent: 'es-ES',
    questions: [
      { type: 'open', question: '¿Qué pide el cliente?' },
      { type: 'open', question: '¿Cuál es el precio total?', hint: 'Escucha el número' },
    ],
  },
  'A2-Listening': {
    skill: 'Listening',
    title: 'Compras en el Supermercado',
    transcript:
      'VENDEDOR: Buenos días, ¿qué necesita?\nCLIENTE: Quiero tomates, lechuga, manzanas y leche.\nVENDEDOR: ¿De qué tamaño las manzanas?\nCLIENTE: Medianas, por favor. También me da ese queso.\nVENDEDOR: Perfecto. Son treinta euros en total.',
    defaultAccent: 'es-MX',
    questions: [
      { type: 'open', question: '¿Qué frutas compra el cliente?' },
      { type: 'open', question: '¿Cuál es el precio total?', hint: 'Escucha el número' },
    ],
  },
  'B1-Listening': {
    skill: 'Listening',
    title: 'Entrevista sobre Viajes',
    transcript:
      'ENTREVISTADOR: ¿Cuál fue tu viaje más memorable?\nPERSONA: Mi viaje a Perú hace dos años. Visité Machu Picchu y fue increíble.\nENTREVISTADOR: ¿Con quién viajaste?\nPERSONA: Con mi familia y algunos amigos.\nENTREVISTADOR: ¿Qué te gustó más?\nPERSONA: La naturaleza y la cultura. Todo fue perfecto.',
    defaultAccent: 'es-AR',
    questions: [
      { type: 'open', question: '¿A dónde viajó la persona y con quién?' },
      { type: 'open', question: '¿Qué fue lo que más le gustó del viaje?' },
    ],
  },
  'B2-Listening': {
    skill: 'Listening',
    title: 'Debate sobre Redes Sociales',
    transcript:
      'MODERADOR: Hoy debatimos el impacto de las redes sociales. Ana, ¿tu postura?\nANA: Creo que nos conectan, pero también generan ansiedad y comparación constante.\nMODERADOR: Carlos, ¿estás de acuerdo?\nCARLOS: En parte. Para mi negocio han sido clave, pero comparto la preocupación por la salud mental de los jóvenes.\nMODERADOR: ¿Alguna solución?\nANA: Educación digital desde la escuela.\nCARLOS: Y límites de uso, sobre todo para menores.',
    defaultAccent: 'es-CO',
    questions: [
      { type: 'open', question: '¿Cuáles son las dos posiciones principales del debate?' },
      { type: 'open', question: '¿En qué punto están de acuerdo Ana y Carlos?' },
    ],
  },
  'C1-Listening': {
    skill: 'Listening',
    title: 'Conferencia sobre Cambio Climático',
    transcript:
      'Buenas tardes a todos. Hoy quiero hablarles de un fenómeno que ya no es una hipótesis futura, sino una realidad medible: el aumento sostenido de la temperatura global. Los modelos climáticos coinciden en señalar que, de mantenerse la trayectoria actual de emisiones, superaremos el umbral de un aumento de dos grados antes de mediados de siglo. Las consecuencias no son uniformes: algunas regiones sufrirán sequías prolongadas, mientras otras enfrentarán inundaciones cada vez más frecuentes. La urgencia de actuar radica precisamente en esta desigualdad de impactos.',
    defaultAccent: 'es-ES',
    questions: [
      { type: 'open', question: '¿Cuál es la tesis principal de la conferencia?' },
      { type: 'open', question: '¿Por qué el ponente enfatiza la urgencia de actuar?' },
    ],
  },
  'C2-Listening': {
    skill: 'Listening',
    title: 'Seminario sobre Teoría Postmoderna',
    transcript:
      'La cuestión que nos ocupa hoy es de naturaleza fundamentalmente epistemológica: ¿cómo podemos dar cuenta del Otro sin subsumirlo bajo categorías que le son ajenas? Levinas nos advierte que toda ontología corre el riesgo de convertirse en una filosofía del poder, en la medida en que reduce la alteridad a lo mismo. Derrida, por su parte, radicaliza esta intuición mediante la noción de différance, que desestabiliza cualquier pretensión de presencia plena del sentido. Ambos autores, desde perspectivas distintas, nos invitan a repensar la responsabilidad ética como anterior a la teoría del conocimiento.',
    defaultAccent: 'es-MX',
    questions: [
      { type: 'open', question: '¿Cuál es la problemática epistemológica fundamental que plantea el seminario?' },
      { type: 'open', question: '¿Cómo se complementan las posturas de Levinas y Derrida según el ponente?' },
    ],
  },

  'A1-Writing': {
    skill: 'Writing',
    title: 'Preguntas sobre Ti',
    prompt:
      '¿Cuál es tu nombre completo y cuántos años tienes? ¿Cuál es tu profesión o qué estudias? ¿Cuál es tu hobby favorito y por qué te gusta?',
    minWords: 50,
    maxWords: 80,
  },
  'A2-Writing': {
    skill: 'Writing',
    title: 'Tu Experiencia',
    prompt: '¿Cuál es tu rutina típica de una mañana? ¿Qué actividades realizas después del trabajo o la escuela?',
    minWords: 80,
    maxWords: 120,
  },
  'B1-Writing': {
    skill: 'Writing',
    title: 'Reflexiones',
    prompt: 'Describe un evento memorable de tu vida. ¿Por qué fue importante? ¿Cuál es un cambio que desearías ver en tu comunidad?',
    minWords: 150,
    maxWords: 200,
  },
  'B2-Writing': {
    skill: 'Writing',
    title: 'Análisis',
    prompt: '¿Cuál es tu evaluación del impacto de las redes sociales en la sociedad? ¿Cuáles son los beneficios y desafíos de la educación en línea?',
    minWords: 200,
    maxWords: 250,
  },
  'C1-Writing': {
    skill: 'Writing',
    title: 'Perspectivas',
    prompt: '¿Cómo se entrelazan la identidad personal y la identidad cultural en la modernidad? ¿Cuál es el papel de la educación en la formación de ciudadanía crítica?',
    minWords: 250,
    maxWords: 320,
  },
  'C2-Writing': {
    skill: 'Writing',
    title: 'Disquisición',
    prompt: '¿Cómo se articula la tensión entre ontología y epistemología en el pensamiento contemporáneo? ¿Cuáles son las implicaciones de la deconstrucción derridiana para la teoría social?',
    minWords: 300,
    maxWords: 400,
  },
};

export function getExerciseBank(languageCode: string): Record<string, Exercise> {
  if (languageCode === 'es') return EXERCISES_ES;
  return {};
}

export function getExercise(languageCode: string, skill: SkillId, level: CefrLevel): Exercise | null {
  return getExerciseBank(languageCode)[`${level}-${skill}`] ?? null;
}
