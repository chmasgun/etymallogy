import { langColors } from "@/functions/functions";


export default function Legend({languages}) {

     
    return <div key = {"legend"}  className=" max-h-60 overflow-auto lg:m-10 right-0 top-0 m-2 z-40 h-fit border border-black bg-slate-300 rounded grid  dark:bg-gray-400 dark:text-slate-800" >
         {languages.map((lang,l_ind) => <div className="lg:min-w-32 max-h-8 flex mr-1" key={l_ind}> 
            <div  className={`${langColors[lang][0]} min-w-6 min-h-6 rounded m-1`}></div>
            <div  className={`  min-w-2 min-h-3 content-center`}>{langColors[lang][1]}</div>
         </div>)}
    </div>
}