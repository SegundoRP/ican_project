export default async function pageLogin({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <main>
      <h1>Login</h1>
    </main>
  );
}
