import { test, expect } from "@playwright/test";

test("Customer can add a meal to cart and proceed to checkout", async ({
  page,
}) => {
  await page.goto("https://dalbhath.com");

  // Sample selectors – adjust based on your actual UI
  await page.click('text="Login"');
  await page.fill('input[name="phone"]', "01812345678");
  await page.fill('input[name="otp"]', "123456"); // or use mocked login
  await page.click('text="Submit"');

  await page.waitForURL("/dashboard");
  await expect(page).toHaveURL(/.*dashboard/);

  // Add meal to cart
  await page.click('text="Add to Cart"');
  await page.click('text="Go to Cart"');

  // Proceed to checkout
  await page.click('text="Checkout"');
  await expect(page.locator('text="Order confirmed"')).toBeVisible();
});
