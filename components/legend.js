import { langColors } from "@/functions/functions";


export default function Legend({languages, isHiddenOnMobile}) {

     
    return <div key = {"legend"}  className={`max-h-56 pointer-events-auto overflow-auto mb-0 lg:m-10 right-0 top-0 m-2 z-40 h-fit border border-black bg-slate-300 rounded grid text-sm overflow-x-hidden dark:bg-gray-400 dark:text-slate-800 ${isHiddenOnMobile ? "w-0 lg:w-auto overflow-hidden lg:overflow-auto border-0 lg:border": ""}`} >
         {languages.map((lang,l_ind) => <div className="lg:min-w-32  flex mr-1" key={l_ind}> 
            <div className="flex items-center"> 
                <div  className={`${langColors[lang][0]} min-w-6 min-h-6 rounded m-1 aspect-square`}/> 
            </div>
            <div  className={`  min-w-24 min-h-3 content-center w-min`}>{langColors[lang][1]}</div>
         </div>)}
    </div>
}