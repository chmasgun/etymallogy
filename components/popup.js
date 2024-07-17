import { langColors } from "@/functions/functions";
import { useEffect } from "react";

const relationContainerClassName = "relative flex-1 flex flex-col justify-center items-center border border-slate-300 shadow-md m-2 rounded"

export default function Popup({ word, popupRef, setPopupOpen,setSelectedWord, allWords }) {

    const popupStates = [word, popupRef, setPopupOpen,setSelectedWord, allWords]
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                console.log("close popup");
                setPopupOpen(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    return <div className="fixed left-0 top-0 w-dvw h-dvh  z-30 flex justify-center items-center">

        <div className={`w-[800px] max-w-[800px] h-[60vh] mt-20 p-1 bg-slate-200 shadow-lg border-black rounded-lg flex items-center `} ref={popupRef}>
            {/* LEFT PART OF THE POPUP */}
            <div className="flex flex-col justify-center items-center flex-1">
                <span className={`p-1 m-1 rounded-xl ${langColors[word.lang][0]}`} > {langColors[word.lang][1]} word</span>
                <span>{word.key}</span>
                <span className="text-2xl">{word.original}</span>
            </div>
            {/* RIGHT PART OF THE POPUP */}
            <div className="flex flex-col   h-full  flex-1">
                {/* FIRST LINE (DERIVES) OF RIGHT PART */}
                <RelationshipContainer relation={"derives"} popupStates={popupStates}></RelationshipContainer>

                {/* SECOND LINE (LOANS) OF RIGHT PART */}
                <RelationshipContainer relation={"loans"} popupStates={popupStates}></RelationshipContainer>

                {/* THIRD LINE (HOMONYM) OF RIGHT PART */}
                <RelationshipContainer relation={"homonym"} popupStates={popupStates}></RelationshipContainer>
            </div>
        </div>
    </div>




 
}





const RelationshipContainer = ({ relation, popupStates }) => {

    const [word, popupRef, setPopupOpen, setSelectedWord, allWords] = popupStates


    const addButtonStyle = "w-8 h-8 items-center self-center text-center text-2xl relative  rounded-xl text-white bg-emerald-400"
    const relatedWordSpanStyle = "p-1 m-1 rounded cursor-pointer hover:shadow-md text-center"

    return (
        <div className="flex flex-row justify-around   flex-1  h-full">
            <div className={relationContainerClassName}> 
                {relation} from
                <div className="flex-1 flex flex-col justify-center">{
                    [word.rel[relation]["from"]].map(x => {
                        const matchingWord = allWords.filter(y => y["id"] === x)[0]
                        const colorCode = langColors[matchingWord?.lang]  || [""]
                        return <span className={`${relatedWordSpanStyle} ${colorCode[0]}`}  onClick={() => setSelectedWord(matchingWord)}> {matchingWord?.key} {matchingWord?.original} </span>

                    })

                  
                }
                
                </div>
                <div className={addButtonStyle}>+</div>

            </div>
            <div className={relationContainerClassName}> 
                {relation} to
                <div className="flex-1 flex flex-col justify-center ">{
                    word.rel[relation].to?.map(x => {
                        const matchingWord = allWords.filter(y => y["id"] === x)[0]
                        return <span className={`${relatedWordSpanStyle} ${langColors[matchingWord.lang][0]}`} 
                                onClick={() => setSelectedWord(matchingWord)}> {matchingWord?.key} {matchingWord?.original} 
                                </span>

                    })
                }
                </div>
                <div className={addButtonStyle}>+</div>
            </div>
            
        </div>
    )
}