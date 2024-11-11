export default async function pageSetNewPassword({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <main>
      <h1>Set New Password</h1>
    </main>
  );
}
