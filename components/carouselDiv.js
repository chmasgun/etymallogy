import { useState, useEffect} from "react"
import Image from 'next/image'


const carouselItems = [
    <CarouselSlide key={0} text={"Discover related words from different languages!"} filename={"tree2"} />,
    <CarouselSlide key={1} text={"See how the modern words took their final forms!"} filename={"sarap"} />,
    <CarouselSlide key={2} text={" Focus on the words to discover their origin, observe cultural interactions!"} filename={"syrup"} />,
    <CarouselSlide key={3} text={"Analyze the roots and the words derived from them"} filename={"soru"} />
]

const imgCount = carouselItems.length

export default function CarouselDiv({ selectedCarouselImage, setSelectedCarouselImage }) {

    const imageSwipeTimeMilli = 10000


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




    return <div className=" overflow-x-hidden flex flex-col snap-center  w-[95%] md:w-[640px] lg:w-[800px] lg:h-[40svh] h-[70svh] min-h-[400px] self-center text-xl rounded-xl bg-slate-200 shadow-lg shadow-gray-500" >


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
}








function CarouselSlide({ text, filename }) {

    return <div className="flex flex-col lg:flex-row">

        <span className="flex-auto basis-1/3 md:basis-1/2 text-center content-center p-4">{text}</span>
        <div className="flex-auto  basis-2/3 md:basis-1/2 flex h-full p-4">
            <ImageWrapper filename={filename}></ImageWrapper>
        </div>
    </div>
}

function ImageWrapper   ({ filename })  {
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