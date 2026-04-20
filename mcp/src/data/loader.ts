import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");

export interface Stratum {
  id: string;
  label: string;
  name: string;
  color: string;
  definition: string;
  boundaryQuestion: string;
  oneLiner: string;
  substrates: string[];
  constructs: string[];
  primitives: string[];
  typicalFailures: string[];
  coreMetrics: string[];
}

export interface Concept {
  slug: string;
  name: string;
  aliases: string[];
  shortDefinition: string;
  explainer: string;
  strata: string[];
  axes: string[];
  relatedProductIds: string[];
  relatedConceptSlugs: string[];
  antiPatterns: string[];
  mitigations: string[];
  sources: { label: string; href: string }[];
  status: string;
  confidence: number;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  vendor: string;
  deployment: string;
  license: string;
  primary: string;
  secondary: string;
  axisRoles: string;
  confidence: number;
  rationale: string;
  conceptMappings: {
    conceptSlug: string;
    role: string;
    rank: number;
    why: string;
  }[];
  status: string;
}

interface StrataFile {
  version: string;
  strata: Stratum[];
}

interface ConceptsFile {
  concepts: Concept[];
}

interface ProductsFile {
  products: Product[];
}

let _strata: Stratum[] | null = null;
let _concepts: Concept[] | null = null;
let _products: Product[] | null = null;
let _version: string = "v1.0.0";

function loadFile<T>(filename: string): T {
  const content = readFileSync(resolve(DATA_DIR, filename), "utf-8");
  return JSON.parse(content) as T;
}

export function getStrata(): Stratum[] {
  if (!_strata) {
    const data = loadFile<StrataFile>("strata.json");
    _strata = data.strata;
    _version = data.version;
  }
  return _strata;
}

export function getConcepts(): Concept[] {
  if (!_concepts) {
    const data = loadFile<ConceptsFile>("concepts.json");
    _concepts = data.concepts;
  }
  return _concepts;
}

export function getProducts(): Product[] {
  if (!_products) {
    const data = loadFile<ProductsFile>("products.json");
    _products = data.products;
  }
  return _products;
}

export function getVersion(): string {
  getStrata(); // ensures _version is loaded
  return _version;
}
