import { slugify } from "../../examples/utils";

const getLink = (example: ExampleTest) =>
  cy.get(`a[id='example-${slugify(example.title)}'`);
const getButton = (example: ExampleTest) => getLink(example).find("button");

interface ExampleTest {
  title: string;
  filename: string;
}

interface ComparisonResult {
  status: "passed" | "failed";
  message?: string;
}

export const examples: ExampleTest[] = [
  {
    title: "Using usePDF hook",
    filename: "usepdf-example.pdf",
  },
  {
    title: "Using default function",
    filename: "function-example.pdf",
  },
  {
    title: "Multipage support",
    filename: "multipage-example.pdf",
  },
  {
    title: "Advanced options",
    filename: "advanced-example.pdf",
  },
];

describe("template spec", () => {
  before(() => {
    cy.visit("http://localhost:1234");
  });

  it("pdfs must mach baseline", () => {
    examples.forEach((example) => {
      getLink(example).should("be.visible");
      getButton(example).should("be.visible");
      getButton(example).click();
    });
    cy.wait(10000);
    examples.forEach((example) => {
      cy.task("compareFile", example.filename).then(
        (result: ComparisonResult) => {
          expect(result.message).to.equal("");
          expect(result.status).to.equal("passed");
        }
      );
    });
  });
});
