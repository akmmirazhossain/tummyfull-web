import { test, expect } from "@playwright/test";

test("Login via cookie, visit menu, click first MUI switch", async ({
  page,
  context,
}) => {
  // Step 1: Set login cookie and visited flag cookie
  await context.addCookies([
    {
      name: "TFLoginToken",
      value: "cus3",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "visited",
      value: "true",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Step 2: Listen for console logs
  page.on("console", (msg) => {
    console.log(`[Console.${msg.type()}] ${msg.text()}`);
  });

  // Step 3: Visit the menu page
  await page.goto("http://localhost:3000/menu");

  // Step 4: Click on the first MUI Switch (checkbox input)
  await page
    .locator('span.MuiSwitch-root input[type="checkbox"]')
    .first()
    .click();

  // Optional: Wait for a bit to allow any async logs to show up
  await page.waitForTimeout(1000);
});
