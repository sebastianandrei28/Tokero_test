import { test, expect } from "@playwright/test";
import { HOME_PAGE } from "./constants";
import { acceptCookies } from "./utils";

test.beforeEach(async ({ page }) => {
  await page.goto(HOME_PAGE);
  await acceptCookies(page);
});

test("Check if Create Account is visible", async ({ page }) => {
  const createAccountBtnBody = page.locator(
    ".unauthenticatedUserButtons_createAccountBtn__EgB7_"
  );

  await expect.soft(createAccountBtnBody).toBeVisible();

  const createAccountBtnHeader = page.locator(
    ".anonymousMenuOptions_navItemCreateAccount__RToh9"
  );

  await expect.soft(createAccountBtnHeader).toBeVisible();
});

test("Check if Create account button redirects to register page", async ({
  page,
}) => {
  const createAccountBtnBody = page.locator(
    ".unauthenticatedUserButtons_createAccountBtn__EgB7_"
  );

  await createAccountBtnBody.click();
  await page.waitForURL("**/register/");
  const currentUrl = page.url();
  expect.soft(currentUrl).toBe(`${HOME_PAGE}/en/register/`);
});

test("Check successfully register flow", async ({ page }) => {
  await page.goto(`${HOME_PAGE}/en/register/`);

  const emailInput = await page.locator("#email");
  await expect.soft(emailInput).toBeVisible();

  const registerPassword = await page.locator("#registerPassword");
  await expect.soft(registerPassword).toBeVisible();

  const confirmPassword = await page.locator("#confirmPassword");
  await expect.soft(confirmPassword).toBeVisible();

  const confirmTermsAndConditions = await page.locator(
    "#confirmTermsAndConditions"
  );
  await expect.soft(confirmTermsAndConditions).toBeVisible();

  const registerBtn = await page.getByRole("button", { name: "Register" });
  await expect.soft(registerBtn).toBeVisible();

  await emailInput.fill("dummy3@yahoo.com");
  await registerPassword.fill("Parola1234%");
  await confirmPassword.fill("Parola1234%");
  await confirmTermsAndConditions.check();

  await expect.soft(await emailInput.inputValue()).toBe("dummy3@yahoo.com");
  await expect.soft(await registerPassword.inputValue()).toBe("Parola1234%");
  await expect.soft(await confirmPassword.inputValue()).toBe("Parola1234%");
  await expect.soft(await confirmTermsAndConditions.isChecked()).toBeTruthy();
  //await expect.soft(confirmTermsAndConditions).toHaveScreenshot();

  //disabled due to captcha
  //await registerBtn.click();
  //await page.waitForURL("**/unconfirmed-email/");
  //await expect(page.url()).toBe("https://tokero.dev/en/unconfirmed-email/");
});
