import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { visitApp } from './support/commands';
import { createAndLogin } from './support/user';

test("should allow you to register and login", async ({ page }) => {
  const loginForm = {
    email: `${faker.internet.userName()}@example.com`,
    password: faker.internet.password(),
  };

  await visitApp({
    path: "/",
    page
  })


  await page.getByRole("link", { name: /sign up/i }).click();
  await page.getByRole("textbox", { name: /email/i }).type(loginForm.email);
  await page.getByLabel(/password/i).type(loginForm.password);
  await page.getByRole("button", { name: /create account/i }).click();

  await page.getByRole("link", { name: /notes/i }).click();
  await page.getByRole("button", { name: /logout/i }).click();
  
  expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
});

test("should allow you to make a note", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const testNote = {
    title: faker.lorem.words(1),
    body: faker.lorem.sentences(1),
  };
  
  await createAndLogin({
    email: `${faker.internet.userName()}@example.com`,
    context
  })
  
  await visitApp({
    path: "/notes",
    page
  })

  expect(page.getByText("No notes yet")).toBeVisible();

  await page.getByRole("link", { name: /\+ new note/i }).click();
  await page.getByRole("textbox", { name: /title/i }).type(testNote.title);
  await page.getByRole("textbox", { name: /body/i }).type(testNote.body);
  await page.getByRole("button", { name: /save/i }).click();
  await page.getByRole("button", { name: /delete/i }).click();

  expect(page.getByText("No notes yet")).toBeVisible();
});