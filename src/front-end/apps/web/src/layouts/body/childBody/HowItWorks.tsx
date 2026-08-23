"use client";

import React from "react";
import { BookOpen, Code, FileCheck2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/modules/shared/i18n";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    titleKey: "home.step1Title",
    descKey: "home.step1Desc",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    number: "02",
    icon: Code,
    titleKey: "home.step2Title",
    descKey: "home.step2Desc",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    number: "03",
    icon: FileCheck2,
    titleKey: "home.step3Title",
    descKey: "home.step3Desc",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const HowItWorks = () => {
  const { t } = useI18n();

  return (
    <section className="w-full py-20 border-t border-border/50">
      {/* Header */}
      <div className="mb-16 flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("home.howItWorksTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("home.howItWorksDesc")}
        </p>
      </div>

      {/* Steps timeline container */}
      <div className="relative mx-auto max-w-5xl px-4">
        {/* Connection Line for Desktop */}
        <div className="absolute top-[52px] left-[15%] right-[15%] hidden h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30 md:block" />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Number badge / bubble */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-card text-foreground font-bold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-primary/5">
                  <span className={`text-sm font-extrabold ${step.color}`}>{step.number}</span>
                </div>

                {/* Card representation */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  {/* Icon container */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.bg} ${step.color} shadow-inner`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {t(step.titleKey)}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
