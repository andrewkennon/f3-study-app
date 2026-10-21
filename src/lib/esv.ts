export async function fetchESVScripture(passage: string): Promise<string> {
  try {
    const res = await fetch(`/api/esv?passage=${encodeURIComponent(passage)}`);
    if (!res.ok) throw new Error('API route error');
    const data = await res.json();
    return data.html;
  } catch (error) {
    console.error('Error fetching scripture from internal API:', error);
    return `<p class="text-red-500">Unable to load scripture reference: ${passage}</p>`;
  }
}