import Image from 'next/image';
import Link from 'next/link';
import { SocialButtons } from '@/components/common';
import { LoginForm } from '@/components/forms';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Ican | Inicio de sesión",
  description: "Ican página de inicio de sesión",
};

export default async function PageLogin({params}) {
  const {lang} = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`).then((m) => m.default);
  if (!dictionary) return null;

  const dictionaryLogin = dictionary.LoginPage;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <Navbar dict={dictionary.LandingPage} lang={lang}/>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <Image
          alt="Your Company"
          src=""
          className="mx-auto h-10 w-auto"
          width={40}
          height={40}
        /> */}
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {dictionaryLogin.Title}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm dictionary={dictionary} />
        <SocialButtons />

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {dictionaryLogin.Form.DontHaveAnAccount}{' '}
          <Link href="/auth/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500">
            {dictionaryLogin.Form.Register}
          </Link>
        </p>
      </div>
      <Footer dict={dictionary.LandingPage}/>
    </div>
  );
}
