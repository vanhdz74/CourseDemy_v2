import React from "react";
export async function generateStaticParams() {
  return [
    {
      course_id: "placeholder",
    },
  ];
}

const CourseDetailPage = () => {
  return (
    <div>
      Chi tiết khoá học
      <div>Block</div>
    </div>
  );
};

export default CourseDetailPage;
