"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/modules/shared/i18n";
import { cn } from "@/modules/shared/lib/utils";

const FAQ = () => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    { qKey: "home.faqQ1", aKey: "home.faqA1" },
    { qKey: "home.faqQ2", aKey: "home.faqA2" },
    { qKey: "home.faqQ3", aKey: "home.faqA3" },
    { qKey: "home.faqQ4", aKey: "home.faqA4" },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 border-t border-border/50">
      {/* Header */}
      <div className="mb-14 flex flex-col gap-3 text-center items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("home.faqTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("home.faqDesc")}
        </p>
      </div>

      {/* Accordion List */}
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300 bg-card",
                isOpen
                  ? "border-primary/55 shadow-md shadow-primary/5 bg-accent/15"
                  : "border-border/80 hover:border-border hover:bg-accent/40"
              )}
            >
              {/* Question Trigger */}
              <button
                onClick={() => toggleFAQ(idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-bold text-foreground focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={cn("h-5 w-5 shrink-0 transition-colors duration-300", isOpen ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-base sm:text-lg">{t(item.qKey)}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-muted-foreground border-t border-border/30">
                      {t(item.aKey)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
