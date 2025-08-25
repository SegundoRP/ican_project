import UserManagementClient from './UserManagementClient';

export default async function UserManagementPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <UserManagementClient dictionary={dictionary} />;
}