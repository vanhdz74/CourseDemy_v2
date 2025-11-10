"use client";
import NavMenu from "../header/NavBar";
import CarouselPage from "./childBody/CarouselPage";
import Categories from "./childBody/Categories";
import IntroduceWeb from "./childBody/IntroduceWeb";
import { ProgressDemo } from "./childBody/Progress";
import TrendingCourses from "./childBody/TrendingCourses";

const Body = () => {
  return (
    <div className="px-[20px] mx-auto mt-[var(--navHeight)]">
      {/* <ProgressDemo /> */}
      <NavMenu />
      <Categories />
      <CarouselPage />
      <TrendingCourses />
      <IntroduceWeb />
    </div>
  );
};

export default Body;
