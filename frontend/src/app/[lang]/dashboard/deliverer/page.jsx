import DelivererDashboardClient from './DelivererDashboardClient';

export default async function DelivererDashboardPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <DelivererDashboardClient dictionary={dictionary} />;
}