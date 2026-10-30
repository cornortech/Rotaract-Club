import { Suspense } from "react";
import SettingsEditor from "@/components/admin/SettingsEditor";
export default function Page() {
  return (
    <Suspense>
      <SettingsEditor />
    </Suspense>
  );
}
