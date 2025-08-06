import OrdersPageClient from './OrdersPageClient';

export default async function pageOrdenes({params}) {
  const {lang} = params;
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <OrdersPageClient dictionary={dictionary} />;
}
