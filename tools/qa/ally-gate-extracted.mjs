const ALLY_ORIGIN_CODES = new Set([
  "US", "USA", "UNITED STATES", "UNITED STATES OF AMERICA", "AMERICA",
  "CA", "CAN", "CANADA",
  "GB", "UK", "UNITED KINGDOM", "GREAT BRITAIN", "ENGLAND", "SCOTLAND", "WALES",
  "AU", "AUS", "AUSTRALIA",
  "NZ", "NEW ZEALAND",
  "JP", "JPN", "JAPAN",
  "KR", "KOR", "KOREA", "SOUTH KOREA", "REPUBLIC OF KOREA",
  "DE", "DEU", "GERMANY",
  "FR", "FRA", "FRANCE",
  "IT", "ITA", "ITALY",
  "ES", "ESP", "SPAIN",
  "NL", "NLD", "NETHERLANDS",
  "BE", "BEL", "BELGIUM",
  "PL", "POL", "POLAND",
  "NO", "NOR", "NORWAY",
  "SE", "SWE", "SWEDEN",
  "DK", "DNK", "DENMARK",
  "FI", "FIN", "FINLAND",
  "IE", "IRL", "IRELAND",
  "PT", "PRT", "PORTUGAL",
  "CZ", "CZE", "CZECH", "CZECH REPUBLIC",
  "AT", "AUT", "AUSTRIA",
  "CH", "CHE", "SWITZERLAND",
  "IL", "ISR", "ISRAEL",
  "TW", "TWN", "TAIWAN",
  "SG", "SGP", "SINGAPORE",
  "IN", "IND", "INDIA",
  "MX", "MEX", "MEXICO",
  "BR", "BRA", "BRAZIL",
  "PH", "PHL", "PHILIPPINES",
  "TH", "THA", "THAILAND",
  "MY", "MYS", "MALAYSIA",
  "ID", "IDN", "INDONESIA",
  "UA", "UKR", "UKRAINE",
  "RO", "ROU", "ROMANIA",
  "HU", "HUN", "HUNGARY",
  "GR", "GRC", "GREECE",
  "TR", "TUR", "TURKEY", "TURKIYE",
  "ZA", "ZAF", "SOUTH AFRICA",
  "LT", "LTU", "LITHUANIA",
  "LV", "LVA", "LATVIA",
  "EE", "EST", "ESTONIA",
  "SK", "SVK", "SLOVAKIA",
  "SI", "SVN", "SLOVENIA",
  "HR", "HRV", "CROATIA",
  "BG", "BGR", "BULGARIA",
  "LU", "LUX", "LUXEMBOURG",
  "IS", "ISL", "ICELAND",
  "MT", "MLT", "MALTA",
  "CY", "CYP", "CYPRUS",
]);

function isAllyOrigin(originCountry) {
  if (!originCountry || typeof originCountry !== "string") return false;
  const normalized = originCountry.trim().toUpperCase().replace(/[._-]+/g, " ").replace(/\s+/g, " ");
  if (normalized.length < 2 || normalized.length > 64) return false;
  if (ALLY_ORIGIN_CODES.has(normalized)) return true;
  // Soft prefix for verbose US forms already covered; keep fail-closed otherwise.
  return false;
}
export { isAllyOrigin };
