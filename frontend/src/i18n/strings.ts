/**
 * UI strings for both English and Spanish interfaces
 */

export type StringKey =
  | 'header.logo'
  | 'header.selectLanguage'
  | 'nav.home'
  | 'nav.assessLevel'
  | 'nav.login'
  | 'nav.signup'
  | 'hero.tagline'
  | 'hero.subtitle'
  | 'hero.startButton'
  | 'languageSelector.title'
  | 'languageSelector.interface'
  | 'languageSelector.learn'
  | 'languageSelector.ready'
  | 'levels.eyebrow'
  | 'levels.title'
  | 'levels.description'
  | 'levels.selectLanguage'
  | 'benefits.eyebrow'
  | 'benefits.title'
  | 'benefits.description'
  | 'benefits.benefit1Title'
  | 'benefits.benefit1Body'
  | 'benefits.benefit2Title'
  | 'benefits.benefit2Body'
  | 'benefits.benefit3Title'
  | 'benefits.benefit3Body'
  | 'howItWorks.eyebrow'
  | 'howItWorks.title'
  | 'howItWorks.step1Title'
  | 'howItWorks.step1Body'
  | 'howItWorks.step2Title'
  | 'howItWorks.step2Body'
  | 'howItWorks.step3Title'
  | 'howItWorks.step3Body'
  | 'host.name'
  | 'host.bio'
  | 'finalCta.title'
  | 'finalCta.description'
  | 'finalCta.buttonLabel'
  | 'finalCta.successMessage'
  | 'footer.copyright'
  | 'exercise.title'
  | 'exercise.notAvailable'
  | 'exercise.tryDifferent'
  | 'assessment.determineLevel'
  | 'assessment.choose'
  | 'assessment.takes5Minutes'
  | 'assessment.noWriting'
  | 'assessment.testAnother'
  | 'assessment.startExercises'
  | 'assessment.yourLevel'
  | 'assessment.complete'
  | 'assessment.basedOnAnswers'
  | 'assessment.question'
  | 'assessment.of'
  | 'assessment.previous'
  | 'assessment.next'
  | 'assessment.finishAndSeeResult';

