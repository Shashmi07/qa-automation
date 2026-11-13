import { faker } from "@faker-js/faker";

export type LeadData = {
  name: string;
  email: string;
  phone: string;
};

export function newLead(): LeadData {
  const prefix = faker.helpers.arrayElement([
    "70",
    "71",
    "72",
    "74",
    "75",
    "76",
    "77",
    "78"
  ]);

  return {
    name: `${faker.company.name()} ${faker.string.alphanumeric(6)}`,
    email: faker.internet.email().toLowerCase(),
    phone: `+94 ${prefix} ${faker.string.numeric(7)}`
  };
}