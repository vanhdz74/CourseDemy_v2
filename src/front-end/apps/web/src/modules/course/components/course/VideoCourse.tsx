"use client";

import { SubLesson } from "@repo/contracts";
import { PlayCircle } from "lucide-react";

interface VideoCourseProps {
  subLesson?: SubLesson | null;
}

const VideoCourse = ({ subLesson }: VideoCourseProps) => {
  if (!subLesson) {
    return (
      <div className="flex h-[52vh] min-h-[380px] items-center justify-center bg-slate-950 px-6 text-center text-slate-300 xl:h-[58vh]">
        <div>
          <PlayCircle className="mx-auto h-12 w-12 text-slate-500" />
          <p className="mt-4 text-base font-medium text-slate-100">
            Chọn một bài học để bắt đầu xem video
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Danh sách bài học nằm ở cột bên cạnh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-slate-950">
      <div className="relative mx-auto h-[52vh] min-h-[380px] w-full max-w-6xl xl:h-[68vh]">
        {subLesson.video_url ? (
          <video
            key={subLesson.video_url}
            src={subLesson.video_url}
            controls
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-slate-300">
            <div>
              <PlayCircle className="mx-auto h-12 w-12 text-slate-500" />
              <p className="mt-4 text-base font-medium text-slate-100">
                Bài học chưa có video
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Giảng viên có thể cập nhật video trong menu bài học.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoCourse;
