import React from 'react';

export default function Input({ label, error, id, className = '', ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink/80">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-md border bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink/35
          focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest
          ${error ? 'border-rust' : 'border-border'} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-rust">{error}</span>}
    </div>
  );
}
