"use client"


import { Cairo } from "next/font/google";
 
 
 
export const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"]
})

import Etymoball from "@/components/etymoball";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";




export default function Home() {
  

  const [positions, setPositions] = useState([-1000, 1000, 1000])
  useEffect(() => {

    setTimeout(() => {
        setPositions([0,1000,1000])
    }, 300 )
    setTimeout(() => {
      setPositions([0,0,1000])
    }, 1000 )
    setTimeout(() => {
      setPositions([0,0,0])
    }, 2000 )
  }, [])

  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-0 ${cairo.className}`}>

      <div className="bg-gray-200 z-10  w-full  items-center justify-center  dark:bg-zinc-800  text-sm lg:flex flex-col">   {/* max-w-5xl*/}
        <div className="relative flex flex-col items-center lg:flex-row left-0 top-0 flex w-full justify-center  
         pb-6 pt-8 mt-24 mb-96 backdrop-blur-2xl  dark:bg-zinc-800 dark:from-inherit lg:static lg:w-auto  
        lg:rounded-xl   lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800"> {/* fixed bg-gradient-to-b   border-gray-300 
          from-zinc-200 */}

          <span className="relative transition-all duration-1000 lg:mr-32 lg:h-60 flex items-center font-bold text-4xl" style={{ left: `${positions[0]}px`}}>Etymallogy</span>
          <div className="relative transition-all duration-1000" style={{ left: `${positions[1]}px`}}>

          <Etymoball words={["şerbet", "şarap", "meclis", "wine", "şurup", "語", "kitap", "lycée", "bilim", "science",
            
            "لغة", "vin", "sorbetto", "λόγος", "lisan", "ستاره", "stella", "ἀστήρ"]}></Etymoball>
            </div>
           
        </div>

        <div className="relative transition-all duration-1000 bg-slate-300 dark:bg-zinc-800 left-0 right-0 w-full flex flex-col h-[100svh]" style={{ top: `${positions[2]}px`}}>
          <div className="bg-gradient-to-b from-gray-200 dark:from-zinc-800/30 h-1/3 flex flex-col justify-center ">
            <div className="w-80 lg:w-[32rem] pt-32 mb-32 self-center">
              <SearchBar smallMode={false} setSmallMode={()=>{}}  ></SearchBar>

            </div>
            <p className=" text-xl self-center m-8 lg:m-24 text-center ">An online collection of etymological knowledge</p>


            <div className=" text-xl self-center m-4 ">1000+ Turkish words</div>
            <div className=" text-xl self-center m-4 ">1000+ English words</div>
            <div className=" text-xl self-center m-4 ">1000+ Arabic words</div>
          </div>

        </div>




      </div>



    </main>
  );
}


