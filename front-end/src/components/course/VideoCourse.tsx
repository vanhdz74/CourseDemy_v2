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
      {/* Video player */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full aspect-video bg-black overflow-hidden">
          <video
            key={subLesson.video_url}
            src={subLesson.video_url}
            controls
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Tiêu đề bài học */}
      <h2 className="text-xl font-semibold mt-4 px-4">{subLesson.title}</h2>
    </div>
  );
};

export default VideoCourse;
