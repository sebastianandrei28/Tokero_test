import { test, expect } from "@playwright/test";
import { acceptCookies, log } from "./utils";
import { HOME_PAGE, LANGUAGES, listOfFooters } from "./constants";

test.beforeEach(async ({ page }) => {
  page.goto(HOME_PAGE);
  await acceptCookies(page);
  await page.locator(".footer_footer___6Rt4").scrollIntoViewIfNeeded();
});

async function getEachCollumnLocator({ page }) {
  const columns = page.locator(
    '.footer_footer___6Rt4 >> div.row >> div[class*="col-"]'
  );
  const columnCount = await columns.count();
  expect.soft(columnCount).toBeGreaterThan(0);

  log("info", `Footer contains ${columnCount} columns.`);
  return columns;
}

async function processColumn(column, columnIndex) {
  const listItems = column.locator("ul li");
  const itemCount = await listItems.count();
  const listOfLinks = [];
  log("info", `Column ${columnIndex + 1} contains ${itemCount} <li> items.`);

  for (let j = 0; j < itemCount; j++) {
    const li = listItems.nth(j);
    const link = li.locator("a");
    try {
      await processListItem(link, j, listOfLinks);
    } catch (e) {
      log(
        "error",
        `Error processing <li> ${j + 1} in column ${columnIndex + 1}: ${
          e.message
        }`
      );
    }
  }
  return listOfLinks;
}
async function processListItem(link, listItemIndex, listOfLinks) {
  const linkCount = await link.count();
  if (linkCount === 0) {
    return;
  }
  await handleLink(link, listItemIndex, listOfLinks);
}

async function handleLink(link, listItemIndex, listOfLinks) {
  await link.waitFor({ state: "attached", timeout: 5000 });

  expect.soft(await link.isVisible()).not.toBe(false);
  if (await link.isVisible()) {
    const href = await link.getAttribute("href");
    expect.soft(href).toBeTruthy();
    if (href) {
      listOfLinks.push(href);
    } else {
      log("warning", `Invalid href in <li> ${listItemIndex + 1}`);
    }
  } else {
    log(
      "warning",
      `Link in <li> ${listItemIndex + 1} is not visible – ignored.`
    );
  }
}

async function staticValidationOfLinks(
  linstOfLinks: string[],
  lang: string,
  columnNumber: number
) {
  linstOfLinks.map((item: string, index: number) => {
    expect.soft(item).toBe(`/${lang}/${listOfFooters[columnNumber][index]}`);
    if (item === `/${lang}/${listOfFooters[columnNumber][index]}`) {
      log("success", item);
    } else {
      expect.soft(item).toBe(listOfFooters[columnNumber][index]);
      if (item === listOfFooters[columnNumber][index]) {
        log("success", item);
      } else {
        log(
          "error",
          `Expected:/${lang}/${listOfFooters[columnNumber][index]}, Received: ${item}`
        );
      }
    }
  });
}

async function dynamicValidationOfLinks(
  { page },
  testItemsProvider: string,
  lang: string,
  columnNumber: number,
  listOfLinks: string[]
) {
  if (testItemsProvider === "Database") {
    for (const [index, item] of listOfFooters[columnNumber].entries()) {
      const urlDB = `${HOME_PAGE}/${lang}/${item}`;
      try {
        const response = await Promise.all([
          page.waitForResponse(
            (resp) => resp.url().includes(urlDB) && resp.status() < 400,
            { timeout: 3000 }
          ),
          page.goto(urlDB, { waitUntil: "load", timeout: 5000 }),
          page.waitForSelector("body", {
            state: "attached",
            timeout: 5000,
          }),
        ]);
        expect.soft(response).toBeTruthy();
        log("success", `The URL is validated: ${urlDB}`);
      } catch (e) {
        expect.soft(false).toBeTruthy();
        log("error", `Provided URL is not functional:${urlDB}`);
      }
    }
  } else {
    for (const [index, item] of listOfLinks.entries()) {
      const urlDB = `${HOME_PAGE}${item}`;
      try {
        const response = await Promise.all([
          page.waitForResponse(
            (resp) => resp.url().includes(urlDB) && resp.status() < 400,
            { timeout: 3000 }
          ),
          page.goto(urlDB, { waitUntil: "load", timeout: 5000 }),
          page.waitForSelector("body", {
            state: "attached",
            timeout: 5000,
          }),
        ]);
        expect.soft(response).toBeTruthy();
        log("success", `The URL is validated: ${urlDB}`);
      } catch (e) {
        expect.soft(false).toBeTruthy();
        log("error", `Provided URL is not functional:${urlDB}`);
      }
    }
  }
}

