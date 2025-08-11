import DeliveryHistoryClient from './DeliveryHistoryClient';

export default async function DeliveryHistoryPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <DeliveryHistoryClient dictionary={dictionary} />;
}