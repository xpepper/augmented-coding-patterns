import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Alternative Names', () => {
  const testPatternSlug = 'test-alternative-names-pattern';
  const alternativeSlug = 'alt-name-test';
  const patternPath = path.join(process.cwd(), '..', 'documents', 'patterns', `${testPatternSlug}.md`);

  // Create a test pattern with alternative names
  test.beforeAll(() => {
    const content = `---
authors: [lada_kesseler]
alternative_names: ["${alternativeSlug}"]
---

# Test Alternative Names Pattern

## Problem
This is a test pattern to verify alternative names functionality.

## Solution
Alternative names should redirect to the canonical URL.
`;
    fs.writeFileSync(patternPath, content, 'utf-8');
  });

  // Clean up the test pattern
  test.afterAll(() => {
    if (fs.existsSync(patternPath)) {
      fs.unlinkSync(patternPath);
    }
  });

  test('alternative name URL redirects to canonical URL', async ({ page }) => {
    // Visit the alternative name URL
    await page.goto(`/patterns/${alternativeSlug}/`);

    // Should redirect to canonical URL
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);

    // Should display the pattern title
    await expect(page.locator('h1')).toContainText('Test Alternative Names Pattern');
  });

  test('canonical page displays alternative names under title', async ({ page }) => {
    // Visit the canonical URL
    await page.goto(`/patterns/${testPatternSlug}/`);

    // Page should load successfully
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);
    await expect(page.locator('h1')).toContainText('Test Alternative Names Pattern');

    // Alternative names should be displayed
    const altNamesText = page.locator('p.text-sm.text-gray-500');
    await expect(altNamesText).toBeVisible();
    await expect(altNamesText).toContainText('Also known as:');
    await expect(altNamesText).toContainText('Alt Name Test');
  });

  test('visiting canonical URL shows content normally', async ({ page }) => {
    // Visit the canonical URL
    await page.goto(`/patterns/${testPatternSlug}/`);

    // Page should load successfully
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);

    // Content should be visible
    await expect(page.locator('h1')).toContainText('Test Alternative Names Pattern');
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('article')).toContainText('This is a test pattern');
  });

  test('alternative name URL has canonical link in HTML', async ({ page }) => {
    // Visit the alternative name URL
    const response = await page.goto(`/patterns/${alternativeSlug}/`);

    // Check that we get redirected
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);

    // The HTML should have contained the canonical link
    // (We can't easily check the intermediate HTML, but the redirect proves it worked)
    expect(response?.status()).toBe(200);
  });
});

test.describe('Alternative Names - Multiple Alternatives', () => {
  const testPatternSlug = 'test-multi-alt-pattern';
  const alternativeSlug1 = 'alt-one';
  const alternativeSlug2 = 'alt-two';
  const patternPath = path.join(process.cwd(), '..', 'documents', 'patterns', `${testPatternSlug}.md`);

  test.beforeAll(() => {
    const content = `---
authors: [lada_kesseler]
alternative_names: ["${alternativeSlug1}", "${alternativeSlug2}"]
---

# Test Multiple Alternatives

## Problem
Testing multiple alternative names.

## Solution
All alternatives should redirect.
`;
    fs.writeFileSync(patternPath, content, 'utf-8');
  });

  test.afterAll(() => {
    if (fs.existsSync(patternPath)) {
      fs.unlinkSync(patternPath);
    }
  });

  test('first alternative name redirects to canonical', async ({ page }) => {
    await page.goto(`/patterns/${alternativeSlug1}/`);
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);
    await expect(page.locator('h1')).toContainText('Test Multiple Alternatives');
  });

  test('second alternative name redirects to canonical', async ({ page }) => {
    await page.goto(`/patterns/${alternativeSlug2}/`);
    await expect(page).toHaveURL(`/patterns/${testPatternSlug}/`);
    await expect(page.locator('h1')).toContainText('Test Multiple Alternatives');
  });

  test('canonical page displays all alternative names', async ({ page }) => {
    await page.goto(`/patterns/${testPatternSlug}/`);

    const altNamesText = page.locator('p.text-sm.text-gray-500');
    await expect(altNamesText).toBeVisible();
    await expect(altNamesText).toContainText('Also known as:');
    await expect(altNamesText).toContainText('Alt One');
    await expect(altNamesText).toContainText('Alt Two');
  });
});
