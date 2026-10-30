import { Suspense } from "react";
import { notFound } from "next/navigation";
import ResourceManager from "@/components/admin/ResourceManager";
import type { ResourceKey } from "@/lib/fields";

const ALLOWED: ResourceKey[] = ["hero", "events", "team", "gallery", "partners"];

export default async function Page({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!ALLOWED.includes(resource as ResourceKey)) notFound();
  return (
    <Suspense>
      <ResourceManager key={resource} resource={resource as ResourceKey} />
    </Suspense>
  );
}
