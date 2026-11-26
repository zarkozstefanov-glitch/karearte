"use client";
import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";

/** Keeps <html lang> right after client-side language switches (one shared root layout). */
export function LangAttr({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
