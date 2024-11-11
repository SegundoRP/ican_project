export default async function pageRequestPasswordReset({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <main>
      <h1>Request Password Reset</h1>
    </main>
  );
}
