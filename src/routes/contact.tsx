import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, Star } from "lucide-react";
import { z } from "zod";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Cta } from "@/components/site/Cta";
import { Pill } from "@/components/site/shared";
import avatar from "@/assets/Ellipse_1.png.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Airnova" },
      {
        name: "description",
        content:
          "Get in touch with the Airnova team. We're here to answer your questions, discuss ideas, and help bring your vision to life.",
      },
      { property: "og:title", content: "Contact — Airnova" },
      {
        property: "og:description",
        content:
          "Reach out to Airnova and we'll get back to you with the support you need.",
      },
      { property: "og:url", content: "https://airnova-template.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://airnova-template.lovable.app/contact" }],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(40),
  budget: z.string().trim().max(80),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type FieldName = keyof z.infer<typeof contactSchema>;

const FIELD_STYLES =
  "w-full border border-black/20 px-6 py-[14px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-black placeholder:text-[#515151] outline-none transition-colors focus:border-black";

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[18px] font-medium leading-[1.5] tracking-[-0.075em] text-black"
    >
      {children}
    </label>
  );
}

function ContactPage() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function set<K extends FieldName>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as FieldName;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("success");
    setValues({ firstName: "", lastName: "", email: "", phone: "", budget: "", message: "" });
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Nav />
      <section className="bg-surface py-16 lg:py-28">
        <div className="container-x flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-10 lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <Pill variant="white">Contact</Pill>
              <h1 className="max-w-[600px] text-[clamp(36px,5.5vw,56px)] font-semibold leading-[1.1] tracking-[-0.065em] text-black">
                Let's Build Something Great Together
              </h1>
              <p className="max-w-[560px] text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#3f3b38]">
                We're here to answer your questions, discuss your ideas, and help bring your
                vision to life. Reach out to our team and we'll get back to you with the support.
              </p>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-20">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-3xl border border-black/15 bg-white">
                  <Phone className="size-5 text-[#f24700]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#3f3b38]">
                    Contact Me
                  </p>
                  <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.055em] text-black">
                    +1 (888) 456 8970
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-3xl border border-black/15 bg-white">
                  <Mail className="size-5 text-[#f24700]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#3f3b38]">
                    Email address
                  </p>
                  <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.055em] text-black">
                    exampl@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="flex max-w-[420px] flex-col gap-8 rounded-[10px] bg-[#070606] p-6">
              <div className="flex flex-col gap-5">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-[#f24700] text-[#f24700]" />
                  ))}
                </div>
                <p className="text-[16px] font-medium leading-[1.5] tracking-[-0.075em] text-white">
                  "The team delivered a clean and modern design that perfectly represents our
                  brand. The entire process was smooth and professional."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={avatar.url}
                  alt="Daniel Smith"
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[18px] font-medium leading-[1.4] tracking-[-0.055em] text-white">
                    Daniel Smith
                  </p>
                  <p className="text-[14px] font-medium leading-[1.5] tracking-[-0.04em] text-white/70">
                    Co-Founder
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex flex-1 flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="firstName">First Name</Label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className={FIELD_STYLES}
                    maxLength={60}
                  />
                  {errors.firstName && <span className="text-xs text-[#f24700]">{errors.firstName}</span>}
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="lastName">Last Name</Label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className={FIELD_STYLES}
                    maxLength={60}
                  />
                  {errors.lastName && <span className="text-xs text-[#f24700]">{errors.lastName}</span>}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Support@gmail.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={FIELD_STYLES}
                    maxLength={255}
                  />
                  {errors.email && <span className="text-xs text-[#f24700]">{errors.email}</span>}
                </div>
                <div className="flex flex-col gap-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+ 123 321 123 1231"
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={FIELD_STYLES}
                    maxLength={40}
                  />
                  {errors.phone && <span className="text-xs text-[#f24700]">{errors.phone}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="budget">Budget</Label>
                <input
                  id="budget"
                  type="text"
                  placeholder="What's your budget"
                  value={values.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className={FIELD_STYLES}
                  maxLength={80}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  placeholder="write your message"
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  className={`${FIELD_STYLES} h-[280px] resize-none p-6`}
                  maxLength={1000}
                />
                {errors.message && <span className="text-xs text-[#f24700]">{errors.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                data-hover-lift
                className="flex h-12 w-full items-center justify-center rounded-[80px] bg-[#070606] px-6 text-base font-medium leading-[1.5] tracking-[-0.075em] text-white shadow-[0_4px_2px_rgba(0,0,0,0.16)]"
              >
                Submit
              </button>
              {status === "success" && (
                <p className="text-center text-sm font-medium text-[#070606]">
                  Thanks — we'll be in touch shortly.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
      <Cta />
      <Footer />
    </main>
  );
}
