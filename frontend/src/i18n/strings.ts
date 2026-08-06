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
  | 'benefits.benefit1'
  | 'benefits.benefit2'
  | 'benefits.benefit3'
  | 'howItWorks.eyebrow'
  | 'howItWorks.title'
  | 'howItWorks.step1'
  | 'howItWorks.step2'
  | 'howItWorks.step3'
  | 'host.eyebrow'
  | 'host.title'
  | 'host.description'
  | 'host.button'
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
  'hero.subtitle': 'Learn Spanish, Reclama la lengua con la que creciste',
  'hero.startButton': 'Start Learning',
  'languageSelector.title': 'Choose Your Learning Path',
  'languageSelector.interface': 'Interface Language',
  'languageSelector.learn': 'Learn a Language',
  'languageSelector.ready': '✓ Ready to learn! Select a skill below to start.',
  'levels.eyebrow': 'Your own level in every language',
  'levels.title': 'You\'re not one level, you\'re four',
  'levels.description': 'Define your level for Speaking, Reading, Listening, and Writing on the CEFR scale (A1–C2). Each skill progresses on its own. Listening C1 but writing B1? That\'s the point.',
  'levels.selectLanguage': 'Please select a language to learn from the menu to start practicing.',
  'benefits.eyebrow': 'What makes us different',
  'benefits.title': 'Heritage language learning, reimagined',
  'benefits.benefit1': 'Personalized to your actual level in each skill',
  'benefits.benefit2': 'Native speakers as teachers, AI as your coach',
  'benefits.benefit3': 'Learn your heritage language without guilt or pressure',
  'howItWorks.eyebrow': 'How it works',
  'howItWorks.title': 'Three steps to fluency',
  'howItWorks.step1': 'Take a quick assessment',
  'howItWorks.step2': 'Practice at your level',
  'howItWorks.step3': 'Track your progress',
  'host.eyebrow': 'Teach with us',
  'host.title': 'Become a Heritage Speaker teacher',
  'host.description': 'Create content for learners of your heritage language',
  'host.button': 'Learn more',
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
  'hero.tagline': 'Reclaima el idioma con el que creciste',
  'hero.subtitle': 'Aprende Ruso, Reclaim the language you grew up with',
  'hero.startButton': 'Comenzar a Aprender',
  'languageSelector.title': 'Elige tu Camino de Aprendizaje',
  'languageSelector.interface': 'Idioma de la Interfaz',
  'languageSelector.learn': 'Aprende un Idioma',
  'languageSelector.ready': '✓ ¡Listo para aprender! Selecciona una habilidad abajo para comenzar.',
  'levels.eyebrow': 'Tu propio nivel en cada idioma',
  'levels.title': 'No eres un nivel, eres cuatro',
  'levels.description': 'Define tu nivel en Habla, Lectura, Escucha y Escritura en la escala CEFR (A1–C2). Cada habilidad progresa por su cuenta. ¿Escucha C1 pero escritura B1? Ese es el punto.',
  'levels.selectLanguage': 'Por favor selecciona un idioma para aprender desde el menú para comenzar a practicar.',
  'benefits.eyebrow': 'Lo que nos hace diferentes',
  'benefits.title': 'Aprendizaje de idiomas de herencia, reimaginado',
  'benefits.benefit1': 'Personalizado a tu nivel real en cada habilidad',
  'benefits.benefit2': 'Hablantes nativos como profesores, IA como tu entrenador',
  'benefits.benefit3': 'Aprende tu idioma de herencia sin culpa ni presión',
  'howItWorks.eyebrow': 'Cómo funciona',
  'howItWorks.title': 'Tres pasos hacia la fluidez',
  'howItWorks.step1': 'Toma una evaluación rápida',
  'howItWorks.step2': 'Practica en tu nivel',
  'howItWorks.step3': 'Rastrear tu progreso',
  'host.eyebrow': 'Enseña con nosotros',
  'host.title': 'Conviértete en profesor de Heritage Speakers',
  'host.description': 'Crea contenido para aprendices de tu idioma de herencia',
  'host.button': 'Aprende más',
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
