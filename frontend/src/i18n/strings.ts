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
  | 'about.title'
  | 'about.eyebrow'
  | 'about.ninaStory'
  | 'about.ninaVision'
  | 'about.ninaWhyRosa'
  | 'about.ninaCall'
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
  | 'assessment.finishAndSeeResult'
  | 'speaking.header'
  | 'speaking.suggestedLength'
  | 'speaking.tipsTitle'
  | 'speaking.tipsClear'
  | 'speaking.tipsTime'
  | 'speaking.tipsFocus'
  | 'speaking.tipsPauses'
  | 'speaking.startRecording'
  | 'speaking.stopRecording'
  | 'speaking.yourRecording'
  | 'speaking.submit'
  | 'speaking.evaluating'
  | 'speaking.retake'
  | 'speaking.analyzing'
  | 'speaking.micDenied';

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
  'about.eyebrow': 'About Heritage Speakers',
  'about.title': 'Built by someone who gets it',
  'about.ninaStory': 'I\'m Nina. My heritage isn\'t just something I have, it\'s something I am. I grew up speaking three languages at home. Spanish with my parents, Catalan with my friends here, Russian with my grandparents. That\'s who I am. But as I got older, Russian started slipping away. I could still understand when my abuelas spoke, but I couldn\'t answer back fluently. I couldn\'t read it. Writing felt impossible. And it broke my heart a little each time.',
  'about.ninaVision': 'I started noticing something. All my friends with heritage languages had the exact same problem. We understood everything. We grew up with these languages in our bones. But we couldn\'t express ourselves fully. We were frozen between worlds. Native ears, but struggling mouths and hands. That gap felt impossible to close. Until I realized it wasn\'t impossible. It just needed the right approach. It needed someone who actually understands what it feels like to have a heritage language and to feel like you\'re losing it.',
  'about.ninaWhyRosa': 'Here\'s the truth: I built Heritage Speakers because I got tired of being dishonest on my CV. You know that moment when you\'re filling out your LinkedIn or resume and it asks for language proficiency? I could never check "native" because I was only fluent in speaking. I couldn\'t write well, my reading was clunky, my listening had gaps. But I AM a native speaker. I just needed to strengthen the other three skills. The rose color is here to celebrate that moment—when you can finally, honestly say you have native proficiency across speaking, reading, writing, and listening. All four skills. That\'s what we\'re building toward together.',
  'about.ninaCall': 'That\'s why Heritage Speakers exists. Not to teach you a new language. To help you reclaim one that\'s already in your heart. To give you four solid skills where you might have one or two. So you can finally check that box on your CV without hesitation. So you can call your abuelos and not just listen—you can talk back. Really talk. That\'s what this is for.',
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
  'speaking.header': '🎤 Speak naturally and fluently',
  'speaking.suggestedLength': '💡 Suggested length:',
  'speaking.tipsTitle': '📋 Tips for better recording:',
  'speaking.tipsClear': 'Speak clearly and at a natural pace',
  'speaking.tipsTime': 'Take your time — quality over speed',
  'speaking.tipsFocus': 'Focus on pronunciation and grammar',
  'speaking.tipsPauses': 'Feel free to use natural pauses',
  'speaking.startRecording': '🎤 Start Recording',
  'speaking.stopRecording': '⏹️ Stop',
  'speaking.yourRecording': 'Your Recording',
  'speaking.submit': '✓ Submit for Evaluation',
  'speaking.evaluating': 'Evaluating…',
  'speaking.retake': '🔄 Retake',
  'speaking.analyzing': 'Analyzing pronunciation, grammar, vocabulary and fluency…',
  'speaking.micDenied': 'Microphone access was denied. Please allow microphone access to record your answer.',
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
  'about.eyebrow': 'Acerca de Heritage Speakers',
  'about.title': 'Construido por alguien que lo entiende',
  'about.ninaStory': 'Soy Nina. Mi herencia no es solo algo que tengo, es algo que soy. Crecí hablando tres idiomas en casa. Español con mis padres, catalán con mis amigos aquí, ruso con mis abuelas. Eso es quien soy. Pero a medida que crecí, el ruso se empezó a desvanecerse. Seguía entendiendo cuando mis abuelas hablaban, pero no podía responder con fluidez. No podía leerlo. Escribir era casi imposible. Y eso me rompía un poco cada vez.',
  'about.ninaVision': 'Empecé a notar algo. Todos mis amigos con idiomas de herencia tenían exactamente el mismo problema. Entendemos todo. Crecimos con estos idiomas en nuestros huesos. Pero no podemos expresarnos plenamente. Estábamos congelados entre dos mundos. Oídos nativos, pero bocas y manos que luchan. Esa brecha parecía imposible de cerrar. Hasta que me di cuenta de que no era imposible. Solo necesitaba el enfoque correcto. Necesitaba a alguien que realmente entienda lo que se siente tener un idioma de herencia y sentir que lo estás perdiendo.',
  'about.ninaWhyRosa': 'Aquí va la verdad: construí Heritage Speakers porque me cansé de ser deshonesta en mi CV. ¿Sabes ese momento cuando estás rellenando tu LinkedIn o currículum y te pregunta por el nivel de idioma? Nunca podía marcar "nativo" porque solo hablaba con fluidez. No podía escribir bien, mi lectura era lenta, mi comprensión auditiva tenía huecos. Pero SÍ soy hablante nativa. Solo necesitaba fortalecer las otras tres habilidades. El color rosa está aquí para celebrar ese momento—cuando finalmente, honestamente, puedas decir que tienes dominio nativo en habla, lectura, escritura y comprensión auditiva. Las cuatro habilidades. Eso es lo que estamos construyendo juntos.',
  'about.ninaCall': 'Por eso existe Heritage Speakers. No para enseñarte un idioma nuevo. Para ayudarte a reclamar uno que ya está en tu corazón. Para darte cuatro habilidades sólidas donde tal vez tienes una o dos. Para que finalmente puedas marcar esa casilla en tu CV sin dudar. Para que puedas llamar a tus abuelas y no solo escuchar, puedas responder. Realmente hablar. Para eso es esto.',
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
  'speaking.header': '🎤 Habla naturalmente y con fluidez',
  'speaking.suggestedLength': '💡 Duración sugerida:',
  'speaking.tipsTitle': '📋 Consejos para una mejor grabación:',
  'speaking.tipsClear': 'Habla claramente y a un ritmo natural',
  'speaking.tipsTime': 'Tómate tu tiempo — calidad sobre velocidad',
  'speaking.tipsFocus': 'Enfócate en pronunciación y gramática',
  'speaking.tipsPauses': 'Siéntete libre de usar pausas naturales',
  'speaking.startRecording': '🎤 Comenzar Grabación',
  'speaking.stopRecording': '⏹️ Detener',
  'speaking.yourRecording': 'Tu Grabación',
  'speaking.submit': '✓ Enviar para Evaluación',
  'speaking.evaluating': 'Evaluando…',
  'speaking.retake': '🔄 Reintentar',
  'speaking.analyzing': 'Analizando pronunciación, gramática, vocabulario y fluidez…',
  'speaking.micDenied': 'Se denegó el acceso al micrófono. Por favor, permite el acceso al micrófono para grabar tu respuesta.',
};

export function getString(key: StringKey, uiLanguage: 'en' | 'es'): string {
  const strings = uiLanguage === 'es' ? ES : EN;
  return strings[key] || key;
}
