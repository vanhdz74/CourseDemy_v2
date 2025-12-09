// -------------------- DetailSections --------------------
export const DetailSections: React.FC<{
  isEditing: boolean;
  content: string;
  description: string;
  request: string;
  editDetail: any;
  setEditDetail: (d: any) => void;
}> = ({
  isEditing,
  content,
  description,
  request,
  editDetail,
  setEditDetail,
}) => {
  return (
    <>
      <section className="border p-5">
        <h2 className="text-2xl font-bold mb-3">Nội dung khóa học</h2>
        {!isEditing ? (
          <div className="text-gray-700 leading-relaxed">{content}</div>
        ) : (
          <textarea
            className="border p-2 rounded w-full lg:w-full"
            value={editDetail?.content}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, content: e.target.value })
            }
          />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Bạn sẽ học được gì</h2>
        {!isEditing ? (
          <p className="text-gray-700 leading-relaxed">{description}</p>
        ) : (
          <textarea
            className="border p-2 rounded w-full lg:w-full"
            value={editDetail?.description}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, description: e.target.value })
            }
          />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Yêu cầu</h2>
        {!isEditing ? (
          <p className="text-gray-700 leading-relaxed">{request}</p>
        ) : (
          <textarea
            className="border p-2 rounded w-full lg:w-full"
            value={editDetail?.request}
            onChange={(e) =>
              setEditDetail({ ...editDetail!, request: e.target.value })
            }
          />
        )}
      </section>
    </>
  );
};
