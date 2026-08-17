import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PathsSection } from './components/PathsSection';
import { LevelAssessmentSection } from './components/LevelAssessmentSection';
import { LevelsIntroSection, ExamModeSection } from './components/LevelsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { ExerciseGateProvider } from './context/ExerciseGateContext';
import { MicroLessonGateProvider } from './context/MicroLessonGateContext';
import { FeedbackWidget } from './components/FeedbackWidget';

export default function App() {
  return (
    <ExerciseGateProvider>
      <MicroLessonGateProvider>
        <Header />
        <Hero />
        <BenefitsSection />
        <PathsSection />
        <LevelsIntroSection />
        <HowItWorksSection />
        <LevelAssessmentSection />
        <ExamModeSection />
        <FinalCtaSection />
        <Footer />
        <FeedbackWidget />
      </MicroLessonGateProvider>
    </ExerciseGateProvider>
  );
}
