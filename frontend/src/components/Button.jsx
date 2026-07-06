import React from 'react';

const VARIANTS = {
  primary: 'bg-forest text-paper hover:bg-forest-light active:bg-forest-dark',
  secondary: 'bg-transparent text-forest border border-forest hover:bg-forest/5',
  danger: 'bg-rust text-paper hover:bg-rust/90',
  ghost: 'bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
