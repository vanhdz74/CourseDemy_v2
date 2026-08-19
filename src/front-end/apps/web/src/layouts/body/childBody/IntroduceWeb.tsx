"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight, Globe2, GraduationCap } from "lucide-react";

import { Button } from "@/modules/shared/components/ui/button";
import { useI18n } from "@/modules/shared/i18n";

const benefits = [
  {
    icon: GraduationCap,
    titleKey: "home.benefits.expertTitle",
    descKey: "home.benefits.expertDesc",
  },
  {
    icon: Globe2,
    titleKey: "home.benefits.anytimeTitle",
    descKey: "home.benefits.anytimeDesc",
  },
  {
    icon: Award,
    titleKey: "home.benefits.certificateTitle",
    descKey: "home.benefits.certificateDesc",
  },
];

const IntroduceWeb = () => {
  const { t } = useI18n();

  return (
    <section
      id="introduce"
      className="relative mt-10 overflow-hidden rounded-[2rem] border border-border bg-slate-950 px-5 py-16 text-white shadow-sm sm:px-8 lg:px-12"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner/banner1.png"
          alt="CourseDemy learning banner"
          fill
          priority
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/80" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {t("home.introBadge")}
        </div>

        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {t("home.introTitle")}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          {t("home.introDescription")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group rounded-full bg-white px-6 text-slate-950 shadow-lg shadow-white/10 hover:bg-slate-100"
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
            className="rounded-full border-white/15 bg-white/5 px-6 text-white backdrop-blur hover:bg-white/10 hover:text-white"
          >
            <Link href="/courses">{t("home.viewCourses")}</Link>
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <div className="relative z-10 mt-12 grid gap-4 sm:grid-cols-3">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.titleKey}
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.1]"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 transition group-hover:bg-white/15">
                <Icon className="h-6 w-6 text-purple-200" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                {t(item.titleKey)}
              </h3>

              <p className="mt-1 text-sm text-slate-300">{t(item.descKey)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default IntroduceWeb;
