import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import axios from 'axios'
import palacio from '../../public/palacio.jpg'
import Image from 'next/image';
import { useEffect, useState } from 'react';


//TODO lembrar de filtrar por presença, falta justificado e falta não justificada também
// PTB??? PMN?? AGIR?? DC? PRTB?? PMB?? PSTU?? PCB?? PCO UP??
interface politicalApiType {
  ausencias_justificadas: number
  ausencias_nao_justificadas: number
  deputado: string
  estado: string
  partido: string
  presencas: number
}

const estado = ['Todos', 'AC', 'Al', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
const partidos = ['Todos',
  'MDB', 'PT', 'PSDB', 'PP', 'PDT', 'UNIAO', 'PTB', 'PL', 'PSB', 'REPUBLICANOS', 'CIDADANIA', 'PSC', 'PODE', 'PSD', 'PCdoB', 'SOLIDARIEDADE', 'PV', 'PATRIOTA', 'PSOL',
  'AVANTE', 'PMN', 'AGIR', 'DC', 'PRTB', 'PMB', 'REDE', 'NOVO', 'PSTU', 'PCB', 'PCO', 'UP'
]

const Home: NextPage = () => {

  const [data, setData] = useState<politicalApiType[]>([])
  const [dataRef, setDataRef] = useState<politicalApiType[]>([])
  const [page, setPage] = useState(0)
  const [politicalName, setPoliticalName] = useState('')
  const [countryState, setCountryState] = useState('Todos')
  const [politicalParty, setPoliticalParty] = useState('Todos')

  useEffect(() => {
    axios.get<politicalApiType[]>('https://political-api-cosmicpb.vercel.app/presenca').then(res => {
      setData(res.data)
      setDataRef(res.data)
    })
  }, [])

  useEffect(() => {
    if (countryState !== 'Todos') {
      return setDataRef(data.filter(item => item.estado === countryState))
    }
    if (politicalParty !== 'Todos') {
      return setDataRef(data.filter(item => item.partido === politicalParty))
    }
    if (politicalName !== '') {
      return setDataRef(data.filter(item => item.deputado.toLowerCase().includes(politicalName.toLowerCase())))
    }
    if (politicalParty !== 'Todos' && politicalName !== '') {
      return setDataRef(data.filter(item => item.deputado.includes(politicalName) && item.partido === politicalParty))
    }
    if (politicalParty !== 'Todos' && countryState !== 'Todos') {
      return setDataRef(data.filter(item => item.estado === countryState && item.partido === politicalParty))
    }
    if (countryState !== 'Todos' && politicalName !== '') {
      return setDataRef(data.filter(item => item.estado === countryState && item.deputado.toLowerCase().includes(politicalName)))
    }
    if (politicalName !== '' && politicalParty !== 'Todos' && countryState !== 'Todos') {
      return setDataRef(data.filter(item => item.deputado.toLowerCase().includes(politicalName) && item.estado === countryState && item.partido === politicalParty))
    }
    else {
      return setDataRef(data)
    }
  }, [countryState, politicalParty, politicalName])

  const minMonthIndex = 1
  const maxMonthIndex = 54

  const prevPoliticals = (page: number) => {
    if (page > minMonthIndex) {
      setPage(page => page - 1)
      return
    }
    setPage(54)
  };

  const nextPoliticals = (page: number) => {
    if (page < maxMonthIndex) {
      setPage(page => page + 1)
      return
    }
    setPage(0)
  };

  console.log(dataRef)
  console.log(data.filter(item => item.partido === politicalParty))

  return (
    <>
      <Head>
        <title>Monitora-se</title>
        <meta name="description" content="Informação sobre todos os deputados, a um clique" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100">
        <nav className='bg-white border-b drop-shadow-lg py-4 px-96 flex justify-between items-center'>
          <p className='text-2xl'>Monitora-se</p>
          <ul className='flex gap-5'>
            <li className='text-lg cursor-pointer'>Home</li>
            <li className='text-lg cursor-pointer'>Deputados</li>
          </ul>
        </nav>
        <section className='flex min-h-[80vh] flex-col items-center justify-center pt-20 '>
          {/* <Image src={palacio} /> */}
          <div className='flex flex-col gap-4'>
            <div className='pb-5  drop-shadow-xl'>
              <input
                className='w-96 rounded-lg border outline-none p-2'
                value={politicalName}
                onChange={(e) => setPoliticalName(e.target.value)}
                placeholder='Procure o nome do deputado'
              />
            </div>
            <div className='flex justify-center items-center gap-3'>
              <select
                className='w-32 py-2 px-2 text-center drop-shadow-xl rounded-lg'
                value={countryState}
                onChange={(e) => setCountryState(e.target.value)}
              >
                {estado.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
              <select
                className='w-32 py-2 px-2 text-center drop-shadow-xl rounded-lg'
                value={politicalParty}
                onChange={(e) => setPoliticalParty(e.target.value)}
              >
                {partidos.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex justify-between px-5 py-5'>
            <div className='w-[170px] text-center'>
              <p>Partido</p>
            </div>
            <div className='w-[170px] text-center'>
              <p>Deputado</p>
            </div>
            <div className='w-[170px] text-center'>
              <p>Estado</p>
            </div>
            <div className='w-[170px] text-center'>
              <p>Presencas</p>
            </div>
            <div className='w-[170px] text-center'>
              <p>Faltas justificadas</p>
            </div>
            <div className='w-[170px]'>
              <p>Faltas não justificadas</p>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            {dataRef.slice(page * 10, (page * 10) + 9).map((item, index) => (
              <div className='bg-white drop-shadow-md flex justify-between  py-5' key={index}>
                <div className='w-[170px] text-center'>
                  <p>{item.partido}</p>
                </div>
                <div className='w-[170px] text-center'>
                  <p>{item.deputado}</p>
                </div>
                <div className='w-[170px] text-center'>
                  <p>{item.estado}</p>
                </div>
                <div className='w-[170px] text-center'>
                  <p>{item.presencas}</p>
                </div>
                <div className='w-[170px] text-center'>
                  <p>{item.ausencias_justificadas}</p>
                </div>
                <div className='w-[170px] text-center'>
                  <p>{item.ausencias_nao_justificadas}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className='flex gap-4 justify-center items-center py-8'>
          <button
            className='bg-white w-44 rounded-lg border p-2 drop-shadow-xl'
            onClick={() => prevPoliticals(page)}
          >
            Anterior
          </button>
          <span>
            {page + 1} / 55
          </span>
          <button className='bg-white w-44 rounded-lg border p-2 drop-shadow-xl'
            onClick={() => nextPoliticals(page)}
          >
            Proximo
          </button>
        </section>
      </main>
    </>
  );
};

export default Home;
