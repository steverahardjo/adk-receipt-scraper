import { Component, Wallet } from 'lucide-react'

/* ---------------- LOGOS ---------------- */

export const Branding = {
  app: {
    name: 'Deneb',
    Logo: ({ className = 'h-6 w-6' }: { className?: string }) => (
      <Wallet className={className} />
    ),
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
