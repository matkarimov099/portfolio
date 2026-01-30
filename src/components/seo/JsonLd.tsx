interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LD structured data komponenti
 * Google va boshqa search enginelar uchun schema.org ma'lumotlarini inject qiladi
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(data)}
    </script>
  );
}
