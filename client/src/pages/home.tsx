import React from "react";
import { User } from "@shared/schema";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import ProgramsSection from "@/components/home/programs-section";
import LeaderboardSection from "@/components/home/leaderboard-section";
import SubmissionProcess from "@/components/home/submission-process";
import DashboardPreview from "@/components/home/dashboard-preview";
import Testimonials from "@/components/home/testimonials";
import CtaSection from "@/components/home/cta-section";

interface HomeProps {
  user: Omit<User, "password"> | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <div>
      <HeroSection user={user} />
      <FeaturesSection />
      <ProgramsSection />
      <LeaderboardSection />
      <SubmissionProcess />
      <DashboardPreview />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
