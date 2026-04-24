'use client';

import { signOut } from 'next-auth/react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg">
          H
        </div>
        <div>
          <p className="text-white font-semibold leading-tight">Higher Image</p>
          <p className="text-amber-500 text-xs font-medium tracking-wide">Hair Studio</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-zinc-500 hover:text-white text-sm transition-colors"
      >
        Sign out
      </button>
    </header>
  );
}
