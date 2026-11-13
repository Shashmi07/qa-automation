
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const baseURL =
  process.env.CRM_BASE_URL || 'http://localhost:3000';

const pages = [
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Pipeline List',
    path: '/pipeline/list',
  },
  {
    name: 'Pipeline Kanban',
    path: '/pipeline/kanban',
  },
];

for (const crmPage of pages) {
  test(`A4b - Accessibility scan: ${crmPage.name}`, async ({ page }, testInfo) => {

    await page.goto(`${baseURL}${crmPage.path}`);

    // Run axe accessibility scan
    const results = await new AxeBuilder({ page }).analyze();

    // Group violations by impact
    const impactCounts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    for (const violation of results.violations) {
      const impact = violation.impact;

      if (impact && impact in impactCounts) {
        impactCounts[impact as keyof typeof impactCounts]++;
      }

      console.log({
        page: crmPage.name,
        issue: violation.id,
        impact: violation.impact,
        description: violation.help,
        affectedElements: violation.nodes.length,
        wcag: violation.tags.filter(tag => tag.startsWith('wcag')),
      });
    }

    console.log(`\n${crmPage.name} summary`);
    console.log('Total violations:', results.violations.length);
    console.log('Impact summary:', impactCounts);

    // Save complete scan results
    await testInfo.attach(
      `${crmPage.name.replaceAll(' ', '-')}-axe-report.json`,
      {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      }
    );
  });
}
