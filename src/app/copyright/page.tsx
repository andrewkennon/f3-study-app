'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function CopyrightPage() {
  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/discovery"
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-sm font-black uppercase tracking-wider">Copyright & Licensing</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Shield size={18} className="text-black" />
          <h2 className="font-black text-sm text-black">ESV® Bible Copyright Notice</h2>
        </div>

        <p>
          Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.
        </p>

        <p>
          Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.
        </p>

        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
          For further permissions or inquiries regarding the English Standard Version, visit{' '}
          <a
            href="https://www.esv.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-black"
          >
            esv.org
          </a>.
        </div>
      </div>
    </main>
  );
}