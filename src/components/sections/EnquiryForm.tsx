"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { FormField } from "@/lib/content";
import { cn } from "@/lib/utils";

const validators: Record<string, (v: string) => string | null> = {
  name: (v) => (/^[A-Za-z .'-]{2,}$/.test(v.trim()) ? null : "Letters only, please"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email"),
  tel: (v) => (/^[\d\s+()-]{8,15}$/.test(v) ? null : "Enter a valid phone number"),
  url: (v) => (/^https?:\/\/.+/.test(v) ? null : "Include https://"),
  number: (v) => (Number(v) > 0 ? null : "Enter a number above 0"),
};

type Props = {
  title?: string;
  fields: FormField[];
  submitLabel: string;
  tone?: "dark" | "light";
  extra?: React.ReactNode;
  successTitle?: string;
  successBody?: string;
};

/** Content-driven form with inline validation and an animated success state. No backend wired yet. */
export function EnquiryForm({ title, fields, submitLabel, tone = "dark", extra, successTitle = "Message sent", successBody = "Our team will get back to you within 24 hours." }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const dark = tone === "dark";

  const validate = () => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name] ?? "";
      if (f.required && !v.trim()) next[f.name] = "Required";
      else if (v && (validators[f.validate ?? ""] ?? validators[f.type])) {
        const err = (validators[f.validate ?? ""] ?? validators[f.type])(v);
        if (err) next[f.name] = err;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("sending");
    await new Promise((r) => setTimeout(r, 1100));
    setState("done");
  };

  const inputCls = (name: string) =>
    cn(
      "peer w-full rounded-2xl border px-4 pt-6 pb-2.5 text-[15px] outline-none transition-all duration-300",
      dark
        ? "bg-white/[0.04] border-white/10 text-paper placeholder:text-transparent focus:border-orange focus:bg-white/[0.07]"
        : "bg-white border-navy/12 text-navy placeholder:text-transparent focus:border-orange",
      errors[name] && "!border-red-400",
    );
  const labelCls = cn(
    "pointer-events-none absolute left-4 top-4 origin-left text-sm transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.78]",
    dark ? "text-paper/50 peer-focus:text-orange" : "text-navy/50 peer-focus:text-orange",
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[380px] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-orange text-ink shadow-glow-orange"
            >
              <Check className="h-9 w-9" strokeWidth={2.5} />
            </motion.span>
            <h3 className={cn("mt-8 font-display text-3xl font-bold", dark ? "text-paper" : "text-navy")}>{successTitle}</h3>
            <p className={cn("mt-3 max-w-[36ch]", dark ? "text-paper/60" : "text-navy/60")}>{successBody}</p>
            <button onClick={() => { setState("idle"); setValues({}); }} className="mt-8 text-sm underline underline-offset-4 opacity-70 hover:opacity-100">
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="grid gap-4 sm:grid-cols-2">
            {title && <h3 className={cn("sm:col-span-2 eyebrow", dark ? "text-orange" : "text-orange")}>{title}</h3>}
            {fields.map((f) => {
              const common = {
                id: f.name,
                name: f.name,
                placeholder: f.placeholder,
                required: f.required,
                value: values[f.name] ?? "",
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  setValues((v) => ({ ...v, [f.name]: e.target.value }));
                  if (errors[f.name]) setErrors((er) => ({ ...er, [f.name]: "" }));
                },
              };
              return (
                <div key={f.name} className={cn("relative", !f.half && "sm:col-span-2")}>
                  {f.type === "textarea" ? (
                    <textarea {...common} rows={4} className={cn(inputCls(f.name), "resize-none")} />
                  ) : f.type === "select" ? (
                    <>
                      <select {...common} className={cn(inputCls(f.name), "appearance-none", !values[f.name] && (dark ? "text-paper/50" : "text-navy/50"))}>
                        <option value="">{f.placeholder}</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o} className="text-ink">
                            {o}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={cn("pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2", dark ? "text-paper/50" : "text-navy/50")} />
                    </>
                  ) : (
                    <input {...common} type={f.type} className={inputCls(f.name)} />
                  )}
                  <label htmlFor={f.name} className={cn(labelCls, f.type === "select" && "-translate-y-2 scale-[0.78]")}>
                    {f.label}
                    {f.required && <span className="text-orange"> *</span>}
                  </label>
                  <AnimatePresence>
                    {errors[f.name] && (
                      <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 block pl-1 text-xs text-red-400">
                        {errors[f.name]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {extra && <div className="sm:col-span-2">{extra}</div>}
            <div className="sm:col-span-2 pt-2">
              <Button type="submit" size="lg" magnetic={false} disabled={state === "sending"} className="w-full sm:w-auto">
                {state === "sending" ? "Sending…" : submitLabel}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
