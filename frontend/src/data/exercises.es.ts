import { CefrLevel, Exercise, SkillId } from './types';
import { EXERCISES_RU } from './exercises.ru';

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
    title: 'Presentación de Trabajo',
    prompt: 'Da una presentación breve sobre un proyecto o iniciativa de tu trabajo o estudios, como si se la explicaras a un compañero nuevo. Incluye objetivos, retos y resultados.',
    suggestedDuration: '5-7 minutos',
  },
  'C2-Speaking': {
    skill: 'Speaking',
    title: 'Negociación Difícil',
    prompt: 'Simula que tienes que negociar un cambio de condiciones (plazo, precio o alcance) con un cliente o jefe. Defiende tu postura con naturalidad, siendo firme pero cordial.',
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
    title: 'El Auge del Trabajo Remoto',
    passage:
      'Pocas transformaciones laborales han sido tan rápidas como la normalización del trabajo remoto tras la pandemia. Lo que empezó como una solución de emergencia se ha convertido, para muchas empresas, en una ventaja competitiva: acceso a talento sin restricciones geográficas, menores costes de oficina y, según numerosas encuestas, empleados más satisfechos. Sin embargo, no todo son beneficios. Los directivos señalan una dificultad real para mantener la cultura de equipo y detectar señales tempranas de desgaste profesional cuando la interacción se reduce a videollamadas programadas. Las empresas que mejor están gestionando esta transición combinan la flexibilidad con encuentros presenciales puntuales, deliberadamente diseñados para fortalecer vínculos que el trabajo a distancia, por sí solo, no logra sostener.',
    questions: [
      { type: 'open', question: '¿Qué ventajas del trabajo remoto se mencionan en el texto?' },
      { type: 'open', question: '¿Cuál es la principal dificultad que señalan los directivos?' },
      { type: 'open', question: '¿Qué estrategia usan las empresas que mejor gestionan esta transición?' },
    ],
  },

  'A1-Listening': {
    skill: 'Listening',
    title: 'En el Restaurante',
    transcript:
      'CAMARERO: Buenas noches, ¿qué desea?\nCLIENTE: Un café y un bocadillo de jamón.\nCAMARERO: ¿Desea algo más?\nCLIENTE: Sí, un postre de chocolate.\nCAMARERO: Vale, perfecto. Son quince euros.',
    defaultAccent: 'es-ES',
    questions: [
      { type: 'open', question: '¿Qué pide el cliente?' },
      { type: 'open', question: '¿Cuál es el precio total?', hint: 'Escucha el número' },
    ],
  },
  'A2-Listening': {
    skill: 'Listening',
    title: 'Compras en el Mercado',
    transcript:
      'VENDEDOR: Buenos días, ¿qué va a llevar?\nCLIENTA: Quiero jitomates, lechuga, manzanas y leche.\nVENDEDOR: ¿De qué tamaño las manzanas?\nCLIENTA: Medianas, por favor. También deme ese queso.\nVENDEDOR: Muy bien. Son trescientos pesos en total.',
    defaultAccent: 'es-MX',
    questions: [
      { type: 'open', question: '¿Qué frutas compra la clienta?' },
      { type: 'open', question: '¿Cuál es el precio total?', hint: 'Escucha el número' },
    ],
  },
  'B1-Listening': {
    skill: 'Listening',
    title: 'Entrevista sobre Viajes',
    transcript:
      'ENTREVISTADOR: Contame, ¿cuál fue tu viaje más memorable?\nPERSONA: Uy, mi viaje a Perú, hace dos años. Fui a Machu Picchu y fue una locura, buenísimo.\nENTREVISTADOR: ¿Y con quién viajaste?\nPERSONA: Con mi familia y unos amigos.\nENTREVISTADOR: ¿Vos pensás volver algún día?\nPERSONA: Sí, seguro que sí. Me encantaría volver.',
    defaultAccent: 'es-AR',
    questions: [
      { type: 'open', question: '¿A dónde viajó la persona y con quién?' },
      { type: 'open', question: '¿Qué piensa hacer la persona en el futuro?' },
    ],
  },
  'B2-Listening': {
    skill: 'Listening',
    title: 'Debate sobre Redes Sociales',
    transcript:
      'MODERADOR: Hoy vamos a debatir el impacto de las redes sociales. Ana, ¿cuál es su postura?\nANA: Pues yo creo que nos conectan, pero también generan ansiedad y comparación constante, ¿cierto?\nMODERADOR: Carlos, ¿usted qué opina?\nCARLOS: En parte estoy de acuerdo. Para mi negocio han sido clave, la verdad, pero comparto la preocupación por la salud mental de los jóvenes.\nMODERADOR: ¿Alguna solución?\nANA: Educación digital desde el colegio.\nCARLOS: Y límites de uso, sobre todo para los más chicos.',
    defaultAccent: 'es-CO',
    questions: [
      { type: 'open', question: '¿Cuáles son las dos posiciones principales del debate?' },
      { type: 'open', question: '¿En qué punto están de acuerdo Ana y Carlos?' },
    ],
  },
  'C1-Listening': {
    skill: 'Listening',
    title: 'Reportaje sobre la Vivienda',
    transcript:
      'Buenas tardes. Hoy en el programa hablamos de una realidad que afecta a cada vez más familias en nuestro país: el acceso a la vivienda. Los precios del alquiler no han dejado de subir en los últimos años, especialmente en las grandes ciudades, y muchos jóvenes se ven obligados a seguir viviendo con sus padres mucho más tiempo del que les gustaría. Algunos ayuntamientos han empezado a limitar los precios, aunque los resultados, de momento, son desiguales. Os invito a reflexionar sobre qué medidas podrían realmente marcar la diferencia.',
    defaultAccent: 'es-ES',
    questions: [
      { type: 'open', question: '¿Cuál es el tema principal del reportaje?' },
      { type: 'open', question: '¿Qué han hecho algunos ayuntamientos y con qué resultado?' },
    ],
  },
  'C2-Listening': {
    skill: 'Listening',
    title: 'Análisis sobre el Trabajo Remoto',
    transcript:
      'Miren, lo que estamos viendo en México desde la pandemia es un cambio bastante profundo en la forma de trabajar. Muchísimas empresas, sobre todo las medianas, se dieron cuenta de que el trabajo remoto no solo era viable, sino que hasta les convenía más: menos gastos en oficinas, más flexibilidad para retener talento. Ahora bien, esto también trajo sus complicaciones, ¿no? Porque no es lo mismo gestionar un equipo que está enfrente tuyo que uno disperso en cinco ciudades distintas. Entonces las empresas que de plano supieron adaptarse, con procesos claros y buena comunicación, son las que hoy están ganando la partida.',
    defaultAccent: 'es-MX',
    questions: [
      { type: 'open', question: '¿Qué cambio describe la persona y por qué se dio?' },
      { type: 'open', question: '¿Qué distingue a las empresas que "están ganando la partida" según el ponente?' },
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
    title: 'Correo Formal de Reclamación',
    prompt: 'Escribe un correo formal a una empresa reclamando un problema con un pedido o servicio. Explica el problema con claridad, qué esperas como solución, y mantén un tono firme pero educado.',
    minWords: 250,
    maxWords: 320,
  },
  'C2-Writing': {
    skill: 'Writing',
    title: 'Artículo de Opinión',
    prompt: 'Escribe un artículo de opinión sobre un tema de actualidad que te importe (trabajo, vivienda, tecnología, medio ambiente). Argumenta tu postura con matices y contempla el punto de vista contrario.',
    minWords: 300,
    maxWords: 400,
  },
};

export function getExerciseBank(learningLanguageCode: string): Record<string, Exercise> {
  if (learningLanguageCode === 'es') return EXERCISES_ES;
  if (learningLanguageCode === 'ru') return EXERCISES_RU;
  return {};
}

export function getExercise(languageCode: string, skill: SkillId, level: CefrLevel): Exercise | null {
  return getExerciseBank(languageCode)[`${level}-${skill}`] ?? null;
}
