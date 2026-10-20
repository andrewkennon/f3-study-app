export async function fetchESVScripture(passage: string): Promise<string> {
  const apiKey = process.env.ESV_API_KEY;

  if (!apiKey) {
    return `<p class="italic text-gray-500">[ESV API Key missing in .env.local. Displaying fallback for ${passage}]: "As iron sharpens iron, so one man sharpens another." (Proverbs 27:17)</p>`;
  }

  const url = `https://api.esv.org/v3/passage/html/?q=${encodeURIComponent(
    passage
  )}&include-footnotes=false&include-headings=false&include-audio-link=false&include-short-copyright=false`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Token ${apiKey}` },
      next: { revalidate: 86400 },
    });

    if (!response.ok) throw new Error(`ESV API error: ${response.status}`);
    const data = await response.json();
    return data.passages[0] || '<p>Scripture passage not found.</p>';
  } catch (error) {
    console.error('Error fetching ESV scripture:', error);
    return `<p class="text-red-500">Unable to load scripture reference: ${passage}</p>`;
  }
}