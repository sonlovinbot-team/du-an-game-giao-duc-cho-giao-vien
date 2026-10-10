import { test, expect } from "@playwright/test";
test.describe.configure({ mode: "serial" });
const runtimeErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  const errors = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page) || [], "No uncaught browser errors").toEqual(
    [],
  );
});
async function open(page, id) {
  await page.goto(`/#play/${id}`);
  await expect(page.locator(".g2-root")).toBeVisible();
}
async function complete(page) {
  await expect(
    page.getByRole("heading", { name: "Em làm tốt lắm!" }),
  ).toBeVisible();
  await expect(page.locator(".result-badge")).toBeVisible();
}
test("ô ăn quan distributes stones, alternates turns and completes", async ({
  page,
}) => {
  await open(page, "o-an-quan");
  let turns = 0;
  while (await page.locator(".g2-pit").count()) {
    await page.locator(".g2-pit.g2-own:not(:disabled)").first().click();
    turns++;
    if (turns > 20) throw Error("Exceeded 20 turns");
  }
  await complete(page);
  await page.getByRole("button", { name: "Chơi thêm một lần" }).click();
  await expect(page.locator(".g2-pit")).toHaveCount(12);
  await expect(page.locator(".result-badge")).toHaveCount(0);
});
test("letters reorder into three Vietnamese words", async ({ page }) => {
  await open(page, "ghep-chu");
  for (const word of ["HOASEN", "TRƯỜNGHỌC", "CÂYTRE"]) {
    for (const letter of [...word])
      await page
        .locator(".g2-letterbank")
        .getByRole("button", { name: letter, exact: true })
        .filter({ visible: true })
        .and(page.locator("button:not(:disabled)"))
        .first()
        .click();
    await page.getByRole("button", { name: "Kiểm tra từ" }).click();
  }
  await complete(page);
});
test("memory matches picture and name using visible card reveals", async ({
  page,
}) => {
  await open(page, "lat-the");
  const cards = page.locator(".g2-memory button");
  const seen = {};
  for (let i = 0; i < 12; i += 2) {
    await cards.nth(i).click();
    await cards.nth(i + 1).click();
    seen[(await cards.nth(i).textContent()).trim()] = i;
    seen[(await cards.nth(i + 1).textContent()).trim()] = i + 1;
    await expect(
      page.locator(".g2-memory .g2-flipped:not(.g2-matched)"),
    ).toHaveCount(0);
  }
  for (const pair of [
    ["🪷", "Hoa sen"],
    ["🎋", "Cây tre"],
    ["🍚", "Hạt gạo"],
    ["🏮", "Đèn lồng"],
    ["🪁", "Cánh diều"],
    ["🥁", "Trống hội"],
  ]) {
    const a = cards.nth(seen[pair[0]]);
    if (await page.locator(".g2-celebration").count()) break;
    if (!(await a.getAttribute("class")).includes("g2-matched")) {
      await a.click();
      await cards.nth(seen[pair[1]]).click();
      await expect(
        page.locator(".g2-memory .g2-flipped:not(.g2-matched)"),
      ).toHaveCount(0);
    }
  }
  await complete(page);
});
test("fractions provide feedback and accept visual portion selection", async ({
  page,
}) => {
  await open(page, "phan-so");
  await page.getByRole("button", { name: "Xong rồi!" }).click();
  await expect(page.getByRole("status")).toContainText("Hãy tô đúng");
  for (const n of [1, 3, 2]) {
    for (let i = 0; i < n; i++)
      await page.locator(".g2-fraction-scene path").nth(i).click();
    await page.getByRole("button", { name: "Xong rồi!" }).click();
  }
  await complete(page);
});
test("rebus supports hint and validates Vietnamese answers", async ({
  page,
}) => {
  await open(page, "duoi-hinh");
  await page.getByRole("button", { name: "Gợi ý nhỏ" }).click();
  await expect(page.locator(".g2-hint")).toBeVisible();
  for (const answer of ["cầu vồng", "đi học", "yêu thiên nhiên"]) {
    await page.getByLabel(/Đáp án của em/).fill(answer);
    await page.getByRole("button", { name: "Giải câu đố" }).click();
  }
  await complete(page);
});
test("maze keyboard visits every objective and home", async ({ page }) => {
  await open(page, "duong-ve-nha");
  await page.getByRole("button", { name: "Mục tiêu bài học" }).click();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: "Tiếp tục chơi" }).click();
  await expect(page.locator(".g2-scoreline")).toContainText("0 bước chân");
  const map = [
    "111111111",
    "100010001",
    "101010101",
    "101000101",
    "101110101",
    "100000101",
    "111010101",
    "100010001",
    "111111111",
  ];
  let start = [1, 1];
  for (const target of [
    [3, 1],
    [1, 7],
    [7, 3],
    [7, 7],
  ]) {
    let queue = [[...start, []]],
      seen = new Set([start.join(",")]),
      path;
    for (let k = 0; k < queue.length; k++) {
      const [x, y, steps] = queue[k];
      if (x === target[0] && y === target[1]) {
        path = steps;
        break;
      }
      for (const [dx, dy, key] of [
        [0, 1, "ArrowDown"],
        [0, -1, "ArrowUp"],
        [1, 0, "ArrowRight"],
        [-1, 0, "ArrowLeft"],
      ]) {
        const nx = x + dx,
          ny = y + dy;
        if (map[ny]?.[nx] === "0" && !seen.has(`${nx},${ny}`)) {
          seen.add(`${nx},${ny}`);
          queue.push([nx, ny, [...steps, key]]);
        }
      }
    }
    for (const key of path) await page.keyboard.press(key);
    start = target;
  }
  await complete(page);
});
test("melody flashes sequence and accepts repeated notes", async ({ page }) => {
  test.setTimeout(60000);
  await open(page, "nhac-viet");
  const notes = ["Đô", "Rê", "Mi", "Đô", "Mi", "Sol"];
  for (let level = 2; level <= 6; level++) {
    await page.getByRole("button", { name: "Nghe giai điệu" }).click();
    await expect(page.locator(".g2-note-active")).toHaveCount(1);
    await expect(page.locator(".g2-xylophone button").first()).toBeEnabled({
      timeout: 10000,
    });
    for (const note of notes.slice(0, level))
      await page
        .locator(".g2-xylophone")
        .getByRole("button", { name: note, exact: true })
        .click();
  }
  await complete(page);
});
test("sorting places all objects in appropriate collection bins", async ({
  page,
}) => {
  await open(page, "phan-loai");
  const bins = {
    "Vỏ chuối": "Hữu cơ",
    "Lá rau bỏ": "Hữu cơ",
    "Lõi táo": "Hữu cơ",
    "Báo cũ sạch": "Tái chế",
    "Lon sạch": "Tái chế",
    "Hộp giấy sạch": "Tái chế",
    "Pin đã dùng": "Thu gom riêng",
    "Bóng đèn hỏng": "Thu gom riêng",
  };
  for (let i = 0; i < 8; i++) {
    const item = await page.locator(".g2-sort-item h3").textContent();
    await page
      .locator(".g2-bins")
      .getByRole("button", { name: new RegExp(bins[item]) })
      .click();
  }
  await complete(page);
});
test("sudoku fills a valid grid and verifies solution", async ({ page }) => {
  await open(page, "sudoku");
  const solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
  for (let i = 0; i < 16; i++) {
    const cell = page.locator(".g2-sudoku button").nth(i);
    if ((await cell.getAttribute("class")).includes("g2-clue")) continue;
    await cell.click();
    await page
      .locator(".g2-numberpad")
      .getByRole("button", { name: String(solution[i]), exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Kiểm tra khu vườn số" }).click();
  await complete(page);
});
test("cipher resolves four patterns and opens chest", async ({ page }) => {
  await open(page, "mat-ma");
  for (let i = 0; i < 4; i++) {
    await page.locator(".g2-options button").nth([0, 1, 2, 2][i]).click();
    await page
      .getByRole("button", {
        name: i === 3 ? "Mở rương tri thức" : "Ổ khóa tiếp theo",
      })
      .click();
  }
  await complete(page);
});

test("all 2D boards fit mobile portrait and landscape, with reachable controls", async ({
  page,
}) => {
  test.setTimeout(90000);
  const scenes = [
    ["o-an-quan", ".g2-pit.g2-own:not(:disabled)"],
    ["ghep-chu", ".g2-letterbank button"],
    ["lat-the", ".g2-memory button"],
    ["phan-so", ".g2-fraction-scene path"],
    ["duoi-hinh", ".g2-form input"],
    ["duong-ve-nha", ".g2-dpad button"],
    ["nhac-viet", ".g2-actions button"],
    ["phan-loai", ".g2-bins button"],
    ["sudoku", ".g2-sudoku button"],
    ["mat-ma", ".g2-options button"],
  ];
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [id, selector] of scenes) {
      await open(page, id);
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          {
            message: `${id} overflow at ${viewport.width} × ${viewport.height}`,
          },
        )
        .toBe(true);
      const control = page.locator(selector).first();
      await control.scrollIntoViewIfNeeded();
      await expect(control).toBeInViewport();
      await expect(control).toBeVisible();
      const restart = page.getByRole("button", { name: "Chơi lại từ đầu" });
      await restart.scrollIntoViewIfNeeded();
      await expect(restart).toBeInViewport();
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page, "o-an-quan");
  await page.locator(".g2-oaq").waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "screenshots/o-an-quan.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "duong-ve-nha");
  await page.locator(".g2-maze").waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "screenshots/maze-mobile.png",
    fullPage: true,
  });
});
