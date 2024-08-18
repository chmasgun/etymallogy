"use client"


import { Cairo } from "next/font/google";
import Image from 'next/image'

const CarouselSlide = ({ text, filename }) => {

  return <div className="flex flex-col lg:flex-row">

    <span className="flex-auto basis-1/3 md:basis-1/2 text-center content-center p-4">{text}</span>
    <div className="flex-auto  basis-2/3 md:basis-1/2 flex h-full p-4">
      <ImageWrapper filename={filename}></ImageWrapper>
    </div>
  </div>
}
export const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"]
})

import Etymoball from "@/components/etymoball";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";

const carouselItems = [
  <CarouselSlide key={0} text={"Discover related words from different languages!"} filename={"tree2"} />,
  <CarouselSlide key={1} text={"See how the modern words took their final forms!"} filename={"sarap"} />,
  <CarouselSlide key={2} text={" Focus on the words to discover their origin, observe cultural interactions!"} filename={"syrup"} />,
  <CarouselSlide key={3} text={"Analyze the roots and the words derived from them"} filename={"soru"} />
]


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

  const imageSwipeTimeMilli = 10000
  const imgCount = carouselItems.length

  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let imageIncrement

    imageIncrement = setInterval(() => {
      setSelectedCarouselImage(selectedCarouselImage => (selectedCarouselImage + 1) % imgCount)
      setCurrentTime(500)
    }, imageSwipeTimeMilli)

    return () => {
      clearInterval(imageIncrement);

    };
  }, [selectedCarouselImage])

  useEffect(() => {
    setCurrentTime(500)
    let timeIncrement

    timeIncrement = setInterval(() => {
      setCurrentTime(currentTime => (currentTime + 1000))
    }, 1000)

    return () => {
      clearInterval(timeIncrement);
    };
  }, [selectedCarouselImage])


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

          <div className=" overflow-x-hidden flex flex-col snap-center  w-[95%] md:w-[640px] lg:w-[800px] lg:h-[40svh] h-[70svh] min-h-[400px] self-center text-xl rounded-xl bg-slate-200 shadow-lg shadow-gray-500" >




            <div className="projects-all-div grid grid-flow-col auto-cols-[100%]  grid-rows-1 h-full motion-safe:transition-transform  motion-safe:duration-500" style={{ transform: `translate(-${100 * selectedCarouselImage}%)` }}>


              {carouselItems}



            </div>

            <div className="w-full   flex items-center justify-center gap-1 p-2 bg-white/40 dark:bg-black/20 rounded-xl">
              {Array(imgCount).fill(0).map((x, i) => <div onClick={() => setSelectedCarouselImage(i)}
                className={`h-5 overflow-clip bg-gray-400 rounded-full flex-initial transition-[width] duration-1000 
                                                    ${selectedCarouselImage === i ? "w-[3.75rem]  " : "w-5  "}`} key={i}>
                {selectedCarouselImage === i && <div key={i} className="bg-emerald-400 h-full " style={{ width: `${100 * currentTime / imageSwipeTimeMilli}%`, transition: "width 1s linear" }} />}
              </div>
              )}
            </div>



          </div>


        </div>




      </div>



    </main>
  );
}



const ImageWrapper = ({ filename }) => {
  //max-h-[3rem] max-w-[4.5rem] h-[3rem] w-[4.5rem] md:h-[4rem]   md:max-h-[4rem]  md:w-[6rem]  md:max-w-[6rem] 
  return <div className={`project-visual  flex items-center justify-center overflow-clip  w-full   relative  transition-transform hover:scale-110`}  >
    <Image src={`/img/${filename}.PNG`}
      style={{ objectFit: "contain", position: "absolute", height: "100%", width: "100%", inset: "0px" }}

      width={0}
      height={0}
      sizes="100%"
      quality={100}
      alt={""}

    ></Image>
  </div>
}