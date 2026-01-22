import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/landing/HeroSection';
import { DemoWidgetSection } from '@/components/landing/DemoWidgetSection';
import { UsingWeepSection } from '@/components/landing/UsingWeepSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DemoWidgetSection />
      <UsingWeepSection />
    </Layout>
  );
};

export default Index;
