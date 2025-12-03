"use client";

interface VideoCourseProps {
  subLesson?: {
    title: string;
    video_url: string;
  } | null;
}

const VideoCourse = ({ subLesson }: VideoCourseProps) => {
  if (!subLesson) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-gray-500 italic">
        Chọn một bài học để bắt đầu xem video 🎥
      </div>
    );
  }

  return (
    <div className="h-[75vh] flex flex-col">
      {/* Video wrapper giữ tỉ lệ */}
      <div className="relative w-full aspect-video bg-black">
        <video
          key={subLesson.video_url}
          src={subLesson.video_url}
          controls
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default VideoCourse;
