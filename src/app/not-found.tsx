import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-32">
      <span className="eyebrow text-orange">404</span>
      <h1 className="display-xl mt-6 text-paper">
        This lane <span className="text-gradient-warm">doesn&apos;t exist.</span>
      </h1>
      <p className="mt-6 max-w-[40ch] text-lg text-paper/60">The page you were routed to has moved or never shipped.</p>
      <div className="mt-8">
        <Button href="/" size="lg">Back to home</Button>
      </div>
    </section>
  );
}
