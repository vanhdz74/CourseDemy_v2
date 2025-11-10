import CardDes from "@/components/common/card-des";
const TrendingCourses = () => {
  return (
    <div id="trend" className="w-full">
      <h1 className="mt-[50px] mb-[15px]">Nội dung</h1>

      {/* Danh sach thinh hanh */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <CardDes
          img="Video"
          title="Hoc JS"
          description="AI code"
          star={0}
          money={299.0}
          trending=""
        />
        <CardDes
          img="Video"
          title="Hoc JS"
          description="AI code"
          star={0}
          money={299.0}
          trending=""
        />
        <CardDes
          img="Video"
          title="Hoc JS"
          description="AI code"
          star={0}
          money={299.0}
          trending=""
        />
        <CardDes
          img="Video"
          title="Hoc JS"
          description="AI code"
          star={0}
          money={299.0}
          trending=""
        />
        <CardDes
          img="Video"
          title="Hoc JS"
          description="AI code"
          star={0}
          money={299.0}
          trending=""
        />
      </div>
    </div>
  );
};

export default TrendingCourses;
