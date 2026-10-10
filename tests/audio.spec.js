import { test, expect } from "@playwright/test";
test("muting a playing melody silences its queued notes and unmuting restores sound", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__playedNotes = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      window.__playedNotes++;
      return original.apply(this, args);
    };
  });
  await page.goto("/#play/nhac-viet");
  await page.getByRole("button", { name: "Nghe giai điệu" }).click();
  await expect.poll(() => page.evaluate(() => window.__playedNotes)).toBe(1);
  await page.getByRole("button", { name: "Tắt âm thanh", exact: true }).click();
  await expect(page.locator(".g2-xylophone button").first()).toBeEnabled();
  expect(await page.evaluate(() => window.__playedNotes)).toBe(1);
  await page.getByRole("button", { name: "Bật âm thanh", exact: true }).click();
  await page.getByRole("button", { name: "Nghe giai điệu" }).click();
  await expect(page.locator(".g2-xylophone button").first()).toBeEnabled();
  expect(await page.evaluate(() => window.__playedNotes)).toBe(3);
});
