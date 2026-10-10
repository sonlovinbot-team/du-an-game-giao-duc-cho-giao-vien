import { test, expect } from "@playwright/test";
import { games } from "../src/catalog.js";
test("grade filter and subject selection return the matching catalogue", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Khối lớp").selectOption("5");
  await expect(page.locator(".game-card")).toHaveCount(
    games.filter((g) => g.gradeMin <= 5 && g.gradeMax >= 5).length,
  );
  await page.getByRole("button", { name: "Văn hoá Việt", exact: true }).click();
  await expect(page.locator(".game-card")).toHaveCount(
    games.filter((g) => g.category === "Văn hoá Việt" && g.gradeMax >= 5)
      .length,
  );
});
test("mobile menu contains focus and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".sidebar")).not.toBeVisible();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu chính" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Đóng menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(
      () => document.activeElement.closest(".sidebar") !== null,
    ),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(page.locator(".sidebar")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
});
test("game timer retains keyboard focus and detail dialog is named", async ({
  page,
}) => {
  await page.goto("/#play/sudoku");
  const button = page.getByRole("button", {
    name: "Tắt âm thanh",
    exact: true,
  });
  await button.focus();
  await expect(page.locator(".elapsed")).toContainText("0:02", {
    timeout: 5000,
  });
  await expect(button).toBeFocused();
  await page.getByRole("button", { name: "Mục tiêu bài học" }).click();
  await expect(
    page.getByRole("dialog", { name: "Sudoku sắc màu" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Mục tiêu bài học" }),
  ).toBeFocused();
});
test("stale local data safely falls back to an empty collection", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("hatmam-saved", "{}");
    localStorage.setItem(
      "hatmam-lessons",
      JSON.stringify([{ title: "old", games: ["unknown"] }]),
    );
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".game-card")).toHaveCount(20);
  await page
    .getByRole("button", { name: "Tiết học của tôi", exact: true })
    .click();
  await expect(page.locator(".saved-lessons article")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("storage failure is visible instead of falsely confirming persistence", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await page
    .getByRole("button", { name: "Lưu Ô ăn quan", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("không thể lưu dữ liệu");
});
