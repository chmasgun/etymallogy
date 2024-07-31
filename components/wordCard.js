
import { langColors } from "@/functions/functions";


export default function WordCard({ x, pos, selectedCluster, setSelectedWord, setPopupOpen, hoveredPair, highlightedWords, editModeToggle, setWordToHighlight, isProd }) {

    //console.log([x.id+"_"+selectedCluster , pos[x.id]]);

    return <div key={x.id  } style={{ left: `${pos[x.id] || -1000}px` }}
        onClick={() => {
            if (editModeToggle) {
                setSelectedWord(x); setPopupOpen(true)
            } else {
                setWordToHighlight(x.id)
            }
        }}
        className={`word-card-${x.id} word-card-individual  absolute min-w-24 max-w-24 min-h-16  lg:min-w-32 lg:max-w-32 lg:min-h-20 z-10 text-center  justify-center rounded-lg flex flex-col transition-all duration-300 ${langColors[x.lang][0]} hover:shadow-lg ${hoveredPair.includes(x.id) ? "shadow border-gray-500 border-4" : ""} ${highlightedWords.includes(x.id) ? "" : " blur-xs  opacity-30 dark:!bg-gray-500 dark:!opacity-10 "
            } dark:border-gray-600`} >
        { // absolute
        }
        <span className="text-sm"> {x.key}</span>
        <span className="text-xl"> {x.original}</span>
        {!isProd && <span className="text-xs"> {x.id}</span>}
    </div>
}