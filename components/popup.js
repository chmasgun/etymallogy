import { langColors } from "@/functions/functions";
import { useEffect, useState } from "react";
import CreateWordDiv from "./createWordDiv";

const relationContainerClassName = "relative flex-1 flex flex-col justify-center items-center border border-slate-300 shadow-md m-2 rounded"

export default function Popup({ word, popupRef, setPopupOpen, setSelectedWord, allWords, setFilteredData, unsavedWordCount, setUnsavedWordCount }) {

    const [addingData, setAddingData] = useState(false)
    const [modifiedRelation, setModifiedRelation] = useState(["", ""])
    const popupStates = [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation]


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

            {addingData ?
                <AddDataPopup popupStates={popupStates} modifiedRelation={modifiedRelation} setFilteredData={setFilteredData}
                    unsavedWordCount={unsavedWordCount} setUnsavedWordCount={setUnsavedWordCount} ></AddDataPopup> :
                <DefaultPopup word={word} popupStates={popupStates}></DefaultPopup>

            }
        </div>
    </div>





}



const DefaultPopup = ({ word, popupStates }) => {

    return <>
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
    </ >
}


const AddDataPopup = ({ popupStates, modifiedRelation, setFilteredData, unsavedWordCount, setUnsavedWordCount }) => {
    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation] = popupStates

    const [newWordData, setNewWordData] = useState(null)
    const newId = allWords.length
    console.log(["heyyyy ", allWords, word]);
    console.log(newWordData);
    return <>
        <div className="flex flex-col justify-center items-center flex-1">
            <span className={`p-1 m-1 rounded-xl ${langColors[word.lang][0]}`} > {langColors[word.lang][1]} word</span>
            <span>{word.key}</span>
            <span className="text-2xl">{word.original}</span>
        </div>

        <div>{modifiedRelation[0]} {modifiedRelation[1]}</div>
        <CreateWordDiv newWordData={newWordData} setNewWordData={setNewWordData}
            relation={modifiedRelation} wordPrev={word}
            newId={newId} allWords={allWords}
            setAddingData={setAddingData}
            setFilteredData={setFilteredData}
            unsavedWordCount={unsavedWordCount}
            setUnsavedWordCount={setUnsavedWordCount} ></CreateWordDiv>
    </>


}

const RelationshipContainer = ({ relation, popupStates }) => {

    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation] = popupStates


    const addButtonStyle = "w-8 h-8 items-center self-center text-center text-2xl relative  rounded-xl text-white bg-emerald-400"
    const relatedWordSpanStyle = "p-1 m-1 rounded cursor-pointer hover:shadow-md text-center"

    return (
        <div className="flex flex-row justify-around   flex-1  h-full">
            <div key={"rel1"} className={relationContainerClassName}>
                {relation} from
                <div className="flex-1 flex flex-col justify-center">{
                    word.rel[relation]["from"]?.map((x, xind) => {
                        const matchingWord = allWords.filter(y => y["id"] === x)[0]
                        const colorCode = langColors[matchingWord?.lang] || [""]
                        return <span key={xind} className={`${relatedWordSpanStyle} ${colorCode[0]}`} onClick={() => setSelectedWord(matchingWord)}> {matchingWord?.key} {matchingWord?.original} </span>

                    })


                }

                </div>
                <div className={addButtonStyle} onClick={() => { setAddingData(true); setModifiedRelation([relation, "from"]) }}>+</div>

            </div>
            <div key={"rel2"} className={relationContainerClassName}>
                {relation} to
                <div className="flex-1 flex flex-col justify-center ">{
                    word.rel[relation].to?.map((x, xind) => {
                        const matchingWord = allWords.filter(y => y["id"] === x)[0]
                        return <span key={xind} className={`${relatedWordSpanStyle} ${langColors[matchingWord.lang][0]}`}
                            onClick={() => setSelectedWord(matchingWord)}> {matchingWord?.key} {matchingWord?.original}
                        </span>

                    })
                }
                </div>
                <div className={addButtonStyle} onClick={() => { setAddingData(true); setModifiedRelation([relation, "to"]) }}>+</div>
            </div>

        </div>
    )
}