export default async function pageRegister({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <main>
      <h1>Register</h1>
    </main>
  );
}
