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
  | 'levels.title'
  | 'levels.description'
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
  'levels.title': 'Start at Your Level',
  'levels.description': 'Choose your proficiency level',
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
  'levels.title': 'Comienza en tu Nivel',
  'levels.description': 'Elige tu nivel de dominio',
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
