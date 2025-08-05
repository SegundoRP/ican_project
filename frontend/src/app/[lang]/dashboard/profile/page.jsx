import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage({ params: { lang } }) {
  const dictionary = await import(`@/app/dictionaries/${lang}.json`).then((m) => m.default);

  return <ProfilePageClient dictionary={dictionary} />;
}
