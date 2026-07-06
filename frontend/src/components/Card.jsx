import React from 'react';

export default function Card({ children, className = '', stub = false, ...rest }) {
  return (
    <div
      className={`relative rounded-lg border border-border bg-card shadow-card
        ${stub ? 'card-stub pl-8' : 'p-5'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