export const EN: Record<StringKey, string> = {
  'header.logo': 'Heritage Speakers',
  'header.selectLanguage': 'Select Language',
  'nav.home': 'Home',
  'nav.assessLevel': 'Assess Level',
  'nav.login': 'Login',
  'nav.signup': 'Sign Up',
  'hero.tagline': 'Reclaim the language you grew up with',
  'hero.subtitle': 'Strengthen your Spanish, skill by skill',
  'hero.startButton': 'Start Learning',
  'languageSelector.title': 'Choose Your Learning Path',
  'languageSelector.interface': 'Interface Language',
  'languageSelector.learn': 'Learn a Language',
  'languageSelector.ready': '✓ Ready to learn! Select a skill below to start.',
  'levels.eyebrow': 'Your own level in every language',
  'levels.title': 'You\'re not one level, you\'re four',
  'levels.description': 'Define your level for Speaking, Reading, Listening, and Writing on the CEFR scale (A1–C2). Each skill progresses on its own. Listening C1 but writing B1? That\'s the point.',
  'levels.selectLanguage': 'Please select a language to learn from the menu to start practicing.',
  'benefits.eyebrow': 'What you\'ll get',
  'benefits.title': 'Three things that change how you show up',
  'benefits.description': 'At work, at home, on paper.',
  'benefits.benefit1Title': 'Grow each skill at its own pace',
  'benefits.benefit1Body': 'Your listening might be years ahead of your writing. We meet each skill exactly where it is, no averaging down.',
  'benefits.benefit2Title': 'Close the understanding-to-using gap',
  'benefits.benefit2Body': 'You already hear it. Half-speak it. We help you read and write with the same confidence you bring to listening.',
  'benefits.benefit3Title': 'Track real CEFR progress',
  'benefits.benefit3Body': 'Watch each skill climb the scale, or hold steady at C2. Progress you can point to, skill by skill.',
  'howItWorks.eyebrow': 'How it works',
  'howItWorks.title': 'Three steps, then you\'re moving',
  'howItWorks.step1Title': 'Set your starting levels',
  'howItWorks.step1Body': 'Tell us where each skill sits today. Four honest starting points, no guessing one single level.',
  'howItWorks.step2Title': 'Practice with guided sessions',
  'howItWorks.step2Body': 'Each session targets one skill at one CEFR level. Always at the right edge: never too easy, never overwhelming.',
  'howItWorks.step3Title': 'Level up or maintain',
  'howItWorks.step3Body': 'Move up one skill at a time. Reach C2 and switch to Maintain to keep it sharp.',
  'host.name': 'Meet Nina',
  'host.bio': 'I grew up in a family where we spoke Spanish, Catalan, and Russian. I use Spanish and Catalan every day here in Catalonia, but Russian is the language I only speak with my family. It\'s that language, the one that connects me to my roots, that inspired me to build Heritage Speakers. I know what it feels like to understand a language but struggle to speak it fluently. I know the fear of losing it. That\'s why I created this: so your heritage language stays alive, not something you lose.',
  'finalCta.title': 'Your heritage language is waiting',
  'finalCta.description': 'Sign up and we\'ll set up your four skill tracks.',
  'finalCta.buttonLabel': 'Start now →',
  'finalCta.successMessage': 'You\'re all set — scroll up to pick a skill and level to get started.',
  'footer.copyright': '© 2026 Heritage Speakers',
  'exercise.title': 'Exercise',
  'exercise.notAvailable': 'Exercise not available yet',
  'exercise.tryDifferent': 'We\'re still building out content for this combination. Try a different level for now.',
  'assessment.determineLevel': 'Determine Your Level',
  'assessment.choose': 'Choose a skill to assess',
  'assessment.takes5Minutes': 'The test takes about 5 minutes and uses quick questions (no writing required).',
  'assessment.noWriting': 'No writing required',
  'assessment.testAnother': 'Test Another Skill',
  'assessment.startExercises': 'Start Exercises',
  'assessment.yourLevel': 'Your Level',
  'assessment.complete': 'Assessment Complete',
  'assessment.basedOnAnswers': 'Based on your answers, we\'ve determined your',
  'assessment.question': 'Question',
  'assessment.of': 'of',
  'assessment.previous': '← Previous',
  'assessment.next': 'Next →',
  'assessment.finishAndSeeResult': 'Finish & See Result',
};

