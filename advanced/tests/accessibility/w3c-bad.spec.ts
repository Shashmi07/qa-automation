import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const demos = [
  {
    name: 'Inaccessible',
    url: 'https://www.w3.org/WAI/demos/bad/before/home.html',
  },
  {
    name: 'Accessible',
    url: 'https://www.w3.org/WAI/demos/bad/after/home.html',
  },
];

for (const demo of demos) {
  test(`A4a - Scan ${demo.name} W3C BAD page`, async ({ page }, testInfo) => {
    await page.goto(demo.url);

    const results = await new AxeBuilder({ page }).analyze();

    const counts = {
      totalViolations: results.violations.length,
      affectedElements: results.violations.reduce(
        (total, violation) => total + violation.nodes.length,
        0
      ),
      critical: results.violations.filter(v => v.impact === 'critical').length,
      serious: results.violations.filter(v => v.impact === 'serious').length,
      moderate: results.violations.filter(v => v.impact === 'moderate').length,
      minor: results.violations.filter(v => v.impact === 'minor').length,
    };

    console.log(`\n${demo.name} page results:`);
    console.log(counts);

    await testInfo.attach(`${demo.name}-accessibility-report.json`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
  });
}