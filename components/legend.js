import { langColors } from "@/functions/functions";


export default function Legend({languages}) {

     
    return <div key = {"legend"}  className=" max-h-56  lg:m-10 right-0 top-0 m-2 z-40 h-fit border border-black bg-slate-300 rounded grid text-sm dark:bg-gray-400 dark:text-slate-800" >
         {languages.map((lang,l_ind) => <div className="lg:min-w-32  flex mr-1" key={l_ind}> 
            <div className="flex items-center"> 
                <div  className={`${langColors[lang][0]} min-w-6 min-h-6 rounded m-1 aspect-square`}/> 
            </div>
            <div  className={`  min-w-24 min-h-3 content-center w-min`}>{langColors[lang][1]}</div>
         </div>)}
    </div>
}