import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.use({
  storageState: "playwright/.auth/superadmin.json"
});

test("creates a lead in the UI and reads it through the API", async ({
  page,
  request
}) => {
  const lead = {
    company: `Playwright ${faker.company.name()} ${faker.string.alphanumeric(6)}`,
    contact: faker.internet.email().toLowerCase(),
    phone: `+94 ${faker.helpers.arrayElement([
      "70",
      "71",
      "72",
      "74",
      "75",
      "76",
      "77",
      "78"
    ])} ${faker.string.numeric(7)}`
  };

  let leadId: string | undefined;

  try {
    await page.goto("/leads/new");

    await page
      .getByPlaceholder("e.g. Meridian Corp")
      .fill(lead.company);

    await page
      .getByPlaceholder("e.g. Sarah Blake")
      .fill(lead.contact);

    await page
      .getByPlaceholder("+1 555 000 0000")
      .fill(lead.phone);

    await page
      .getByRole("button", { name: "Select source…" })
      .click();

    await page.getByRole("button", { name: "Website", exact: true }).click();

    const [saveResponse] = await Promise.all([
      page.waitForResponse((response) =>
        response.url().endsWith("/api/leads") &&
        response.request().method() === "POST"
      ),

      page.getByRole("button", { name: "Save Lead" }).click()
    ]);

    expect(saveResponse.status()).toBe(201);

    const saveBody = await saveResponse.json() as {
      id: string;
    };

    expect(saveBody.id).toBeTruthy();
    leadId = saveBody.id;

    const apiResponse = await request.get(
      `/api/leads?q=${encodeURIComponent(lead.company)}&page=1&pageSize=100`
    );

    expect(apiResponse.ok()).toBeTruthy();

    const apiBody = await apiResponse.json() as {
      leads: Array<{
        id: string;
        company: string;
        contact: string;
        phone: string;
      }>;
    };

    const savedLead = apiBody.leads.find(
      (item) => item.id === saveBody.id
    );

    expect(savedLead).toEqual(
      expect.objectContaining({
        id: saveBody.id,
        company: lead.company,
        contact: lead.contact,
        phone: lead.phone
      })
    );
  } finally {
    if (leadId) {
      const deleteResponse = await request.delete("/api/leads", {
        data: {
          ids: [leadId]
        }
      });

      expect(deleteResponse.ok()).toBeTruthy();
    }
  }
});