export const ES: Record<StringKey, string> = {
  'header.logo': 'Heritage Speakers',
  'header.selectLanguage': 'Seleccionar Idioma',
  'nav.home': 'Inicio',
  'nav.assessLevel': 'Evaluar Nivel',
  'nav.login': 'Iniciar Sesión',
  'nav.signup': 'Registrarse',
  'hero.tagline': 'Reclama el idioma con el que creciste',
  'hero.subtitle': 'Fortalece tu ruso, habilidad por habilidad',
  'hero.startButton': 'Comenzar a Aprender',
  'languageSelector.title': 'Elige tu Camino de Aprendizaje',
  'languageSelector.interface': 'Idioma de la Interfaz',
  'languageSelector.learn': 'Aprende un Idioma',
  'languageSelector.ready': '✓ ¡Listo para aprender! Selecciona una habilidad abajo para comenzar.',
  'levels.eyebrow': 'Tu propio nivel en cada idioma',
  'levels.title': 'No eres un nivel, eres cuatro',
  'levels.description': 'Define tu nivel en Habla, Lectura, Escucha y Escritura en la escala CEFR (A1–C2). Cada habilidad progresa por su cuenta. ¿Escucha C1 pero escritura B1? Ese es el punto.',
  'levels.selectLanguage': 'Por favor selecciona un idioma para aprender desde el menú para comenzar a practicar.',
  'benefits.eyebrow': 'Lo que obtendrás',
  'benefits.title': 'Tres cosas que cambian cómo te presentas',
  'benefits.description': 'En el trabajo, en casa, en papel.',
  'benefits.benefit1Title': 'Desarrolla cada habilidad a tu propio ritmo',
  'benefits.benefit1Body': 'Tu comprensión auditiva podría estar años por delante de tu escritura. Nos ajustamos a cada habilidad exactamente donde está, sin promediar hacia abajo.',
  'benefits.benefit2Title': 'Cierra la brecha entre entender y usar',
  'benefits.benefit2Body': 'Ya lo entiendes. Lo hablas a medias. Te ayudamos a leer y escribir con la misma confianza que traes a la escucha.',
  'benefits.benefit3Title': 'Sigue tu progreso real en CEFR',
  'benefits.benefit3Body': 'Mira cada habilidad subir en la escala, o mantente en C2. Progreso que puedes ver, habilidad por habilidad.',
  'howItWorks.eyebrow': 'Cómo funciona',
  'howItWorks.title': 'Tres pasos y luego estás en movimiento',
  'howItWorks.step1Title': 'Establece tus niveles iniciales',
  'howItWorks.step1Body': 'Cuéntanos dónde está cada habilidad hoy. Cuatro puntos de partida honestos, sin adivinar un solo nivel.',
  'howItWorks.step2Title': 'Practica con sesiones guiadas',
  'howItWorks.step2Body': 'Cada sesión se enfoca en una habilidad a un nivel CEFR. Siempre en el borde correcto: nunca demasiado fácil, nunca abrumador.',
  'howItWorks.step3Title': 'Sube de nivel o mantén',
  'howItWorks.step3Body': 'Sube una habilidad a la vez. Alcanza C2 y cambia a Mantener para mantenerla aguda.',
  'host.name': 'Conoce a Nina',
  'host.bio': 'Crecí en una familia donde hablábamos español, catalán y ruso. Uso español y catalán todos los días aquí en Cataluña, pero el ruso es el idioma que solo hablo con mi familia. Es ese idioma, el que me conecta con mis raíces, lo que me inspiró a crear Heritage Speakers. Sé lo que se siente entender un idioma pero luchar por hablarlo con fluidez. Conozco el miedo a perderlo. Por eso creé esto: para que tu idioma de herencia siga vivo, no algo que pierdas.',
  'finalCta.title': 'Tu idioma de herencia te está esperando',
  'finalCta.description': 'Regístrate y configuraremos tus cuatro pistas de habilidades.',
  'finalCta.buttonLabel': 'Comenzar ahora →',
  'finalCta.successMessage': 'Todo listo — desplázate hacia arriba para elegir una habilidad y nivel para comenzar.',
  'footer.copyright': '© 2026 Heritage Speakers',
  'exercise.title': 'Ejercicio',
  'exercise.notAvailable': 'Este ejercicio aún no está disponible',
  'exercise.tryDifferent': 'Todavía estamos creando contenido para esta combinación. Prueba un nivel diferente por ahora.',
  'assessment.determineLevel': 'Determina tu Nivel',
  'assessment.choose': 'Elige una habilidad para evaluar',
  'assessment.takes5Minutes': 'La prueba toma alrededor de 5 minutos y usa preguntas rápidas (no se requiere escritura).',
  'assessment.noWriting': 'No se requiere escritura',
  'assessment.testAnother': 'Evaluar Otra Habilidad',
  'assessment.startExercises': 'Comenzar Ejercicios',
  'assessment.yourLevel': 'Tu Nivel',
  'assessment.complete': 'Evaluación Completada',
  'assessment.basedOnAnswers': 'Basándonos en tus respuestas, hemos determinado que tu nivel de',
  'assessment.question': 'Pregunta',
  'assessment.of': 'de',
  'assessment.previous': '← Anterior',
  'assessment.next': 'Siguiente →',
  'assessment.finishAndSeeResult': 'Terminar y Ver Resultado',
};

export function getString(key: StringKey, uiLanguage: 'en' | 'es'): string {
  const strings = uiLanguage === 'es' ? ES : EN;
  return strings[key] || key;
}
