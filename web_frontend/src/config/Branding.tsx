import { Wallet } from 'lucide-react'

/* ---------------- LOGOS ---------------- */

export const Branding = {
  app: {
    name: 'Deneb',
    Logo: ({ className = 'h-6 w-6' }: { className?: string }) => (
      <Wallet className={className} />
    ),
  },

  filler: {
    name: 'filler',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGR_RRscKzeuPNfJfWfliW5QPWRx98O-WjVFf5CuPyBx2OITHTDfkEcj3jrZRqHgpAy27jcocs8Vu_X98L4Z7MzExApLiMbHNvN_8Qn5Uh2-NHWF1RLqIIU0jYIRBUOzpecDdgMd7XtwQ-87JSeCh-k6TEEy9HMg44hmC-DitW86BBTn0-ya1dcNSFjisuIeGC3Ijv0o5evR-r08a6oLhMp5DefBWlHhCGGsz7JQ-8XVNIbHPwF2FZHS6YUIm5Zlaq3SuFHDfwN3Y',
  },
  google: {
    name: 'Google',
    logo: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
        alt="Google"
        className="h-5 w-5"
      />
    ),
  },

  // future-proof
  github: {
    name: 'GitHub',
    logo: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
        alt="GitHub"
        className="h-5 w-5"
      />
    ),
  },
}
