import OrderDetailClient from './OrderDetailClient';

export default async function OrderDetailPage({ params }) {
  const { lang, id } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <OrderDetailClient orderId={id} dictionary={dictionary} />;
}
