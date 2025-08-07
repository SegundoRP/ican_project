import AvailabilitySettingsClient from './AvailabilitySettingsClient';

export default async function AvailabilitySettingsPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <AvailabilitySettingsClient dictionary={dictionary} />;
}