export default async function pageActivation({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <main>
      <h1>Activation</h1>
    </main>
  );
}
