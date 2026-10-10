import { test, expect } from "@playwright/test";
import * as THREE from "three";
const scenarios = {
  "nong-trai": [
    "🌾 Lúa",
    "Nhiều nước",
    "🪷 Sen",
    "Ao nước",
    "🥕 Cà rốt",
    "Đất tơi",
    "🌵 Xương rồng",
    "Đất khô",
  ],
  "he-mat-troi": [
    "Thủy",
    "Kim",
    "Trái Đất",
    "Hỏa",
    "Mộc",
    "Thổ",
    "Thiên Vương",
    "Hải Vương",
  ],
  "xay-cau": [
    "+ Thanh 3 m",
    "+ Thanh 4 m",
    "Thử cầu →",
    "+ Thanh 4 m",
    "+ Thanh 4 m",
    "+ Thanh 1 m",
    "Thử cầu →",
    "+ Thanh 4 m",
    "+ Thanh 4 m",
    "Thử cầu →",
  ],
  "khoi-hinh": ["3", "2", "4"],
  "dua-thuyen": [
    "Làn 2: 13",
    "Làn 1: 21",
    "Làn 3: 23",
    "Làn 2: 32",
    "Làn 1: 42",
  ],
  "phong-thi-nghiem": [
    "Đỏ",
    "Vàng",
    "Pha màu ✦",
    "Vàng",
    "Lam",
    "Pha màu ✦",
    "Đỏ",
    "Lam",
    "Pha màu ✦",
  ],
  "khung-long": [
    "Ô đất 1",
    "Ô đất 6",
    "Ô đất 2",
    "Ô đất 5",
    "Ô đất 3",
    "Ô đất 8",
    "Ô đất 4",
    "Ô đất 7",
  ],
  "ban-do-viet": [
    "Miền Bắc",
    "Miền Trung",
    "Miền Nam",
    "Miền Bắc",
    "Miền Trung",
    "Miền Nam",
  ],
  "thanh-pho-xanh": [
    "Công viên · 2 xu · +3 xanh",
    "Công viên · 2 xu · +3 xanh",
    "Điện mặt trời · 3 xu · +4 xanh",
    "Thư viện · 2 xu · +2 xanh",
  ],
  "den-long": ["🔴 Đỏ", "🟡 Vàng", "🟢 Xanh"],
};
for (const [id, steps] of Object.entries(scenarios)) {
  test(`3D ${id} completes and restarts`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/#play/${id}`);
    await expect(page.locator(".g3-scene canvas")).toBeVisible();
    await expect(page.locator(".g3-fallback")).toHaveCount(0);
    for (const name of steps)
      await page
        .locator(".g3-panel")
        .getByRole("button", { name, exact: true })
        .click();
    await expect(page.locator(".g3-feedback")).toContainText("Tuyệt vời!");
    await expect(page.locator(".result-badge")).toBeVisible();
    await page
      .getByRole("button", { name: "Chơi một lần nữa →", exact: true })
      .click();
    await expect(page.locator(".g3-feedback")).not.toContainText("Tuyệt vời!");
    await expect(page.locator(".result-badge")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
test("3D farm supports raycast and mobile viewport", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#play/nong-trai");
  await page
    .locator(".g3-panel")
    .getByRole("button", { name: "🌾 Lúa", exact: true })
    .click();
  const canvas = page.locator(".g3-scene canvas");
  await expect(canvas).toBeVisible();
  const bounds = await canvas.boundingBox();
  const camera = new THREE.PerspectiveCamera(
    38,
    bounds.width / bounds.height,
    0.1,
    100,
  );
  const narrow = bounds.width / bounds.height < 1.1;
  camera.position.set(narrow ? 12 : 10, narrow ? 16 : 9, narrow ? 21 : 15);
  camera.lookAt(0, -1, 0);
  camera.zoom = narrow ? 1.22 : 1.55;
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();
  const point = new THREE.Vector3(-1.7, 0.12, -0.5).project(camera);
  await canvas.click({
    position: {
      x: ((point.x + 1) / 2) * bounds.width,
      y: ((1 - point.y) / 2) * bounds.height,
    },
  });
  await expect(
    page.getByRole("button", { name: "✓ Nhiều nước", exact: true }),
  ).toBeDisabled();
  await page.screenshot({ path: "screenshots/farm.png", fullPage: true });
  await page.mouse.move(
    bounds.x + bounds.width * 0.45,
    bounds.y + bounds.height * 0.45,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width * 0.62,
    bounds.y + bounds.height * 0.55,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(page.locator(".g3-prompt>span")).toHaveText("1/4");
  await page
    .getByRole("button", { name: "Khôi phục góc nhìn", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(canvas).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator(".g3-panel")
    .getByRole("button", { name: "🪷 Sen", exact: true })
    .click();
  await page
    .locator(".g3-panel")
    .getByRole("button", { name: "Ao nước", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "✓ Ao nước", exact: true }),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});
