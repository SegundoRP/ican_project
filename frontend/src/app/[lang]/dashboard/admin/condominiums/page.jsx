import CondominiumManagementClient from './CondominiumManagementClient';

export default async function CondominiumManagementPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <CondominiumManagementClient dictionary={dictionary} />;
}