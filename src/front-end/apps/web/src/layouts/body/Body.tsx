"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import NavMenu from "../header/NavBar";
import CarouselPage from "./childBody/CarouselPage";
import Categories from "./childBody/Categories";
import IntroduceWeb from "./childBody/IntroduceWeb";
import TrendingCourses from "./childBody/TrendingCourses";
import Features from "./childBody/Features";
import HowItWorks from "./childBody/HowItWorks";
import FAQ from "./childBody/FAQ";

const ScrollReveal = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 35 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0.35 : 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Body = () => {
  return (
    <div className="mx-auto flex flex-col gap-6 pb-20">
      {/* 1. Sticky sub-navigation */}
      <NavMenu />
      
      {/* 2. Hero Section (IntroduceWeb) - Rendered at top without scroll reveal because it's first view */}
      <IntroduceWeb />
      
      {/* 3. Categories horizontal selector */}
      <ScrollReveal>
        <Categories />
      </ScrollReveal>
      
      {/* 4. Carousel banners & Trusted Partners */}
      <ScrollReveal>
        <CarouselPage />
      </ScrollReveal>
      
      {/* 5. Trending Courses */}
      <ScrollReveal>
        <TrendingCourses />
      </ScrollReveal>
      
      {/* 6. Bento Grid Features Showcase (NEW) */}
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      
      {/* 7. How It Works - Step sequence timeline (NEW) */}
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      
      {/* 8. FAQ Accordion (NEW) */}
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
    </div>
  );
};

export default Body;
