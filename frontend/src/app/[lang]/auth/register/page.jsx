import Image from 'next/image';
import Link from 'next/link';
import { SocialButtons } from '@/components/common';
import { RegisterForm } from '@/components/forms';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Ican | Registro",
  description: "Ican página de registro",
};

export default async function PageRegister({params}) {
  const {lang} = params;
  const dictionary = await import(`@/app/dictionaries/${lang}.json`).then((m) => m.default);
  if (!dictionary) return null;

  const dictionaryRegister = dictionary.RegisterPage;

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
            {dictionaryRegister.Title}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <RegisterForm dictionary={dictionaryRegister} />
          <SocialButtons />

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {dictionaryRegister.Form.AlreadyHaveAccount}{' '}
            <Link href="/auth/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500">
              {dictionaryRegister.Form.Login}
            </Link>
          </p>
        </div>
        <Footer dict={dictionary.LandingPage}/>
      </div>
  );
}
