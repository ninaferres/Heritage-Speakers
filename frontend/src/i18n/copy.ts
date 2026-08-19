/** Static UI copy for the auth gate/modal. Centralized so the gating/auth wording required by the
 * beta strategy stays consistent everywhere it's used, and localized to the active UI language. */

interface CopyShape {
  authGateTitle: string;
  authGateBody: string;
  logIn: string;
  signUp: string;
  continueWithGoogle: string;
  continueWithApple: string;
  or: string;
  emailLabel: string;
  passwordLabel: string;
  logInAction: string;
  signUpAction: string;
  switchToSignUp: string;
  switchToLogIn: string;
  legalNote: string;
  pleaseWait: string;
  authNotConfigured: string;
  phoneGateTitle: string;
  phoneGateBody: string;
  countryLabel: string;
  whatsappLabel: string;
  phoneGateAction: string;
  phoneGateError: string;
}

const COPY_EN: CopyShape = {
  authGateTitle: 'Unlock this exercise',
  authGateBody: 'Register for FREE to unlock exercises and receive personal feedback during our beta phase.',
  logIn: 'Log In',
  signUp: 'Sign Up',
  continueWithGoogle: 'Continue with Google',
  continueWithApple: 'Continue with Apple',
  or: 'or',
  emailLabel: 'Email address',
  passwordLabel: 'Password',
  logInAction: 'Log in',
  signUpAction: 'Create free account',
  switchToSignUp: "Don't have an account? Sign up",
  switchToLogIn: 'Already have an account? Log in',
  legalNote: 'Free during our beta. No payment required.',
  pleaseWait: 'Please wait…',
  authNotConfigured: 'Authentication is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign up.',
  phoneGateTitle: 'One last step',
  phoneGateBody: "We'll use your WhatsApp number to reach you personally during our beta — never for spam.",
  countryLabel: 'Country',
  whatsappLabel: 'WhatsApp number',
  phoneGateAction: 'Save and continue',
  phoneGateError: 'Enter a valid WhatsApp number.',
};

const COPY_ES: CopyShape = {
  authGateTitle: 'Desbloquea este ejercicio',
  authGateBody: 'Regístrate GRATIS para desbloquear ejercicios y recibir feedback personalizado durante nuestra fase beta.',
  logIn: 'Iniciar Sesión',
  signUp: 'Registrarse',
  continueWithGoogle: 'Continuar con Google',
  continueWithApple: 'Continuar con Apple',
  or: 'o',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  logInAction: 'Iniciar sesión',
  signUpAction: 'Crear cuenta gratis',
  switchToSignUp: '¿No tienes cuenta? Regístrate',
  switchToLogIn: '¿Ya tienes cuenta? Inicia sesión',
  legalNote: 'Gratis durante nuestra beta. No se requiere pago.',
  pleaseWait: 'Un momento…',
  authNotConfigured: 'La autenticación aún no está configurada. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para habilitar el registro.',
  phoneGateTitle: 'Un último paso',
  phoneGateBody: 'Usaremos tu número de WhatsApp para contactarte de forma personal durante nuestra beta. Nunca para spam.',
  countryLabel: 'País',
  whatsappLabel: 'Número de WhatsApp',
  phoneGateAction: 'Guardar y continuar',
  phoneGateError: 'Introduce un número de WhatsApp válido.',
};

export function getCopy(uiLanguage: 'en' | 'es'): CopyShape {
  return uiLanguage === 'es' ? COPY_ES : COPY_EN;
}
