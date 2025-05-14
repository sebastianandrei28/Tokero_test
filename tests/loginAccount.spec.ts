import { test, expect } from "@playwright/test";
import { acceptCookies, log } from "./utils";
import { HOME_PAGE, LANGUAGES, listOfFooters } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto(HOME_PAGE);
  await acceptCookies(page);
});

test("Check if login button is visible", async ({ page }) => {
  const loginAccountBtnHeader = page.locator(
    ".anonymousMenuOptions_navLinkTitle__szaXc"
  );
  await expect.soft(loginAccountBtnHeader).toBeVisible();

  const loginAccountBtnBody = page.locator(
    ".unauthenticatedUserButtons_loginBtn__nZjTL"
  );
  await expect.soft(loginAccountBtnBody).toBeVisible();
});

test("Check if loggin button redirects to loggin page", async ({ page }) => {
  const loginAccountBtnHeader = page.locator(
    ".anonymousMenuOptions_navLinkTitle__szaXc"
  );

  await loginAccountBtnHeader.click();
  await page.waitForURL("**/login/");
  const currentUrl = page.url();
  expect.soft(currentUrl).toBe(`${HOME_PAGE}/en/login/`);
});

test("Check if loggin is successfull", async ({ page }) => {
  await page.goto(`${HOME_PAGE}/en/login/`);

  const emailInput = page.getByRole("textbox", { name: "Email", exact: true });
  await expect.soft(emailInput).toBeVisible();

  const passwordInput = page.getByRole("textbox", { name: "Password" });
  await expect.soft(passwordInput).toBeVisible();

  const logginBtn = page.getByRole("button", { name: "Log in" });
  await expect.soft(logginBtn).toBeVisible();

  await emailInput.fill("dummy3@yahoo.com");
  await passwordInput.fill("Parola1234%");

  await expect.soft(await emailInput.inputValue()).toBe("dummy3@yahoo.com");
  await expect.soft(await passwordInput.inputValue()).toBe("Parola1234%");

  //disabled due to captcha
  //await logginBtn.click();
  //await page.waitForURL("**/unconfirmed-email/");
  //await expect(page.url()).toBe("https://tokero.dev/en/unconfirmed-email/");
});
