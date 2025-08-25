import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage({ params }) {
  const { lang } = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`)
    .then((m) => m.default);

  return <AdminDashboardClient dictionary={dictionary} />;
}