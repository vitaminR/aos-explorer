import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('AOS Explorer Tour', () => {
  test('should display tour automatically on load, move spotlight, and allow skipping', async ({ page }) => {
    // Determine the absolute path to prototype.html
    // Use the file:// protocol to load it directly
    const filePath = `file:///${path.resolve(__dirname, '../prototype.html').replace(/\\/g, '/')}`;
    await page.goto(filePath);

    // 1. Tour Initialization: Welcome step
    const coachTitle = page.locator('#coachTitle');
    await expect(coachTitle).toHaveText('Welcome to {a}OS Explorer');
    
    const spotlightMask = page.locator('#spotlightMask');
    await expect(spotlightMask).toHaveClass(/active/);
    
    // Initially, targeted spotlight width might be 0 since it's centered without a target element
    // We can just verify it is visible
    await expect(spotlightMask).toBeVisible();

    // 2. Dynamic Spotlight: Click Next, Expect Drill Into Any Stratum
    const nextBtn = page.locator('#coachNext');
    await nextBtn.click();

    // Wait for the text to change
    await expect(coachTitle).toHaveText('Drill Into Any Stratum');

    // Wait for the spotlight mask to animate (giving it time to resize for target #l5)
    await page.waitForTimeout(500);

    // The mask should have expanded if dynamic spotlight logic runs.
    const boundingBox = await spotlightMask.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
       expect(boundingBox.width).toBeGreaterThan(100);
       expect(boundingBox.height).toBeGreaterThan(50);
    }

    // 3. Tour Dismissal: Click Skip tour
    const skipBtn = page.locator('text=Skip tour');
    await skipBtn.click();

    // The coachmark wrapper and spotlight mask should be hidden/inactive
    const coachmarkOverlay = page.locator('#coachmark');
    await expect(coachmarkOverlay).toHaveClass(/hidden/);
    await expect(spotlightMask).not.toHaveClass(/active/);
  });
});
