import { expect } from "@playwright/test";

export async function acceptCookies(page) {
  const acceptBtn = await page.getByRole("button", {
    name: "Accept all cookies",
  });
  if (acceptBtn) await acceptBtn.click();
}

export async function log(type, message) {
  const types = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };
  console.log(`${types[type] || "ℹ️"} ${message}`);
}
