import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonial } from '@/components/landing/Testimonial';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="dark:bg-[#0a0a0a] bg-white min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonial />
      <CTA />
      <Footer />
    </main>
  );
}