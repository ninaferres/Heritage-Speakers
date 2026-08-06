import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LanguageSelector } from './components/LanguageSelector';
import { LevelsSection } from './components/LevelsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
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
      <section style={{ padding: '1rem 0', background: 'var(--bone)' }}>
        <div className="wrap">
          <LanguageSelector />
        </div>
      </section>
      <BenefitsSection />
      <HowItWorksSection />
      <FinalCtaSection />
      <Footer />
      {assessmentOpen && <AssessmentModal onClose={() => setAssessmentOpen(false)} />}
    </ExerciseGateProvider>
  );
}
