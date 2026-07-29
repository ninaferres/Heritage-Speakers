import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LevelsSection } from './components/LevelsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { HostSection } from './components/HostSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { ExerciseGateProvider } from './context/ExerciseGateContext';

export default function App() {
  return (
    <ExerciseGateProvider>
      <Header />
      <Hero />
      <LevelsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <HostSection />
      <FinalCtaSection />
      <Footer />
    </ExerciseGateProvider>
  );
}
