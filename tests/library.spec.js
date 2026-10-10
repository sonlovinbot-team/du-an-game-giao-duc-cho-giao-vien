import { test, expect } from "@playwright/test";
test("library search, filters, saved games, details and keyboard", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".game-card")).toHaveCount(20);
  await page.getByRole("button", { name: "3D", exact: true }).click();
  await expect(page.locator(".game-card")).toHaveCount(10);
  await page
    .getByRole("button", { name: "Tất cả", exact: true })
    .last()
    .click();
  await page.getByRole("textbox", { name: "Tìm trò chơi" }).fill("o an quan");
  await expect(page.locator(".game-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Lưu Ô ăn quan", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem trò chơi Ô ăn quan" }).click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: /Trò chơi đã lưu/ }).click();
  await expect(page.locator(".game-card")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: /Trò chơi đã lưu/ }).click();
  await expect(page.locator(".game-card")).toHaveCount(1);
  await page
    .getByRole("textbox", { name: "Tìm trò chơi" })
    .fill("doesnotexist");
  await expect(page.getByText("Chưa tìm thấy trò chơi phù hợp")).toBeVisible();
  await page.getByRole("button", { name: "Xoá bộ lọc" }).click();
  await expect(page.locator(".game-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("save and reopen a teacher lesson with ordered games", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Soạn tiết học" }).click();
  await page.getByLabel("Tên tiết học").fill("Hành trình thứ hai");
  await page
    .getByLabel("Mục tiêu của tiết học")
    .fill("Học quy luật và bảo vệ môi trường");
  await page
    .locator(".picker-grid button")
    .filter({ hasText: "Ô ăn quan" })
    .click();
  await page
    .locator(".picker-grid button")
    .filter({ hasText: "Nông trại tí hon" })
    .click();
  await page.getByRole("button", { name: /Lưu tiết học/ }).click();
  await expect(page.locator(".saved-lessons article")).toHaveCount(1);
  await page.reload();
  await page
    .getByRole("button", { name: "Tiết học của tôi", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hành trình thứ hai" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Bắt đầu tiết học" }).click();
  await expect(page).toHaveURL(/#play\/o-an-quan/);
  await page.getByRole("button", { name: "Trò tiếp theo" }).click();
  await expect(page).toHaveURL(/#play\/nong-trai/);
  await page.getByRole("button", { name: "Kết thúc tiết học" }).click();
  await expect(page.locator(".lessons-page")).toBeVisible();
});
test("mobile library and desktop visual screenshots", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "screenshots/library-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "screenshots/library-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page
    .getByRole("button", { name: "Tiết học của tôi", exact: true })
    .click();
  await expect(page.locator(".lessons-page")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page
    .getByRole("button", { name: "Hướng dẫn sử dụng", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Mở trò chơi. Mở trí tò mò." }),
  ).toBeVisible();
});
