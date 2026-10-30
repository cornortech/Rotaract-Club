"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

type T = { id: number; type: "success" | "error"; text: string };
const Ctx = createContext<(type: T["type"], text: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((type: T["type"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((v) => [...v, { id, type, text }]);
    setTimeout(() => setItems((v) => v.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[200] flex flex-col gap-2" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lift ${
              t.type === "success" ? "border-emerald-200 bg-white text-emerald-800" : "border-brand-200 bg-white text-brand-700"
            }`}
          >
            {t.type === "success" ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
