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
import CarouselDiv from "@/components/carouselDiv";




export default function Home() {

  const [selectedCarouselImage, setSelectedCarouselImage] = useState(0)
  const [positions, setPositions] = useState([-100, 100, 1000])
  useEffect(() => {

    setTimeout(() => {
      setPositions([0, 100, 1000])
    }, 0)
    setTimeout(() => {
      setPositions([0, 0, 1000])
    }, 500)
    setTimeout(() => {
      setPositions([0, 0, 0])
    }, 1000)
  }, [])

  


  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-0 ${cairo.className} overflow-x-hidden overflow-y-scroll h-svh scroll-smooth  snap-y snap-mandatory`}>


      <div className="bg-gray-200 z-10 h-[200svh] min-h-[200svh] w-full   items-center justify-center  dark:bg-zinc-800  text-sm lg:flex flex-col">   {/* max-w-5xl*/}
        <div className="relative flex flex-col  items-center lg:flex-row left-0 top-0 flex  justify-center  
         pb-6 pt-8 mt-24 mb-96 backdrop-blur-2xl  dark:bg-zinc-800 dark:from-inherit lg:static lg:w-auto  
        lg:rounded-xl   lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800 snap-center snap-always "> {/* fixed bg-gradient-to-b   border-gray-300 
          from-zinc-200 */}

          <span className="relative transition-all duration-1000 lg:mr-32 lg:h-60 flex items-center font-bold text-4xl" style={{ left: `${positions[0]}vw` }}>Etymallogy</span>
          <div className="relative transition-all duration-[1000ms] " style={{ left: `${positions[1]}vw` }}>

            <Etymoball words={["şerbet", "şarap", "meclis", "wine", "şurup", "語", "kitap", "lycée", "bilim", "science",

              "لغة", "vin", "sorbetto", "λόγος", "lisan", "ستاره", "stella", "ἀστήρ"]}></Etymoball>
          </div>

        </div>
        <div className="relative w-full flex flex-col snap-center snap-always" >

          <div className="relative transition-all duration-1000  search-bar-container w-80 lg:w-[32rem]  mb-32 self-center" style={{ top: `${positions[2]}px` }}>
            <SearchBar smallMode={false} setSmallMode={() => { }}  ></SearchBar>

          </div>
        </div>
        <div className="bg-slate-300 dark:bg-zinc-800 left-0 right-0 w-full flex flex-col h-[200svh]" >


          <div className="bg-gradient-to-b from-gray-200 dark:from-zinc-800/30 h-1/3 flex flex-col justify-center items-center text-center text-2xl">

            The online, visual corpus of etymology
          </div>

          {/*Carousel */}

          <CarouselDiv selectedCarouselImage={selectedCarouselImage} setSelectedCarouselImage={setSelectedCarouselImage}></CarouselDiv>


        </div>




      </div>



    </main>
  );
}



