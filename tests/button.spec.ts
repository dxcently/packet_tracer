import { test, expect } from '@playwright/test';

const url = 'http://localhost:5173/src/frontend/pages/landing/index.html'
const url2 = 'http://localhost:5173/src/frontend/pages/login/index.html'
test('in landing page, register button navigates to register page', async ({ page }) => {
  await page.goto(url);
  await page.screenshot({path:'results/landing-page.png'})
  await page.getByText('Register').click();
  await expect(page).toHaveURL(/register/);
  await page.screenshot({path:'results/register-page.png'})
});

test('in landing page, login button navigates to login page', async ({ page }) => {
  await page.goto(url);
  await page.screenshot({path:'results/landing-page.png'})
  await page.getByText('Login').click();
  await expect(page).toHaveURL(/login/);
  await page.screenshot({path:'results/sign-page.png'})
});

test('in login page, register button navigates to register page', async ({ page }) => {
  await page.goto(url2);
  await page.screenshot({path:'results/login-page2.png'})
  await page.getByText('Register').click();
  await expect(page).toHaveURL(/register/);
  await page.screenshot({path:'results/register-page2.png'})
});

test('in login page, back button navigates to langing page', async ({ page }) => {
  await page.goto(url2);
  await page.screenshot({path:'results/login-page2.png'})
  await page.getByText('← Back').click();
  await expect(page).toHaveURL(/landing/);
  await page.screenshot({path:'results/landing-page2.png'})
});
