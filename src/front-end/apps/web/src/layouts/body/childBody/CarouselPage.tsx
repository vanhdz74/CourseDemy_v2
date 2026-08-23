"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/shared/components/ui/carousel";
import { useI18n } from "@/modules/shared/i18n";
import { motion } from "framer-motion";

const CarouselPage = () => {
  const { t } = useI18n();
  const images = [
    "/images/banner/banner1.png",
    "/images/banner/banner2.png",
    "/images/banner/banner3.png",
    "/images/banner/banner4.png",
    "/images/banner/banner5.png",
  ];

  const logos = [
    "/logo_ct/Logo-DH-Cong-nghiep-Ha-Noi.webp",
    "/logo_ct/adidas.avif",
    "/logo_ct/images.png",
    "/logo_ct/vecteur-conception-degrade-colore-oiseau_343694-2506.avif",
  ];

  return (
    <section className="pt-12 w-full">
      {/* ================= CAROUSEL ================= */}
      <div className="mx-auto h-[240px] w-full overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-md sm:h-[340px] lg:h-[460px]">
        <Carousel
          plugins={[
            Autoplay({
              delay: 8000,
              stopOnInteraction: false,
            }),
          ]}
          className="relative h-full w-full"
        >
          <CarouselContent className="h-full">
            {images.map((src, index) => (
              <CarouselItem key={src} className="h-full basis-full">
                <div className="relative h-[240px] w-full sm:h-[340px] lg:h-[460px]">
                  <Image
                    src={src}
                    fill
                    alt={`Banner ${index + 1}`}
                    priority={index === 0}
                    quality={100}
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  />

                  {/* Dynamic dark gradient overlay that respects color modes */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/10 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 border-border/50 bg-background/80 text-foreground hover:bg-accent/80 hover:text-accent-foreground backdrop-blur shadow-sm transition-all duration-300" />
          <CarouselNext className="absolute right-4 border-border/50 bg-background/80 text-foreground hover:bg-accent/80 hover:text-accent-foreground backdrop-blur shadow-sm transition-all duration-300" />
        </Carousel>
      </div>

      {/* ================= TRUSTED BY ================= */}
      <div className="mx-auto mt-16 max-w-5xl px-4">
        <h3 className="mb-8 text-center text-xs font-bold tracking-wider uppercase text-muted-foreground/70">
          {t("home.trustedBy")}
        </h3>

        <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
          {logos.map((logo, i) => (
            <div
              key={logo}
              className="relative h-12 w-28 opacity-45 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:invert dark:brightness-[10] dark:hover:brightness-[12]"
            >
              <Image
                src={logo}
                alt={`Partner logo ${i + 1}`}
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselPage;
