import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/landing/HeroSection';
import { DemoWidget } from '@/components/landing/DemoWidget';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { UsingWeepSection } from '@/components/landing/UsingWeepSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DemoWidget />
      <FeaturesSection />
      <UsingWeepSection />
    </Layout>
  );
};

export default Index;
