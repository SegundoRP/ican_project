import { PasswordResetForm } from '@/components/forms';
import Image from 'next/image';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Ican | Cambio de contraseña',
  description: 'Ican página de cambio de contraseña'
}

export default async function pageRequestPasswordReset({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <Navbar dict={dictionary.LandingPage} lang={lang}/>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm px-6 py-8 lg:px-8">
        {/* <Image
          alt="Your Company"
          src=""
          className="mx-auto h-10 w-auto"
          width={40}
          height={40}
        /> */}
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {dictionary.PasswordReset.Reset}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-6 py-8 lg:px-8">
        <PasswordResetForm dictionary={dictionary} />
      </div>
      <Footer dict={dictionary.LandingPage}/>
    </div>
  );
}
