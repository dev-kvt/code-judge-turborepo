import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const tabarr = [
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    name: "Terms",
    href: "/terms",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];
export function Footer() {
  const year = dayjs().year();
  return (
    <footer className="text-sm flex w-full flex-col sm:flex-row flex-wrap items-center justify-center border-default-top py-4 px-6 text-center sm:justify-between bg-neutral-950/50 border-neutral-800 gap-y-2">
      <div className="flex items-center text-neutral-400">
        <span>&copy; {year}</span>
        <span className="ml-2 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          AI-Powered Code Grading & Doubt Resolution Portal
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 justify-center items-center text-xs text-neutral-500 font-medium">
        <span>Sandboxed Docker Execution</span>
        <span>•</span>
        <span>LangChain Dual-LLM Resilience</span>
        <span>•</span>
        <span>Prompt Injection Guardrails</span>
        <span>•</span>
        <span>Teacher State Machine Workflow</span>
      </div>
    </footer>
  );
}

export default Footer;
