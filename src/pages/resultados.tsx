import axios from 'axios';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const ResultId = ({ data }: { data: { text: string; value: number }[] }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { productID } = router.query;

  const names = ['Omo Litro', 'Omo Pacote', 'Cif', 'Comfort'];

  const options = {
    rotations: [1, 1],
    rotationAngles: [0, 0],
    fontFamily: 'sans-serif',
    fontSizes: [16, 36],
  };

  useEffect(() => {
    setShow(true);
  }, []);

  const translatedData = data.map((item) => ({ ...item, text: t(item.text) }));

  return (
    <>
      <Header />
      <main>
        <div className="my-[32px] text-center text-[22px]">
          <h1>Respostas:</h1>
        </div>
        <div className="mb-[32px] flex-col gap-[64px] md:flex md:flex-row md:justify-center">
          {data.length > 0 && (
            <div className="flex flex-col justify-center">
              <p className="mb-[32px] text-center text-[18px]">
                {names[parseInt(productID as string, 10) - 1]}
              </p>
              <div className="max-h-[250px] min-h-[250px] min-w-[360px] max-w-[360px]">
                {show && (
                  <ReactWordcloud
                    size={[360, 250]}
                    words={translatedData}
                    // @ts-ignore
                    options={options}
                  />
                )}
              </div>
              <div className="mx-[auto] min-w-[340px]">
                <button
                  type="button"
                  className="mx-[auto] my-[64px] w-full max-w-[340px] rounded bg-[#1f36c7] p-[8px] font-bold uppercase text-white"
                  onClick={() => {
                    router.push(`/`);
                  }}
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export async function getServerSideProps({ locale }: any) {
  try {
    const response = await axios.get(
      `${process.env.PROJECT_URL}api/floatAnswers`,
    );

    const data = response.data.map((item: any) => ({
      text: item.answerValue,
      value: item.quantity,
    }));

    return {
      props: {
        data: data as { text: string; value: number }[],
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default ResultId;
