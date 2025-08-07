import ActiveDeliveriesClient from './ActiveDeliveriesClient';

export default async function ActiveDeliveriesPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <ActiveDeliveriesClient dictionary={dictionary} />;
}