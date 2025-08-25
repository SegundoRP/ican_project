import ServiceTypesClient from './ServiceTypesClient';

export default async function ServiceTypesPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <ServiceTypesClient dictionary={dictionary} />;
}
