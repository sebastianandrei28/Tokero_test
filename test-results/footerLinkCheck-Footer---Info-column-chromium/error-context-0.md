# Test info

- Name: Footer - Info column
- Location: D:\workspace\playwright\Tokero_test\tests\footerLinkCheck.spec.ts:249:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "/en/https://www.anpc.ro/"
Received: "https://www.anpc.ro/"
    at map (D:\workspace\playwright\Tokero_test\tests\footerLinkCheck.spec.ts:78:23)
    at staticValidationOfLinks (D:\workspace\playwright\Tokero_test\tests\footerLinkCheck.spec.ts:77:16)
    at D:\workspace\playwright\Tokero_test\tests\footerLinkCheck.spec.ts:258:11
    at D:\workspace\playwright\Tokero_test\tests\footerLinkCheck.spec.ts:257:14
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 | import { acceptCookies, log } from "./utils";
   3 | import { HOME_PAGE, LANGUAGES, listOfFooters } from "./constants";
   4 |
   5 | test.beforeEach(async ({ page }) => {
   6 |   page.goto(HOME_PAGE);
   7 |   await acceptCookies(page);
   8 |   await page.locator(".footer_footer___6Rt4").scrollIntoViewIfNeeded();
   9 | });
   10 |
   11 | async function getEachCollumnLocator({ page }) {
   12 |   const columns = page.locator(
   13 |     '.footer_footer___6Rt4 >> div.row >> div[class*="col-"]'
   14 |   );
   15 |   const columnCount = await columns.count();
   16 |   expect.soft(columnCount).toBeGreaterThan(0);
   17 |
   18 |   log("info", `Footer contains ${columnCount} columns.`);
   19 |   return columns;
   20 | }
   21 |
   22 | async function processColumn(column, columnIndex) {
   23 |   const listItems = column.locator("ul li");
   24 |   const itemCount = await listItems.count();
   25 |   const listOfLinks = [];
   26 |   log("info", `Column ${columnIndex + 1} contains ${itemCount} <li> items.`);
   27 |
   28 |   for (let j = 0; j < itemCount; j++) {
   29 |     const li = listItems.nth(j);
   30 |     const link = li.locator("a");
   31 |     try {
   32 |       await processListItem(link, j, listOfLinks);
   33 |     } catch (e) {
   34 |       log(
   35 |         "error",
   36 |         `Error processing <li> ${j + 1} in column ${columnIndex + 1}: ${
   37 |           e.message
   38 |         }`
   39 |       );
   40 |     }
   41 |   }
   42 |   return listOfLinks;
   43 | }
   44 | async function processListItem(link, listItemIndex, listOfLinks) {
   45 |   const linkCount = await link.count();
   46 |   if (linkCount === 0) {
   47 |     return;
   48 |   }
   49 |   await handleLink(link, listItemIndex, listOfLinks);
   50 | }
   51 |
   52 | async function handleLink(link, listItemIndex, listOfLinks) {
   53 |   await link.waitFor({ state: "attached", timeout: 5000 });
   54 |
   55 |   expect.soft(await link.isVisible()).not.toBe(false);
   56 |   if (await link.isVisible()) {
   57 |     const href = await link.getAttribute("href");
   58 |     expect.soft(href).toBeTruthy();
   59 |     if (href) {
   60 |       listOfLinks.push(href);
   61 |     } else {
   62 |       log("warning", `Invalid href in <li> ${listItemIndex + 1}`);
   63 |     }
   64 |   } else {
   65 |     log(
   66 |       "warning",
   67 |       `Link in <li> ${listItemIndex + 1} is not visible – ignored.`
   68 |     );
   69 |   }
   70 | }
   71 |
   72 | async function staticValidationOfLinks(
   73 |   linstOfLinks: string[],
   74 |   lang: string,
   75 |   columnNumber: number
   76 | ) {
   77 |   linstOfLinks.map((item: string, index: number) => {
>  78 |     expect.soft(item).toBe(`/${lang}/${listOfFooters[columnNumber][index]}`);
      |                       ^ Error: expect(received).toBe(expected) // Object.is equality
   79 |     if (item === `/${lang}/${listOfFooters[columnNumber][index]}`) {
   80 |       log("success", item);
   81 |     } else {
   82 |       expect.soft(item).toBe(listOfFooters[columnNumber][index]);
   83 |       if (item === listOfFooters[columnNumber][index]) {
   84 |         log("success", item);
   85 |       } else {
   86 |         log(
   87 |           "error",
   88 |           `Expected:/${lang}/${listOfFooters[columnNumber][index]}, Received: ${item}`
   89 |         );
   90 |       }
   91 |     }
   92 |   });
   93 | }
   94 |
   95 | async function dynamicValidationOfLinks(
   96 |   { page },
   97 |   testItemsProvider: string,
   98 |   lang: string,
   99 |   columnNumber: number,
  100 |   listOfLinks: string[]
  101 | ) {
  102 |   if (testItemsProvider === "Database") {
  103 |     for (const [index, item] of listOfFooters[columnNumber].entries()) {
  104 |       const urlDB = `${HOME_PAGE}/${lang}/${item}`;
  105 |       try {
  106 |         const response = await Promise.all([
  107 |           page.waitForResponse(
  108 |             (resp) => resp.url().includes(urlDB) && resp.status() < 400,
  109 |             { timeout: 3000 }
  110 |           ),
  111 |           page.goto(urlDB, { waitUntil: "load", timeout: 5000 }),
  112 |           page.waitForSelector("body", {
  113 |             state: "attached",
  114 |             timeout: 5000,
  115 |           }),
  116 |         ]);
  117 |         expect.soft(response).toBeTruthy();
  118 |         log("success", `The URL is validated: ${urlDB}`);
  119 |       } catch (e) {
  120 |         expect.soft(false).toBeTruthy();
  121 |         log("error", `Provided URL is not functional:${urlDB}`);
  122 |       }
  123 |     }
  124 |   } else {
  125 |     for (const [index, item] of listOfLinks.entries()) {
  126 |       const urlDB = `${HOME_PAGE}${item}`;
  127 |       try {
  128 |         const response = await Promise.all([
  129 |           page.waitForResponse(
  130 |             (resp) => resp.url().includes(urlDB) && resp.status() < 400,
  131 |             { timeout: 3000 }
  132 |           ),
  133 |           page.goto(urlDB, { waitUntil: "load", timeout: 5000 }),
  134 |           page.waitForSelector("body", {
  135 |             state: "attached",
  136 |             timeout: 5000,
  137 |           }),
  138 |         ]);
  139 |         expect.soft(response).toBeTruthy();
  140 |         log("success", `The URL is validated: ${urlDB}`);
  141 |       } catch (e) {
  142 |         expect.soft(false).toBeTruthy();
  143 |         log("error", `Provided URL is not functional:${urlDB}`);
  144 |       }
  145 |     }
  146 |   }
  147 | }
  148 |
  149 | test.setTimeout(120000);
  150 | test("Footer - TOKERO column", async ({ page }) => {
  151 |   const footerColumn = 0;
  152 |   const lang = "en";
  153 |   const columns = await getEachCollumnLocator({ page });
  154 |   const linstOfLinks = await processColumn(
  155 |     columns.nth(footerColumn),
  156 |     footerColumn
  157 |   );
  158 |   await test.step("Static Validation Of Links", async () => {
  159 |     await staticValidationOfLinks(linstOfLinks, lang, footerColumn);
  160 |   });
  161 |
  162 |   await test.step("Dynamic Validation Of Links from database", async () => {
  163 |     await dynamicValidationOfLinks(
  164 |       { page },
  165 |       "Database",
  166 |       lang,
  167 |       footerColumn,
  168 |       linstOfLinks
  169 |     );
  170 |   });
  171 |
  172 |   await test.step("Dynamic Validation Of Links from site", async () => {
  173 |     await dynamicValidationOfLinks(
  174 |       { page },
  175 |       "site",
  176 |       lang,
  177 |       footerColumn,
  178 |       linstOfLinks
```