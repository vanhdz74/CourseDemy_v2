"use client";

import Link from "next/link";
import { Award, ArrowRight, Globe2, GraduationCap, Play, Terminal } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/modules/shared/components/ui/button";
import { useI18n } from "@/modules/shared/i18n";

const benefits = [
  {
    icon: GraduationCap,
    titleKey: "home.benefits.expertTitle",
    descKey: "home.benefits.expertDesc",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Globe2,
    titleKey: "home.benefits.anytimeTitle",
    descKey: "home.benefits.anytimeDesc",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Award,
    titleKey: "home.benefits.certificateTitle",
    descKey: "home.benefits.certificateDesc",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
];

const IntroduceWeb = () => {
  const { t } = useI18n();

  return (
    <section
      id="home"
      className="relative min-h-[85vh] w-full overflow-hidden rounded-[2.5rem] border border-border bg-background px-6 py-12 md:py-20 lg:px-12 flex flex-col justify-center"
    >
      {/* Background Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow Top Left */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[100px] dark:bg-primary/15" />
        {/* Glow Bottom Right */}
        <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-purple-500/8 blur-[100px] dark:bg-purple-500/12" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left: Headline & Actions */}
        <div className="text-left lg:col-span-7 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex self-start items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t("home.introBadge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {t("home.introTitle")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t("home.introDescription")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Link href="/courses/search">
                {t("home.startNow")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border bg-background/50 px-8 text-foreground transition-all duration-300 hover:bg-accent hover:scale-105 active:scale-95"
            >
              <Link href="/courses">
                <Play className="mr-2 h-4 w-4 text-primary fill-primary/10" />
                {t("home.viewCourses")}
              </Link>
            </Button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-4 border-t border-border/60 pt-8 mt-4"
          >
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">15k+</p>
              <p className="text-xs text-muted-foreground">Học viên tích cực</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">120+</p>
              <p className="text-xs text-muted-foreground">Khóa học lập trình</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">Học viên hài lòng</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Mock IDE / Code Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="lg:col-span-5 relative"
        >
          {/* Decorative glowing card shadow behind */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 opacity-20 blur-xl dark:opacity-30" />
          
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 text-white shadow-2xl">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>learn_coding.js</span>
              </div>
              <div className="w-12" />
            </div>
            
            {/* Editor Workspace */}
            <div className="p-6 font-mono text-[12px] leading-relaxed text-slate-300 overflow-x-auto min-h-[220px]">
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">1</span>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">courseDemy</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">Platform</span>();
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">2</span>
                <div>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">student</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">Learner</span>(<span className="text-emerald-400">"You"</span>);
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">3</span>
                <div>&nbsp;</div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">4</span>
                <div>
                  <span className="text-blue-400">student</span>.<span className="text-cyan-400">enroll</span>(<span className="text-blue-400">courseDemy</span>.<span className="text-cyan-400">getBestCourse</span>());
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">5</span>
                <div>
                  <span className="text-blue-400">student</span>.<span className="text-cyan-400">practiceDaily</span>({"{"} <span className="text-orange-400">lessons</span>: <span className="text-amber-400">1</span>, <span className="text-orange-400">codeChallenge</span>: <span className="text-purple-400">true</span> {"}"});
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">6</span>
                <div>&nbsp;</div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">7</span>
                <div>
                  <span className="text-purple-400">if</span> (<span className="text-blue-400">student</span>.<span className="text-cyan-400">isReadyToGraduate</span>()) {"{"}
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">8</span>
                <div className="pl-4">
                  <span className="text-blue-400">student</span>.<span className="text-cyan-400">claimCertificate</span>(); <span className="text-slate-500">// Level Up!</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 select-none text-right w-4">9</span>
                <div>{"}"}</div>
              </div>
            </div>
            
            {/* Visual simulation run panel */}
            <div className="border-t border-white/10 bg-slate-900/60 p-3 px-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Console: Ready</span>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Compilation Successful
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits grid at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 grid gap-5 sm:grid-cols-3"
      >
        {benefits.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={item.titleKey}
              className="group relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-accent/40"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-inner`}>
                <Icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>

              <h3 className="text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                {t(item.titleKey)}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(item.descKey)}
              </p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default IntroduceWeb;