test.setTimeout(120000);
test("Footer - TOKERO column", async ({ page }) => {
  const footerColumn = 0;
  const lang = "en";
  const columns = await getEachCollumnLocator({ page });
  const linstOfLinks = await processColumn(
    columns.nth(footerColumn),
    footerColumn
  );
  await test.step("Static Validation Of Links", async () => {
    await staticValidationOfLinks(linstOfLinks, lang, footerColumn);
  });

  await test.step("Dynamic Validation Of Links from database", async () => {
    await dynamicValidationOfLinks(
      { page },
      "Database",
      lang,
      footerColumn,
      linstOfLinks
    );
  });

  await test.step("Dynamic Validation Of Links from site", async () => {
    await dynamicValidationOfLinks(
      { page },
      "site",
      lang,
      footerColumn,
      linstOfLinks
    );
  });
});

test("Footer - Services column", async ({ page }) => {
  const footerColumn = 1;
  const lang = "en";
  const columns = await getEachCollumnLocator({ page });
  const linstOfLinks = await processColumn(
    columns.nth(footerColumn),
    footerColumn
  );
  await test.step("Static Validation Of Links", async () => {
    await staticValidationOfLinks(linstOfLinks, lang, footerColumn);
  });

  await test.step("Dynamic Validation Of Links from database", async () => {
    await dynamicValidationOfLinks(
      { page },
      "Database",
      lang,
      footerColumn,
      linstOfLinks
    );
  });

  await test.step("Dynamic Validation Of Links from site", async () => {
    await dynamicValidationOfLinks(
      { page },
      "site",
      lang,
      footerColumn,
      linstOfLinks
    );
  });
});

test("Footer - Polices and Rules column", async ({ page }) => {
  const footerColumn = 2;
  const lang = "en";
  const columns = await getEachCollumnLocator({ page });
  const linstOfLinks = await processColumn(
    columns.nth(footerColumn),
    footerColumn
  );
  await test.step("Static Validation Of Links", async () => {
    await staticValidationOfLinks(linstOfLinks, lang, footerColumn);
  });

  await test.step("Dynamic Validation Of Links from database", async () => {
    await dynamicValidationOfLinks(
      { page },
      "Database",
      lang,
      footerColumn,
      linstOfLinks
    );
  });

  await test.step("Dynamic Validation Of Links from site", async () => {
    await dynamicValidationOfLinks(
      { page },
      "site",
      lang,
      footerColumn,
      linstOfLinks
    );
  });
});

test("Footer - Info column", async ({ page }) => {
  const footerColumn = 3;
  const lang = "en";
  const columns = await getEachCollumnLocator({ page });
  const linstOfLinks = await processColumn(
    columns.nth(footerColumn),
    footerColumn
  );
  await test.step("Static Validation Of Links", async () => {
    await staticValidationOfLinks(linstOfLinks, lang, footerColumn);
  });

  await test.step("Dynamic Validation Of Links from database", async () => {
    await dynamicValidationOfLinks(
      { page },
      "Database",
      lang,
      footerColumn,
      linstOfLinks
    );
  });

  await test.step("Dynamic Validation Of Links from site", async () => {
    await dynamicValidationOfLinks(
      { page },
      "site",
      lang,
      footerColumn,
      linstOfLinks
    );
  });
});
