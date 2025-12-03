"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const IntroduceWeb = () => {
  return (
    <div
      id="introduce"
      className="relative mt-[50px] flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white h-[600px] px-4"
    >
      {/* Optional background illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/banner/banner1.png" // đặt hình minh họa ở public/images
          alt="Background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Chương trình hướng tới mục tiêu của bạn
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-white/90">
          Học mọi lúc, mọi nơi, từ các chuyên gia hàng đầu. Nâng tầm kỹ năng của
          bạn và đạt mục tiêu nhanh hơn.
        </p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md">
          Bắt đầu học ngay
        </Button>
      </div>

      {/* Optional bottom icons / benefits */}
      <div className="relative z-10 flex flex-wrap justify-center mt-12 gap-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
            🎓
          </div>
          <span className="text-sm">Học từ chuyên gia</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
            🌐
          </div>
          <span className="text-sm">Học mọi lúc mọi nơi</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
            🏆
          </div>
          <span className="text-sm">Chứng chỉ sau khóa học</span>
        </div>
      </div>
    </div>
  );
};

export default IntroduceWeb;
