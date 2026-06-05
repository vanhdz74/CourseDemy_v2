// -------------------- DetailSections --------------------
type CourseDetailForm = {
  content: string;
  request: string;
  description: string;
  course_include: string;
};

export const DetailSections: React.FC<{
  isEditing: boolean;
  content: string;
  description: string;
  request: string;
  editDetail: CourseDetailForm;
  setEditDetail: (d: CourseDetailForm) => void;
}> = ({
  isEditing,
  content,
  description,
  request,
  editDetail,
  setEditDetail,
}) => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Nội dung khóa học
        </h2>
        {!isEditing ? (
          <div className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {content}
          </div>
        ) : (
          <textarea
            className="mt-3 min-h-44 w-full rounded-lg border border-input bg-background p-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            value={editDetail?.content}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, content: e.target.value })
            }
          />
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Bạn sẽ học được gì
        </h2>
        {!isEditing ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : (
          <textarea
            className="mt-3 min-h-36 w-full rounded-lg border border-input bg-background p-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            value={editDetail?.description}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, description: e.target.value })
            }
          />
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Yêu cầu
        </h2>
        {!isEditing ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {request}
          </p>
        ) : (
          <textarea
            className="mt-3 min-h-32 w-full rounded-lg border border-input bg-background p-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            value={editDetail?.request}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, request: e.target.value })
            }
          />
        )}
      </section>
    </div>
  );
};
