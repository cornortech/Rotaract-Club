// Types for the admin forms. The actual form definitions come from the backend
// (backend/src/data/fields.js), so fields are defined in one place only.
export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "email"
  | "tel"
  | "link"
  | "url"
  | "number"
  | "date"
  | "image"
  | "images"
  | "toggle"
  | "select"
  | "pairs"
  | "cards"
  | "map";

export type Field = {
  name: string; // dot path, e.g. "contact.email"
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  suggestions?: string[];
  full?: boolean; // full-width in the form grid
};

export type SettingsSection = { key: string; title: string; description: string; fields: Field[] };

export type ResourceKey = "hero" | "events" | "team" | "gallery" | "partners" | "messages";

export type ResourceConfig = {
  key: ResourceKey;
  title: string;
  singular: string;
  description: string;
  fields: Field[];
  columns: { name: string; label: string; type?: "image" | "date" | "toggle" | "text" }[];
  sort: Record<string, 1 | -1>;
  canCreate: boolean;
  bulkImages?: boolean;
};

/** Read a nested value by dot path. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPath(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Set a nested value by dot path (returns a new object). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setPath(obj: any, path: string, value: unknown): any {
  const [k, ...rest] = path.split(".");
  const base = obj && typeof obj === "object" ? obj : {};
  if (!rest.length) return { ...base, [k]: value };
  return { ...base, [k]: setPath(base[k], rest.join("."), value) };
}
