"use client";

import CardDes from "@/components/common/card-des";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const TrendingCourses = () => {
  const { get } = useApi();
  const [topCourses, setTopCourses] = useState<any[]>([]);

  const getTopCourses = async () => {
    try {
      const data = await get("/revenue/top-courses");
      setTopCourses(data);
    } catch (error) {
      console.error("Lỗi lấy top courses", error);
    }
  };

  useEffect(() => {
    getTopCourses();
  }, []);

  return (
    <div id="trend" className="w-full">
      <h1 className="mt-[50px] mb-10 font-bold text-2xl">
        Các khoá học đang thịnh hành
      </h1>

      {/* Danh sách thịnh hành */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topCourses.map((item, index) => (
          <CardDes
            courseId={item.course.id}
            key={item.course.id ?? index}
            img={item.course.course_img}
            title={item.course.title}
            description={item.course.description}
            star={5} // nếu sau này có rating thì map vào
            money={Number(item.course.price)}
            trending={`${item.students} học viên`}
            students={item.course.quantity}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingCourses;
