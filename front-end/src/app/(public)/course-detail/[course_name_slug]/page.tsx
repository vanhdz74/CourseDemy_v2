"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

import BannerSection from "@/components/course-detail/BannerSection";
import EditBannerSection from "@/components/course-detail/EditBannerSection";
import SidebarSection from "@/components/course-detail/SidebarSection";
import EditSidebarSection from "@/components/course-detail/EditSidebarSection";
import ContentSection from "@/components/course-detail/ContentSection";
import EditContentSection from "@/components/course-detail/EditContentSection";
import { CourseDetail } from "@/types/courseType";

export default function CourseDetailPage() {
  const { get, post, put } = useApi();
  const user = useAppSelector((state) => state.auth.user);
  const courseRedux = useAppSelector((state) => state.course);

  const [data, setData] = useState<CourseDetail>();
  const [isEditing, setIsEditing] = useState(false);

  const [editCourse, setEditCourse] = useState(null);
  const [editDetail, setEditDetail] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);

  const fetchData = async () => {
    try {
      if (courseRedux.courseId) {
        const res = await get(`/course-detail/${courseRedux.courseId}`);
        setData(res);
        setEditCourse(res.course);
        setEditDetail({
          content: res.content,
          description: res.description,
          request: res.request,
          course_include: res.course_include,
        });
      }
    } catch (e) {
      toast.error("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <BannerSection course={data.course} isEditing={isEditing} />

      {isEditing ? (
        <EditBannerSection
          editCourse={editCourse}
          setEditCourse={setEditCourse}
          course={data.course}
        />
      ) : null}

      {isEditing ? (
        <EditSidebarSection
          editCourse={editCourse}
          setEditCourse={setEditCourse}
          editDetail={editDetail}
          setEditDetail={setEditDetail}
          handleImageChange={setEditImageFile}
        />
      ) : (
        <SidebarSection
          course={data}
          user={user}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-0 py-10">
        {!isEditing ? (
          <ContentSection
            content={data.content}
            description={data.description}
            request={data.request}
          />
        ) : (
          <EditContentSection
            editDetail={editDetail}
            setEditDetail={setEditDetail}
          />
        )}
      </div>
    </div>
  );
}
