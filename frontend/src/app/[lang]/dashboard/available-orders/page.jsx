import AvailableOrdersClient from './AvailableOrdersClient';

export default async function AvailableOrdersPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <AvailableOrdersClient dictionary={dictionary} />;
}
