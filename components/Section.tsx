import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";

export function Section({id, variant="base", title, subtitle, children}:{
  id?: string;
  variant?: "base" | "alt";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28 scroll-mt-20", variant === "alt" && "border-y border-white/5 bg-white/[0.02]")}>
      <Container>
        <div className="mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#ff425d] to-[#2ed8ff] opacity-70" />
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-[44px] md:leading-[1.1]" style={{textWrap: "balance"}}>{title}</h2>
          {subtitle && <p className="max-w-[60ch] text-base text-white/65 md:text-lg">{subtitle}</p>}
        </div>
        <div className="mt-8 md:mt-10">{children}</div>
      </Container>
    </section>
  );
}
