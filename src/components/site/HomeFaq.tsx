import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { serif, BrandMark } from "@/components/site/shared";

const faqs = [
  {
    q: "What services do you offer?",
    a: "We offer a range of creative services including UI/UX design, web design, brand identity design, and digital product design to help businesses build a strong online presence.",
  },
  { q: "What tools do you use for design?", a: "Figma, Adobe Creative Suite, and Framer for prototyping." },
  { q: "How long does a design project usually take?", a: "Most projects take between 4–8 weeks depending on scope." },
  { q: "Do you provide responsive design?", a: "Yes, every design we ship is fully responsive across all devices." },
  { q: "Can I request revisions during the project?", a: "Absolutely — revisions are part of our collaborative process." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-white py-16 lg:py-28">
      <div className="container-x flex flex-col items-center gap-12 sm:gap-16">
        <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center justify-center gap-[10px] rounded-lg bg-[#f5f5f5] px-[14px] py-2">
          <BrandMark size={24} />
          <span className="text-base font-medium leading-[1.5] tracking-[-0.075em] text-black">
            FAQ
          </span>
        </div>
        <h2 className="max-w-[650px] text-center text-[clamp(24px,4.5vw,56px)] font-semibold leading-[1.2] tracking-[-0.065em] text-[#070606]">
          Answers to{" "}
          <span className={`${serif} text-[#070606]/50`}>your most</span> common questions
        </h2>
        <p className="max-w-[617px] text-center text-[10px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
          Find answers to some of the most common questions about our design services process and
          collaboration. This section helps you quickly understand how we work.
        </p>
      </div>

      <div className="flex w-full max-w-[900px] flex-col gap-3 bg-[#f5f5f5] p-4 sm:gap-6 sm:p-8">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <button
              key={f.q}
              onClick={() => setOpen(isOpen ? -1 : i)}
              data-no-hover-fx
              className="block w-full cursor-pointer rounded-[10px] bg-white px-6 py-4 text-left transition"
            >
              <div className="flex items-center justify-between gap-8 sm:gap-16">
                <span className="text-[clamp(12px,1.8vw,26px)] font-medium leading-[1.5] tracking-[-0.075em] text-black">
                  {f.q}
                </span>
                <span className="grid size-[22px] sm:size-[54px] shrink-0 place-items-center">
                  <span className="grid size-[16px] sm:size-[38px] place-items-center rounded-full bg-[#070606] text-white">
                    {isOpen ? <Minus className="size-3 sm:size-4" strokeWidth={2.5} /> : <Plus className="size-3 sm:size-4" strokeWidth={2.5} />}
                  </span>
                </span>
              </div>
              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="overflow-hidden text-[8px] sm:text-base font-medium leading-[1.5] tracking-[-0.075em] text-[#515151]">
                  {f.a}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </section>
  );
}

export default Faq;
