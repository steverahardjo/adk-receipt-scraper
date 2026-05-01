export default function Filler() {
  return (
    <section
      className="hidden md:flex relative overflow-hidden"
      aria-label="Abstract financial growth background"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGR_RRscKzeuPNfJfWfliW5QPWRx98O-WjVFf5CuPyBx2OITHTDfkEcj3jrZRqHgpAy27jcocs8Vu_X98L4Z7MzExApLiMbHNvN_8Qn5Uh2-NHWF1RLqIIU0jYIRBUOzpecDdgMd7XtwQ-87JSeCh-k6TEEy9HMg44hmC-DitW86BBTn0-ya1dcNSFjisuIeGC3Ijv0o5evR-r08a6oLhMp5DefBWlHhCGGsz7JQ-8XVNIbHPwF2FZHS6YUIm5Zlaq3SuFHDfwN3Y')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* overlay (theme-aware) */}
      <div
        className="absolute inset-0 bg-gradient-to-br
        from-[var(--deneb-blue)]/40
        to-[var(--lagoon)]/20
        dark:from-[var(--deneb-blue)]/70
        dark:to-[var(--lagoon)]/50"
      />

      {/* content */}
      <div className="relative z-10 p-12 flex flex-col justify-between w-full text-foreground dark:text-white">
        <div className="font-bold text-2xl">Deneb</div>

        <div className="max-w-md">
          <h1 className="display-title text-5xl mb-6 leading-tight">
            Your financial <br /> North Star.
          </h1>

          <p className="text-lg text-muted-foreground dark:text-white/80">
            Clear guidance and calm control over your finances.
          </p>
        </div>

        <div className="text-xs text-muted-foreground dark:text-white/50">
          © 2026 Deneb
        </div>
      </div>
    </section>
  )
}
