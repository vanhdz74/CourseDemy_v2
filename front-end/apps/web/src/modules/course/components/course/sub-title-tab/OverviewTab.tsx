import { CourseDetail } from "@repo/contracts";
import { BookOpenCheck, CheckCircle2, ClipboardList } from "lucide-react";

function splitContent(value?: string) {
  return (value || "")
    .split(/\n|\.|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const OverviewTab = ({ courseDetail }: { courseDetail?: CourseDetail }) => {
  const outcomes = splitContent(courseDetail?.content);
  const includes = splitContent(courseDetail?.course_include);

  return (
    <div className="mx-auto max-w-5xl space-y-5 text-left">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {courseDetail?.course.title || "Tổng quan khóa học"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {courseDetail?.course.description ||
            "Thông tin tổng quan của khóa học đang được cập nhật."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Bạn sẽ học được gì</h3>
          </div>
          <div className="mt-4 space-y-3">
            {outcomes.length > 0 ? (
              outcomes.map((item, index) => (
                <div key={`${item}-${index}`} className="flex gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-6 text-muted-foreground">{item}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Kết quả học tập đang được cập nhật.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Yêu cầu đầu vào</h3>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {courseDetail?.request || "Không có yêu cầu đặc biệt trước khi bắt đầu."}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Khóa học bao gồm</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {includes.length > 0 ? (
            includes.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nội dung khóa học đang được cập nhật.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;
