import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const CarouselPage = () => {
  const images = [
    "/images/banner/banner1.png",
    "/images/banner/banner2.png",
    "/images/banner/banner3.png",
    "/images/banner/banner4.png",
    "/images/banner/banner5.png",
  ];

  const logos = ["/logo1.png", "/logo2.png", "/logo3.png", "/logo4.png"];

  return (
    <div>
      {/* ================= CAROUSEL ================= */}
      <div
        className="w-full mx-auto my-[10px] rounded-xl overflow-hidden shadow-md"
        style={{ height: "var(--carousel-height)" }}
      >
        <Carousel
          plugins={[Autoplay({ delay: 8000 })]}
          className="w-full h-full relative"
        >
          <CarouselContent className="h-full">
            {images.map((src, index) => (
              <CarouselItem key={index} className="h-full basis-full">
                <Card
                  className="w-full h-full"
                  style={{
                    height: "var(--carousel-height)",
                  }}
                >
                  <CardContent className="w-full h-full">
                    <div className="relative w-full h-full">
                      <Image
                        src={src}
                        fill
                        alt="Banner"
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-[10px]" />
          <CarouselNext className="absolute right-[10px]" />
        </Carousel>
      </div>

      {/* ================= TRUSTED BY ================= */}
      <div className="mx-auto max-w-[90%] mt-[40px]">
        <h3
          className="text-center mb-[30px] font-semibold"
          style={{ fontSize: "var(--font-size-des)" }}
        >
          Được hơn 17.000 công ty và hàng triệu học viên trên khắp thế giới tin
          dùng
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="w-28 h-12 relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
            >
              <Image src={logo} alt="Logo" fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselPage;
