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
    <section className="pt-8">
      {/* ================= CAROUSEL ================= */}
      <div className="mx-auto h-[240px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:h-[340px] lg:h-[460px]">
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
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-slate-950/5 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-4 border-white/70 bg-white/90 text-slate-800 shadow-sm hover:bg-white" />
          <CarouselNext className="absolute right-4 border-white/70 bg-white/90 text-slate-800 shadow-sm hover:bg-white" />
        </Carousel>
      </div>

      {/* ================= TRUSTED BY ================= */}
      <div className="mx-auto mt-12 max-w-5xl">
        <h3 className="mb-8 text-center text-sm font-medium leading-6 text-slate-500">
          {t("home.trustedBy")}
        </h3>

        <div className="grid grid-cols-2 place-items-center gap-6 md:grid-cols-4">
          {logos.map((logo, i) => (
            <div
              key={logo}
              className="relative h-14 w-32 transition duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={logo}
                alt={`Partner logo ${i + 1}`}
                fill
                sizes="128px"
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
