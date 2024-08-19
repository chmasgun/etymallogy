
import { langColors , relationsAll} from "@/functions/functions";
import { useEffect, useRef, useState } from "react";


export default function WordCard({ x, pos, selectedCluster, setSelectedWord, setPopupOpen, hoveredPair, highlightedWords, editModeToggle, wordToHighlight, setWordToHighlight, isProd, transferEnabled, childrenNodesOfTransfer, setTransferNodeUnder, afterClickSmallPopupOn, inheritanceTextShort, setShouldFindDescendants }) {

    //console.log([x.id+"_"+selectedCluster , pos[x.id]]);
    const [infoPopupOpen, setInfoPopupOpen] = useState(false)
    const infoPopupRef = useRef()

    const openSmallFirstPopup = !infoPopupOpen && afterClickSmallPopupOn && wordToHighlight === x.id  // second boolean is a generic one. So specifying the word with the third bool. Info popup should also be closed
    const hasDescendants = Object.keys(x.rel).reduce((accumulator, a) => accumulator + (x.rel[a]["to"]||[]).length , 0 )  > 0


    useEffect(() => {
        setInfoPopupOpen(false)
    }, [wordToHighlight])

    return <div key={x.id} style={{ transform: `translateX(${pos[x.id] || -1000}px)` }}
        onClick={() => {
            if (editModeToggle) {
                if (transferEnabled) {
                    setTransferNodeUnder(x)
                } else {
                    setSelectedWord(x); setPopupOpen(true)
                }
            } else {
                setWordToHighlight(x.id)
            }
        }}
        className={`word-card-${x.id} word-card-individual  absolute min-w-24 max-w-24 min-h-16  lg:min-w-32 lg:max-w-32 lg:min-h-20 z-10 text-center  justify-center rounded-lg flex flex-col transition-all duration-300 ${langColors[x.lang][0]} hover:shadow-lg hover:shadow-gray-600/50 ${hoveredPair.includes(x.id) ? "shadow border-gray-500 border-4" : ""} ${highlightedWords.includes(x.id) ? "z-20" : "  opacity-30 dark:!bg-gray-500 dark:!opacity-10 " 
            }  ${x.id === wordToHighlight ? "z-40" : ""}  ${childrenNodesOfTransfer.includes(x.id) ? "bg-gray-500 opacity-30" : ""} dark:border-gray-600`} >

        <span className="text-sm"> {x.key}</span>
        <span className="text-xl"> {x.original}</span>
        {!isProd && <span className="text-xs"> {x.id}</span>}

        {/* popup to whether see details, or show the descendant words */}
        {openSmallFirstPopup && <div className="absolute right-0 opacity-90" style={{ transform: "translateX(100%)" }}>
            <div className={`text-sm text-nowrap rounded-r-lg p-px ${langColors[x.lang][0]} border-s mb-1`} onClick={() => setInfoPopupOpen(true)}>See details</div>
             {hasDescendants && <div className={`text-sm text-nowrap rounded-r-lg p-px ${langColors[x.lang][0]} border-s`} onClick={()=>setShouldFindDescendants(true)}>Descendants</div>}
        </div>}
        {/* info popup */}
        {infoPopupOpen && <WordDetailsPopup word={x} infoPopupRef={infoPopupRef} setInfoPopupOpen={setInfoPopupOpen} inheritanceTextShort={inheritanceTextShort}></WordDetailsPopup>}
    </div>
}



const WordDetailsPopup = ({word, infoPopupRef, setInfoPopupOpen,inheritanceTextShort }) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (infoPopupRef.current && !infoPopupRef.current.contains(event.target)) {
                setInfoPopupOpen(false)  
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => { 
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [infoPopupRef]);

    console.log(word);
    //const fromRelationText = getFromRelation(word)
    return <div ref={infoPopupRef} className="z-30 absolute right-0 top-0 bg-stone-300 p-2 rounded-xl shadow-lg shadow-stone-400 dark:bg-stone-600 dark:shadow-stone-200/40 w-64 md:w-96" style={{ transform: "translateX(105%)" , height: "" }}>

        <div className={`text-sm  rounded-r-lg p-px `}>
            {langColors[word.lang][1]}  word
            <p className="text-2xl my-2">{word.original}</p>
            <p className="text-xl my-2">{word.key}</p>
            <p className=" ">{word.type}{word.gender && word.gender.length>0 && <span>, {word.gender}</span>}</p>
            {word.alt && word.alt.length>0 && <p className="text-base italic">Also, {word.alt}</p>}
            <p className="text-base italic">{word.desc}</p>
            <p title="" className="text-base italic">{word.detail}</p>
            <div className="my-8">{inheritanceTextShort.map((x,i) => <p key={i}>{x}</p>)}</div>
        </div>
    </div>
}

// const getFromRelation = ({word}) => {

//     let fromRelDict = {}
//     for ( const rel of relationsAll){
//         let relFrom = word["rel"][rel]["from"] || []
        
//     } 
    

// }