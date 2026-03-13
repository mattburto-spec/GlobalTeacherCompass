'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green/10 text-green px-4 py-2 rounded-full text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          You&apos;re on the list!
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="you@school.edu"
        className="form-input flex-1 !bg-white !border-sand-dark/20 text-center sm:text-left"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="bg-navy hover:bg-navy-light text-sand-light px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
      >
        Join Waitlist
      </button>
    </form>
  );
}
