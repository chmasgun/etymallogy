"use client"


import { Cairo } from "next/font/google";
import { useEffect, useState } from "react";
import { FetchSearchWords } from "@/functions/functions";
export const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"]
})

import Etymoball from "@/components/etymoball";

export default function Home() {

  const [searchText, setSearchText] = useState("")
  const [searchTextKey, setSearchTextKey] = useState("")
  const [searchCandidates, setSearchCandidates] = useState([])

  function searchHandle(e) {
    e.preventDefault()
    setSearchText(e.target.value)
    setSearchTextKey(e.target.value.slice(0, 3))

  }

  useEffect(() => {
    const initFetchData = async () => {
      try {

        const newfilteredData = await FetchSearchWords(searchTextKey)

        setSearchCandidates(newfilteredData)


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    if (searchTextKey.length === 3) {

      initFetchData();
    }




  }, [searchTextKey])


  console.log(searchCandidates);
  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-0 ${cairo.className}`}>

      <div className="bg-gray-200 z-10 mb-12 w-full  items-center justify-center    text-sm lg:flex flex-col">   {/* max-w-5xl*/}
        <p className="  left-0 top-0 flex w-full justify-center border-b
         pb-6 pt-8 mt-64 mb-64 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  
        lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"> {/* fixed bg-gradient-to-b   border-gray-300 
          from-zinc-200 */}

          <span className="  font-bold text-4xl">Etymallogy</span>
        </p>

        <div className="bg-slate-300 left-0 right-0 w-full flex flex-col h-[150svh]">
          <div className="bg-gradient-to-b from-gray-200 h-1/3 flex flex-col justify-center">
            <p className=" text-xl self-center m-24 ">An online collection of etymological knowledge</p>


            <div className=" text-xl self-center m-4 ">1000+ Turkish words</div>
            <div className=" text-xl self-center m-4 ">1000+ English words</div>
            <div className=" text-xl self-center m-4 ">1000+ Arabic words</div>
            <div className="flex flex-col justify-center">
              <input
                type="text"
                className="self-center m-16 w-60 lg:w-1/3 placeholder-gray-400 text-gray-900 p-4"
                placeholder="Search"
                onChange={searchHandle}
                value={searchText}
              />

            </div>
          </div>
          <Etymoball words={["şerbet", "şarap", "meclis", "wine", "şurup", "語", "kitap", "lycée", "bilim", "science",
            "لغة", "vin", "sorbetto", "λόγος", "lisan", "ستاره", "stella", "ἀστήρ"]}></Etymoball>
        </div>




      </div>



    </main>
  );
}

 