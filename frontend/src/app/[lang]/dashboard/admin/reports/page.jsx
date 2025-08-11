import ReportsClient from './ReportsClient';

export default async function ReportsPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <ReportsClient dictionary={dictionary} />;
}