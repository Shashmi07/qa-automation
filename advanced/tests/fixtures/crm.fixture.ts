import {
  test as base,
  expect,
  type Page
} from "@playwright/test";

import type { LeadData } from "../factories/lead.factory";

type CreatedLead = {
  id: string;
  name: string;
};

type CrmFixture = {
  createLead: (data: LeadData) => Promise<CreatedLead>;
};

async function searchLead(page: Page, name: string) {
  const response = await page.request.get(
    `/api/leads?q=${encodeURIComponent(name)}&page=1&pageSize=100`
  );

  expect(response.ok()).toBeTruthy();

  const body = await response.json() as {
    leads?: Array<{
      id: string;
      company: string;
    }>;
  };

  return body.leads ?? [];
}

export const test = base.extend<{ crm: CrmFixture }>({
  crm: async ({ page }, use, testInfo) => {
    const createdLeads: CreatedLead[] = [];

    const createLead = async (
      data: LeadData
    ): Promise<CreatedLead> => {
      const response = await page.request.post("/api/leads", {
        data: {
          company: data.name,
          contact: data.email,
          phone: data.phone,
          source: "Website",
          priority: "cold"
        }
      });

      expect(response.status()).toBe(201);

      const body = await response.json() as {
        id: string;
      };

      const lead = {
        id: body.id,
        name: data.name
      };

      createdLeads.push(lead);

      return lead;
    };

    await use({ createLead });

    const cleanupResults = [];

    for (const lead of createdLeads) {
      const deleteResponse = await page.request.delete("/api/leads", {
        data: {
          ids: [lead.id]
        }
      });

      expect(deleteResponse.ok()).toBeTruthy();

      const remainingLeads = await searchLead(page, lead.name);

      const gone = !remainingLeads.some(
        (item) => item.id === lead.id
      );

      expect(gone).toBeTruthy();

      cleanupResults.push({
        id: lead.id,
        name: lead.name,
        deleted: true,
        goneFromCrm: gone
      });
    }

    await testInfo.attach("cleanup-proof.json", {
      body: JSON.stringify(
        {
          cleanupRan: true,
          leadsCreated: createdLeads.length,
          leadsDeleted: cleanupResults.length,
          allLeadsGone: cleanupResults.every(
            (item) => item.goneFromCrm
          ),
          results: cleanupResults
        },
        null,
        2
      ),
      contentType: "application/json"
    });
  }
});

export { expect };