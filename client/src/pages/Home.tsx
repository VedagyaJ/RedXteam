import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedPrograms from '@/components/FeaturedPrograms';
import DashboardPreview from '@/components/DashboardPreview';
import VulnerabilitySubmission from '@/components/VulnerabilitySubmission';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>RedXteam - KnowYourBug, Reward Talent</title>
        <meta name="description" content="Connect with ethical hackers worldwide to find and fix security vulnerabilities before they become threats." />
      </Helmet>
      
      <Hero />
      <HowItWorks />
      <FeaturedPrograms />
      <DashboardPreview />
      <VulnerabilitySubmission />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
