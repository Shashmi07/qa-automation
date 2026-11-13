import boundaryValues from "./data/m1-boundary-values.json";
import { test, expect } from "./fixtures/crm.fixture";

for (const data of boundaryValues) {
  test(`M1 boundary value: ${data.name}`, async ({ crm }) => {
    const createdLead = await crm.createLead(data);

    expect(createdLead.id).toBeTruthy();
    expect(createdLead.name).toBe(data.name);
  });
}