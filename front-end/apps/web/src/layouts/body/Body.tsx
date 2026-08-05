import NavMenu from "../header/NavBar";
import CarouselPage from "./childBody/CarouselPage";
import Categories from "./childBody/Categories";
import IntroduceWeb from "./childBody/IntroduceWeb";
import TrendingCourses from "./childBody/TrendingCourses";

const Body = () => {
  return (
    <div className="mx-auto">
      <NavMenu />
      <Categories />
      <CarouselPage />
      <TrendingCourses />
      <IntroduceWeb />
    </div>
  );
};

export default Body;
