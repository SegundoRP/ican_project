import EarningsPageClient from './EarningsPageClient';

export default async function EarningsPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <EarningsPageClient dictionary={dictionary} />;
}