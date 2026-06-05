import { test, expect } from "@playwright/test";

const course = {
  courseId: 6,
  courseTitle: "The Ultimate React Course 2025: React, Next.js, Redux & More",
};

test.describe("Kiểm thử chức năng xem chi tiết khóa học CourseDemy", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((courseData) => {
      localStorage.setItem("course", JSON.stringify(courseData));
    }, course);

    await page.goto(
      "/course-detail/the-ultimate-react-course-2025-react-next-js-redux-more",
    );
  });

  test("TC_CD_01 - Hiển thị tên khóa học", async ({ page }) => {
    await expect(
      page.getByText(/The Ultimate React Course 2025/i),
    ).toBeVisible();
  });

  test("TC_CD_02 - Hiển thị mô tả ngắn khóa học", async ({ page }) => {
    await expect(
      page.getByText(/Master modern React from beginner to advanced/i),
    ).toBeVisible();
  });

  test("TC_CD_03 - Hiển thị thông tin cơ bản", async ({ page }) => {
    await expect(page.getByText(/1 học viên/i)).toBeVisible();
    await expect(page.getByText(/Web Development/i)).toBeVisible();
    await expect(page.getByText(/Giảng viên:\s*VanhFE/i)).toBeVisible();
  });

  test("TC_CD_04 - Hiển thị nội dung khóa học", async ({ page }) => {
    await expect(page.getByText(/Nội dung khóa học/i)).toBeVisible();

    await expect(
      page.getByText(
        /Become an advanced, confident, and modern React developer/i,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(/Build 10\+ beautiful projects/i),
    ).toBeVisible();

    await expect(page.getByText(/Become job-ready/i)).toBeVisible();
  });

  test("TC_CD_05 - Hiển thị chương trình học", async ({ page }) => {
    await expect(page.getByText(/Chương trình học/i)).toBeVisible();
    await expect(page.getByText(/2 bài học/i)).toBeVisible();

    await expect(page.getByText(/Bài 1/i)).toBeVisible();
    await expect(page.getByText(/React JS \?/i)).toBeVisible();

    await expect(page.getByText(/Bài 2/i)).toBeVisible();
    await expect(page.getByText(/Cài đặt môi trường/i)).toBeVisible();
  });

  test("TC_CD_06 - Hiển thị phần Bạn sẽ học được gì", async ({ page }) => {
    await expect(page.getByText(/Bạn sẽ học được gì/i)).toBeVisible();

    await expect(
      page.getByText(/Just launched 16 BONUS hours of Next.js content/i),
    ).toBeVisible();

    await expect(
      page.getByText(
        /Take this course after taking my #1 bestselling JavaScript course/i,
      ),
    ).toBeVisible();
  });

  test("TC_CD_07 - Hiển thị phần Yêu cầu", async ({ page }) => {
    await expect(page.getByText(/Yêu cầu/i)).toBeVisible();

    await expect(
      page.getByText(/NO React experience necessary/i),
    ).toBeVisible();

    await expect(
      page.getByText(/Basic understanding of JavaScript is required/i),
    ).toBeVisible();

    await expect(page.getByText(/Windows, macOS or Linux/i)).toBeVisible();
  });

  test("TC_CD_08 - Hiển thị phản hồi học viên", async ({ page }) => {
    await expect(page.getByText(/Phản hồi của học viên/i)).toBeVisible();
    await expect(page.getByText("5.0")).toBeVisible();
    await expect(page.getByText(/Điểm trung bình/i)).toBeVisible();

    await expect(page.getByText(/Hoang Viet Anh/i)).toBeVisible();
    await expect(page.getByText(/Rất hay/i)).toBeVisible();
  });

  test("TC_CD_09 - Kiểm tra dữ liệu ngày hợp lệ", async ({ page }) => {
    const dateText = await page
      .getByText(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)
      .first()
      .innerText();

    const year = Number(dateText.split("/")[2].split(" ")[0]);

    expect(year).toBeGreaterThanOrEqual(2020);
  });
});
