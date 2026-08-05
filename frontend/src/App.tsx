import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LevelsSection } from './components/LevelsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { HostSection } from './components/HostSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { AssessmentModal } from './components/Assessment/AssessmentModal';
import { ExerciseGateProvider } from './context/ExerciseGateContext';

export default function App() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  return (
    <ExerciseGateProvider>
      <Header />
      <Hero onOpenAssessment={() => setAssessmentOpen(true)} />
      <LevelsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <HostSection />
      <FinalCtaSection />
      <Footer />
      {assessmentOpen && <AssessmentModal onClose={() => setAssessmentOpen(false)} />}
    </ExerciseGateProvider>
  );
}
