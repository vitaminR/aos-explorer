#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getStrata,
  getConcepts,
  getProducts,
  getVersion,
} from "./data/loader.js";
import type { Stratum, Concept, Product } from "./data/loader.js";

const server = new McpServer({
  name: "aos-taxonomy",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Utility: case-insensitive substring match
// ---------------------------------------------------------------------------
function matches(haystack: string | undefined, needle: string): boolean {
  if (!haystack) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

// ---------------------------------------------------------------------------
// Tool 1: search_products
// ---------------------------------------------------------------------------
server.tool(
  "search_products",
  "Search the {a}OS product catalog by name, vendor, description, or stratum. Returns matching products with their strata placements and confidence scores.",
  {
    query: z.string().describe("Search query (name, vendor, or keyword)"),
    stratum: z.string().optional().describe("Filter by stratum ID (l1-l7)"),
    license: z
      .string()
      .optional()
      .describe("Filter by license (Open Source, Proprietary)"),
  },
  async ({ query, stratum, license }) => {
    let results = getProducts().filter(
      (p) =>
        matches(p.name, query) ||
        matches(p.vendor, query) ||
        matches(p.rationale, query) ||
        matches(p.type, query),
    );

    if (stratum) {
      const sid = stratum.toLowerCase();
      results = results.filter(
        (p) =>
          p.primary?.toLowerCase() === sid ||
          p.secondary?.toLowerCase().includes(sid),
      );
    }

    if (license) {
      results = results.filter((p) => matches(p.license, license));
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No products found matching "${query}".`,
          },
        ],
      };
    }

    const text = results
      .map(
        (p) =>
          `## ${p.name} (${p.vendor})\n` +
          `- Type: ${p.type}\n` +
          `- Primary: ${p.primary}\n` +
          `- Secondary: ${p.secondary || "none"}\n` +
          `- License: ${p.license}\n` +
          `- Deployment: ${p.deployment}\n` +
          `- Confidence: ${Math.round((p.confidence || 0) * 100)}%\n` +
          `- Rationale: ${p.rationale || "N/A"}`,
      )
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${results.length} product(s):\n\n${text}`,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 2: get_stratum
// ---------------------------------------------------------------------------
server.tool(
  "get_stratum",
  "Get the full definition of an {a}OS stratum (layer), including substrates, constructs, primitives, typical failures, and core metrics.",
  {
    id: z.string().describe("Stratum ID: l1, l2, l3, l4, l5, l6, or l7"),
  },
  async ({ id }) => {
    const sid = id.toLowerCase();
    const stratum = getStrata().find((s) => s.id === sid);

    if (!stratum) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown stratum "${id}". Valid IDs: l1, l2, l3, l4, l5, l6, l7.`,
          },
        ],
      };
    }

    const text =
      `# ${stratum.label} — ${stratum.name}\n\n` +
      `**Definition:** ${stratum.definition}\n\n` +
      `**Boundary question:** ${stratum.boundaryQuestion}\n\n` +
      `**Substrates:** ${stratum.substrates.join(", ")}\n\n` +
      `**Constructs:** ${stratum.constructs.join(", ")}\n\n` +
      `**Primitives:** ${stratum.primitives.join(", ")}\n\n` +
      `**Typical failures:** ${stratum.typicalFailures.join("; ")}\n\n` +
      `**Core metrics:** ${stratum.coreMetrics.join(", ")}`;

    return { content: [{ type: "text" as const, text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool 3: lookup_concept
// ---------------------------------------------------------------------------
server.tool(
  "lookup_concept",
  "Look up an {a}OS taxonomy concept by slug or alias. Returns the full concept definition including explainer, anti-patterns, mitigations, and related concepts.",
  {
    slug: z
      .string()
      .describe("Concept slug (e.g., 'harness', 'mcp', 'rag') or an alias"),
  },
  async ({ slug }) => {
    const key = slug.toLowerCase().trim();
    const concepts = getConcepts();

    let concept = concepts.find((c) => c.slug === key);
    if (!concept) {
      concept = concepts.find((c) =>
        c.aliases?.some((a) => a.toLowerCase().trim() === key),
      );
    }

    if (!concept) {
      const available = concepts.map((c) => c.slug).join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Concept "${slug}" not found. Available: ${available}`,
          },
        ],
      };
    }

    const text =
      `# ${concept.name} (/${concept.slug})\n\n` +
      `**Definition:** ${concept.shortDefinition}\n\n` +
      `**Explainer:** ${concept.explainer}\n\n` +
      `**Strata:** ${concept.strata.join(", ")}\n` +
      `**Axes:** ${(concept.axes || []).join(", ") || "N/A"}\n` +
      `**Status:** ${concept.status}\n` +
      `**Confidence:** ${Math.round((concept.confidence || 0) * 100)}%\n\n` +
      (concept.aliases?.length
        ? `**Aliases:** ${concept.aliases.join(", ")}\n\n`
        : "") +
      (concept.antiPatterns?.length
        ? `**Anti-patterns:**\n${concept.antiPatterns.map((a) => `- ${a}`).join("\n")}\n\n`
        : "") +
      (concept.mitigations?.length
        ? `**Mitigations:**\n${concept.mitigations.map((m) => `- ${m}`).join("\n")}\n\n`
        : "") +
      (concept.relatedConceptSlugs?.length
        ? `**Related concepts:** ${concept.relatedConceptSlugs.join(", ")}\n`
        : "") +
      (concept.relatedProductIds?.length
        ? `**Related products:** ${concept.relatedProductIds.join(", ")}\n`
        : "");

    return { content: [{ type: "text" as const, text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool 4: get_primitive
// ---------------------------------------------------------------------------
server.tool(
  "get_primitive",
  "Find which {a}OS stratum owns a given primitive. Searches across all 7 strata to locate the primitive and return its context.",
  {
    name: z
      .string()
      .describe("Primitive name (e.g., 'trace_id', 'token', 'user_id')"),
  },
  async ({ name }) => {
    const key = name.toLowerCase().trim();
    const results: { stratum: Stratum; primitive: string }[] = [];

    for (const s of getStrata()) {
      for (const p of s.primitives) {
        if (p.toLowerCase().includes(key)) {
          results.push({ stratum: s, primitive: p });
        }
      }
    }

    if (results.length === 0) {
      const allPrimitives = getStrata()
        .flatMap((s) => s.primitives)
        .join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Primitive "${name}" not found. Available primitives: ${allPrimitives}`,
          },
        ],
      };
    }

    const text = results
      .map(
        (r) =>
          `- **${r.primitive}** → ${r.stratum.label} ${r.stratum.name}\n` +
          `  Definition: ${r.stratum.definition}`,
      )
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Found "${name}" in ${results.length} stratum/strata:\n\n${text}`,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool 5: compare_products
// ---------------------------------------------------------------------------
server.tool(
  "compare_products",
  "Compare 2-5 products from the {a}OS catalog side-by-side. Shows strata placements, confidence, vendor, license, and concept mappings for each.",
  {
    ids: z
      .array(z.string())
      .min(2)
      .max(5)
      .describe("Array of product IDs to compare"),
  },
  async ({ ids }) => {
    const products = getProducts();
    const found: Product[] = [];
    const notFound: string[] = [];

    for (const id of ids) {
      const p = products.find((pr) => pr.id === id.toLowerCase());
      if (p) found.push(p);
      else notFound.push(id);
    }

    if (found.length < 2) {
      const available = products.map((p) => p.id).join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Need at least 2 valid products to compare. ${notFound.length ? `Not found: ${notFound.join(", ")}. ` : ""}Available: ${available}`,
          },
        ],
      };
    }

    const header = `| Property | ${found.map((p) => p.name).join(" | ")} |`;
    const sep = `| --- | ${found.map(() => "---").join(" | ")} |`;
    const rows = [
      `| Vendor | ${found.map((p) => p.vendor).join(" | ")} |`,
      `| Type | ${found.map((p) => p.type).join(" | ")} |`,
      `| Primary | ${found.map((p) => p.primary).join(" | ")} |`,
      `| Secondary | ${found.map((p) => p.secondary || "none").join(" | ")} |`,
      `| License | ${found.map((p) => p.license).join(" | ")} |`,
      `| Deployment | ${found.map((p) => p.deployment).join(" | ")} |`,
      `| Confidence | ${found.map((p) => `${Math.round((p.confidence || 0) * 100)}%`).join(" | ")} |`,
    ];

    let text = `# Product Comparison\n\n${header}\n${sep}\n${rows.join("\n")}`;

    if (notFound.length) {
      text += `\n\n> Products not found: ${notFound.join(", ")}`;
    }

    return { content: [{ type: "text" as const, text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool 6: classify_tool
// ---------------------------------------------------------------------------
server.tool(
  "classify_tool",
  "Suggest which {a}OS stratum a tool or framework likely belongs to. Uses keyword matching against stratum definitions, substrates, and constructs to produce a ranked list.",
  {
    name: z
      .string()
      .describe(
        "Tool or framework name (e.g., 'LangGraph', 'Prometheus', 'Vault')",
      ),
    description: z
      .string()
      .optional()
      .describe("Optional description to improve classification accuracy"),
  },
  async ({ name, description }) => {
    const searchText = `${name} ${description || ""}`.toLowerCase();
    const strata = getStrata();

    const scores: { stratum: Stratum; score: number; reasons: string[] }[] =
      strata.map((s) => {
        let score = 0;
        const reasons: string[] = [];

        // Check substrates
        for (const sub of s.substrates) {
          if (
            searchText.includes(sub.toLowerCase()) ||
            sub.toLowerCase().includes(searchText.split(" ")[0])
          ) {
            score += 3;
            reasons.push(`substrate match: "${sub}"`);
          }
        }

        // Check constructs
        for (const con of s.constructs) {
          if (searchText.includes(con.toLowerCase())) {
            score += 2;
            reasons.push(`construct match: "${con}"`);
          }
        }

        // Check definition keywords
        const defWords = s.definition.toLowerCase().split(/\W+/);
        const searchWords = searchText.split(/\W+/);
        for (const w of searchWords) {
          if (w.length > 3 && defWords.includes(w)) {
            score += 1;
            reasons.push(`definition keyword: "${w}"`);
          }
        }

        // Check name in oneLiner
        if (s.oneLiner.toLowerCase().includes(name.toLowerCase())) {
          score += 2;
          reasons.push("name appears in one-liner");
        }

        return { stratum: s, score, reasons };
      });

    const ranked = scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text:
              `Could not confidently classify "${name}". Provide a description for better results.\n\n` +
              `The 7 strata are:\n${strata.map((s) => `- ${s.label} ${s.name}: ${s.oneLiner}`).join("\n")}`,
          },
        ],
      };
    }

    const text =
      `# Classification suggestion for "${name}"\n\n` +
      ranked
        .slice(0, 3)
        .map(
          (r, i) =>
            `${i + 1}. **${r.stratum.label} ${r.stratum.name}** (score: ${r.score})\n` +
            `   ${r.stratum.definition}\n` +
            `   Reasons: ${r.reasons.join(", ")}`,
        )
        .join("\n\n") +
      `\n\n> Note: Classification is based on keyword matching. For authoritative placement, submit evidence to the {a}OS catalog.`;

    return { content: [{ type: "text" as const, text }] };
  },
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
