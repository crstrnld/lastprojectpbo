import React from 'react';

// Styled like a rubber library stamp - status at a glance.
const TONES = {
  borrowed: 'bg-brass/15 text-brass-dark border-brass/40',
  returned: 'bg-forest/10 text-forest border-forest/30',
  overdue: 'bg-rust/10 text-rust border-rust/40',
  active: 'bg-forest/10 text-forest border-forest/30',
  inactive: 'bg-ink/5 text-ink/50 border-ink/20',
  admin: 'bg-rust/10 text-rust border-rust/30',
  librarian: 'bg-brass/15 text-brass-dark border-brass/40',
  user: 'bg-forest/10 text-forest border-forest/30',
};

export default function Badge({ children, tone = 'user', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
        uppercase tracking-wide font-mono ${TONES[tone] || TONES.user} ${className}`}
    >
      {children}
    </span>
  );
}
