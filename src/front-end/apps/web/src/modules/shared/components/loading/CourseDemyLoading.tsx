import Image from "next/image";

type CourseDemyLoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function CourseDemyLoading({
  label = "Đang tải",
  fullScreen = true,
}: CourseDemyLoadingProps) {
  return (
    <div
      className={
        fullScreen
          ? "coursedemy-loader min-h-screen"
          : "coursedemy-loader min-h-80"
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="coursedemy-loader__logo" aria-hidden="true">
        <Image src="/logo/favicon.png" alt="" width={54} height={54} priority />
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}
