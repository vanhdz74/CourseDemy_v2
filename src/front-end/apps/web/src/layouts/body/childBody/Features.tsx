"use client";

import React, { useState, useEffect } from "react";
import { Code2, LineChart, Sparkles, Trophy, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/modules/shared/i18n";
import { Button } from "@/modules/shared/components/ui/button";

const Features = () => {
  const { t } = useI18n();
  const [progressVal, setProgressVal] = useState(0);

  // Animate progress circle when component is in view (or via interval for preview)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressVal((prev) => (prev >= 85 ? 15 : prev + 5));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="introduce" className="w-full py-20 border-t border-border/50">
      {/* Header */}
      <div className="mb-14 flex flex-col gap-3 text-center items-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tính năng cao cấp</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("home.featuresTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("home.featuresDesc")}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Interactive Coding Workspace (spans 2 columns) */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:col-span-2 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5">
          {/* Neon border glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center z-10">
            <div className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {t("home.feature1Title")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("home.feature1Desc")}
              </p>
            </div>

            {/* Interactive Compiler Mockup */}
            <div className="rounded-xl border border-border bg-slate-950 p-4 font-mono text-[11px] text-slate-300 shadow-md">
              <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500">index.js</span>
              </div>
              <p className="text-purple-400">function <span className="text-blue-400">greet</span>() &#123;</p>
              <p className="text-amber-300 pl-4">console.<span className="text-cyan-400">log</span>(<span className="text-emerald-400">&quot;Hello World!&quot;</span>);</p>
              <p className="text-purple-400">&#125;</p>
              <p className="text-blue-400">greet();</p>
              
              <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-[9px] text-slate-500">Output:</span>
                <span className="text-emerald-400 font-semibold">&gt; Hello World!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Smart Progress Tracker (spans 1 column) */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          
          <div className="flex flex-col gap-4 z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("home.feature2Title")}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("home.feature2Desc")}
            </p>
          </div>

          {/* Progress Circular Mockup */}
          <div className="flex items-center justify-center py-4 z-10">
            <div className="relative flex items-center justify-center h-28 w-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/40"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressVal) / 100}
                  className="text-purple-500 transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-foreground">{progressVal}%</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Học tập</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 24/7 AI Code Tutor (spans 1 column) */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          
          <div className="flex flex-col gap-4 z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("home.feature4Title")}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("home.feature4Desc")}
            </p>
          </div>

          {/* Chat Mockup */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-[11px] flex flex-col gap-3 shadow-inner z-10">
            <div className="self-end bg-primary/10 text-primary rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] font-medium">
              Sửa giúp lỗi index out of bounds?
            </div>
            <div className="self-start bg-card border border-border text-foreground rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] font-medium shadow-sm">
              Bạn hãy kiểm tra xem chỉ số có nằm trong khoảng từ <code className="bg-muted px-1 py-0.5 rounded text-rose-500">0</code> đến <code className="bg-muted px-1 py-0.5 rounded text-rose-500">length - 1</code> không nhé!
            </div>
          </div>
        </div>

        {/* Card 4: Verified Certificates (spans 2 columns) */}
        <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:col-span-2 flex flex-col justify-between min-h-[340px] transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-l from-amber-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center z-10">
            <div className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {t("home.feature3Title")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("home.feature3Desc")}
              </p>
            </div>

            {/* Certificate Visual Mockup */}
            <div className="relative aspect-[1.41/1] w-full rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between shadow-md dark:border-amber-500/20">
              <div className="absolute top-2 right-2 text-amber-500/25">
                <Trophy className="w-16 h-16" />
              </div>
              
              <div className="text-center flex flex-col gap-1 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-extrabold text-amber-500">Chứng nhận tốt nghiệp</p>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent w-full" />
              </div>

              <div className="text-center my-3">
                <p className="text-[8px] text-muted-foreground/80">Chứng nhận cho học viên</p>
                <p className="text-sm font-bold tracking-tight text-foreground">Nguyễn Văn A</p>
                <p className="text-[8px] text-muted-foreground/80 mt-1">Đã hoàn thành xuất sắc khóa học lập trình Web</p>
              </div>

              <div className="flex justify-between items-center text-[7px] text-muted-foreground border-t border-amber-500/20 pt-2">
                <span>ID: CD-748927</span>
                <span className="font-mono text-amber-500 font-bold">CourseDemy verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
