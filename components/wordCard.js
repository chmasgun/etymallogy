
import { langColors } from "@/functions/functions";


export default function WordCard({x, pos, setSelectedWord, setPopupOpen, hoveredPair}) {

    //console.log(keyVal);
    return <div  style={{left : `${pos[x.id] || 0}px` }} 
            onClick={ () => { setSelectedWord(x); setPopupOpen(true)} }
        className={`word-card-individual  absolute border-2 min-w-32 min-h-24 z-10 text-center  justify-center rounded-lg flex flex-col transition-all ${
                langColors[x.lang][0]} hover:shadow-lg ${
                    hoveredPair.includes(x.id) ? "shadow border-gray-600":""}`} > 
        { // absolute
        }
        <span>{x.key}</span>
        <span className="text-2xl"> {x.original}</span>
        <span className="text-xs"> {x.id}</span>
    </div>
}