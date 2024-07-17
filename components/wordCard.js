
import { langColors } from "@/functions/functions";


export default function WordCard({x, pos, setSelectedWord, setPopupOpen}) {

    //console.log(pos);
    return <div key = {x.id} style={{left : `${pos[x.id] || 0}px` }} onClick={ () => { setSelectedWord(x); setPopupOpen(true)} }
        className={`word-card-individual  absolute border-2 min-w-32 min-h-24  text-center  justify-center rounded-lg flex flex-col ${langColors[x.lang][0]}`} > 
        { // absolute
        }
        <span>{x.key}</span>
        <span className="text-2xl"> {x.original}</span>
        <span className="text-xs"> {x.id}</span>
    </div>
}