import { langColors } from "@/app/functions";


export default function Legend({languages}) {

     
    return <div key = {"legend"}  className="fixed lg:absolute lg:m-10 right-0 top-0 m-2 z-20 border border-black bg-slate-300 rounded " >
         {languages.map(lang => <div className="min-w-60 flex">
            <div  className={`${langColors[lang][0]} min-w-6 min-h-6 rounded m-1`}></div>
            <div  className={`  min-w-2 min-h-3 content-center`}>{langColors[lang][1]}</div>
         </div>)}
    </div>
}