import { test, expect } from '@playwright/test';
import path from 'path';


test('Dropdown selection', async ({ page }) => {

  // Open dropdown page
 await page.goto('https://the-internet.herokuapp.com/dropdown');


  // Select Option 1
 await page.locator('#dropdown').selectOption('1');

  // Verify Option 1
 await expect(page.locator('#dropdown')).toHaveValue('1');

  // Select Option 2
 await page.locator('#dropdown').selectOption('2');

  // Verify Option 2
 await expect(page.locator('#dropdown')).toHaveValue('2');
});



test('Checkbox selection', async ({ page }) => {

  // 1. Open checkboxes page
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  // 2. Locate both checkboxes
  const checkbox1 = page.locator('input[type="checkbox"]').nth(0);
  const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

  // 3. Check Checkbox 1
  await checkbox1.check();

  // 4. Verify Checkbox 1 is checked
  await expect(checkbox1).toBeChecked();

  // 5. Uncheck Checkbox 2
  await checkbox2.uncheck();

  // 6. Verify Checkbox 2 is unchecked
  await expect(checkbox2).not.toBeChecked();

});

test('JavaScript Alerts', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // 1. Accept JavaScript Alert
  page.once('dialog', async dialog => {
    console.log('Alert message:', dialog.message());
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

  await expect(page.locator('#result'))
    .toHaveText('You successfully clicked an alert');

  // 2. Accept JavaScript Confirm
  page.once('dialog', async dialog => {
    console.log('Confirm message:', dialog.message());
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

  await expect(page.locator('#result')).toHaveText('You clicked: Ok');

  // 3. Dismiss JavaScript Confirm
  page.once('dialog', async dialog => {
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

  await expect(page.locator('#result')).toHaveText('You clicked: Cancel');

  // 4. Enter text into JavaScript Prompt
  page.once('dialog', async dialog => {
    console.log('Prompt message:', dialog.message());
    await dialog.accept('Hello Playwright');
  });

  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

  await expect(page.locator('#result'))
    .toHaveText('You entered: Hello Playwright');

});



test('Read text from Nested Frames', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  // Read Left frame
  const left = page.frameLocator('frame[name="frame-top"]')
    .frameLocator('frame[name="frame-left"]');

  await expect(left.locator('body')).toHaveText('LEFT');

  // Read Middle frame
  const middle = page.frameLocator('frame[name="frame-top"]')
    .frameLocator('frame[name="frame-middle"]');

  await expect(middle.locator('body')).toHaveText('MIDDLE');

  // Read Right frame
  const right = page.frameLocator('frame[name="frame-top"]')
    .frameLocator('frame[name="frame-right"]');

  await expect(right.locator('body')).toHaveText('RIGHT');

  // Read Bottom frame
  const bottom = page.frameLocator('frame[name="frame-bottom"]');

  await expect(bottom.locator('body')).toHaveText('BOTTOM');

  console.log('All five frames verified successfully');

});


test('File Upload', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/upload');

  // Get the file path
  const filePath = path.join(__dirname, 'test-files', 'sample.txt');

  // Upload the file
  await page.locator('#file-upload').setInputFiles(filePath);

  // Click Upload button
  await page.locator('#file-submit').click();

  // Verify uploaded filename
  await expect(page.locator('#uploaded-files'))
    .toHaveText('sample.txt');

});


test('Dynamic Loading', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  // Click Start
  await page.getByRole('button', { name: 'Start' }).click();

  // Playwright automatically waits until the text appears
  await expect(page.locator('#finish h4'))
    .toHaveText('Hello World!');

});