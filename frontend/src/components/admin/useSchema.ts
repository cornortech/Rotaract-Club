"use client";

import { useEffect, useState } from "react";
import type { ResourceConfig, ResourceKey, SettingsSection } from "@/lib/fields";
import { api } from "./api";

type Schema = { settings: SettingsSection[]; resources: Record<ResourceKey, ResourceConfig> };
let promise: Promise<Schema> | null = null;

/** Form definitions from the backend (loaded once per visit). */
export function useSchema() {
  const [schema, setSchema] = useState<Schema | null>(null);
  useEffect(() => {
    promise ??= api<Schema>("/api/admin/schema").catch((e) => {
      promise = null;
      throw e;
    });
    promise.then(setSchema).catch(() => {});
  }, []);
  return schema;
}
