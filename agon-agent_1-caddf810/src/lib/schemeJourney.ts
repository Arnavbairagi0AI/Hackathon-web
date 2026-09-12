/* Journey metadata shared by the scheme-flow pages. Kept out of
   schemeStore.tsx so that file only exports the provider/hook
   (react-refresh/only-export-components). */

export const JOURNEY_STEPS: { id: 'profile' | 'eligibility' | 'repayment' | 'partner'; label: string; to: string }[] = [
  { id: 'profile', label: 'Profile', to: '/app/schemes/profile' },
  { id: 'eligibility', label: 'Eligibility', to: '/app/schemes/eligibility' },
  { id: 'repayment', label: 'Repayment', to: '/app/schemes/repayment' },
  { id: 'partner', label: 'Partner', to: '/app/schemes/partners' },
];
