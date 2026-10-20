import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CopyrightPage() {
  return (
    <main className="max-w-md mx-auto p-4 pt-8 pb-24 space-y-6">
      <Link href="/study" className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black mb-2">
        <ChevronLeft size={16} /> Back to Study
      </Link>

      <h1 className="text-2xl font-black tracking-tight">COPYRIGHT NOTICE</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 text-xs text-gray-700 leading-relaxed">
        <p>
          Scripture quotations marked &ldquo;ESV&rdquo; are from the ESV&reg; Bible (The Holy Bible, English Standard Version&reg;), &copy; 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.
        </p>

        <p className="font-semibold text-gray-900 pt-2 border-t border-gray-100">
          Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible.
        </p>
      </div>
    </main>
  );
}