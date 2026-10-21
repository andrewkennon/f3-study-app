import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get('passage') || 'Proverbs 27:17';
  const apiKey = process.env.ESV_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { html: `<p class="italic text-gray-500">[ESV API Key missing in environment. Displaying fallback]: "As iron sharpens iron, so one man sharpens another." (${passage})</p>` },
      { status: 200 }
    );
  }

  const url = `https://api.esv.org/v3/passage/html/?q=${encodeURIComponent(
    passage
  )}&include-footnotes=false&include-headings=false&include-audio-link=false&include-short-copyright=false`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${apiKey}` },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`ESV API Error: ${res.status}`);

    const data = await res.json();
    return NextResponse.json({ html: data.passages[0] || '<p>Passage not found.</p>' });
  } catch (error) {
    console.error('ESV Fetch Error:', error);
    return NextResponse.json(
      { html: `<p class="text-red-500">Unable to load scripture reference: ${passage}</p>` },
      { status: 500 }
    );
  }
}