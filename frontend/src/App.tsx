import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PathsSection } from './components/PathsSection';
import { LevelsIntroSection, ExamModeSection } from './components/LevelsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { ExerciseGateProvider } from './context/ExerciseGateContext';
import { MicroLessonGateProvider } from './context/MicroLessonGateContext';
import { StreakProvider } from './context/StreakContext';
import { FeedbackWidget } from './components/FeedbackWidget';
import { PhoneGateModal } from './components/PhoneGateModal';

export default function App() {
  return (
    <StreakProvider>
      <ExerciseGateProvider>
        <MicroLessonGateProvider>
          <PhoneGateModal />
          <Header />
          <Hero />
          <BenefitsSection />
          <HowItWorksSection />
          <PathsSection />
          <LevelsIntroSection />
          <ExamModeSection />
          <FinalCtaSection />
          <Footer />
          <FeedbackWidget />
        </MicroLessonGateProvider>
      </ExerciseGateProvider>
    </StreakProvider>
  );
}
