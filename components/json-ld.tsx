/**
 * schema.org structured data as a plain script tag, so it is in the server-rendered HTML that
 * crawlers read (next/script only adds inline scripts once the page hydrates).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so text in the data can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
