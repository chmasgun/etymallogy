import { langColors, filledFields, relationsAll } from "@/functions/functions";
import { useEffect, useState } from "react";
import CreateWordDiv from "./createWordDiv";

const relationContainerClassName = "relative flex-1 flex flex-col justify-center items-center border border-slate-300 shadow-md m-2 rounded dark:!border-slate-500"

export default function Popup({ word, popupRef, setPopupOpen, setSelectedWord, allWords, setFilteredData,
    unsavedWordCount, setUnsavedWordCount, isInsertMode, setIsInsertMode, setMustDepthRecalculate, hoveredPair }) {

    const [addingData, setAddingData] = useState(false)
    //const [insertingData, setInsertingData] = useState(false)
    const [modifiedRelation, setModifiedRelation] = useState(["", ""])
    const popupStates = [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation, setMustDepthRecalculate, unsavedWordCount, setUnsavedWordCount]


    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                console.log("close popup");
                setPopupOpen(false)
                setIsInsertMode(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    return <div className="fixed left-0 top-0 w-dvw h-dvh  z-[2000] flex justify-center items-center ">
        <div className={`w-[90vw] lg:w-[800px] lg:max-w-[800px] lg:flex-row flex-col lg:h-[60vh] lg:mt-20 p-1 bg-slate-100 shadow-lg border-black rounded-lg flex items-center dark:!bg-slate-600`} ref={popupRef}>

            {addingData ?
                <AddDataPopup popupStates={popupStates} modifiedRelation={modifiedRelation} setFilteredData={setFilteredData}
                ></AddDataPopup> :
                isInsertMode ?
                    <InsertDataPopup popupStates={popupStates} modifiedRelation={modifiedRelation} setFilteredData={setFilteredData}

                        hoveredPair={hoveredPair} setIsInsertMode={setIsInsertMode} ></InsertDataPopup> :
                    <DefaultPopup popupStates={popupStates} setFilteredData={setFilteredData}></DefaultPopup>

            }
        </div>
    </div>





}



const DefaultPopup = ({ popupStates, setFilteredData }) => {
    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation, setMustDepthRecalculate, unsavedWordCount, setUnsavedWordCount] = popupStates

    const [tempWord, setTempWord] = useState({ ...word })
    const [editEnabled, setEditEnabled] = useState(false)
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [anyChangeMade, setAnyChangeMade] = useState(false)
    const [wordId, setWordId] = useState(word.id)


    const handleInputChange = (key, e) => {

        console.log("pressed");
        console.log([key, e.target.value]);
        tempWord[key] = e.target.value
        setAnyChangeMade(true)
    }

    const saveEditedWord = () => {
        const id = word.id
        allWords[id] = tempWord
        setFilteredData([[...allWords]])
        setPopupOpen(false)
        setUnsavedWordCount(unsavedWordCount + 1)

    }
    const deleteWord = () => {
        const id = word.id
        allWords[id] = tempWord
        let derivesFrom = word["rel"]["derives"]["from"] || []
        let loansFrom = word["rel"]["loans"]["from"] || []
        let homonymFrom =word["rel"]["homonym"]["from"] || []
        let goToItems = derivesFrom.concat(loansFrom, homonymFrom)
        for(const parent of goToItems){
            for(const rel of relationsAll){ 

                let indToRemove = allWords[parent]["rel"][rel]["to"]?.indexOf(id)
                if(indToRemove > -1){
                    allWords[parent]["rel"][rel]["to"].splice(indToRemove,1)
                }
            }
        }
        tempWord["rel"] = { "derives": {}, "loans": {}, "homonym": {} }
        setFilteredData([[...allWords]])
        setPopupOpen(false)
        setUnsavedWordCount(unsavedWordCount + 1)

    }
    return <>
        {/* LEFT PART OF THE POPUP */}
        <div className="flex flex-col justify-center items-center flex-1">
            <span className={`p-1 m-4 rounded-xl ${langColors[word.lang][0]}`} > {langColors[word.lang][1]} word</span>
            <span>{word.key}</span>
            <span className="text-2xl mb-12">{word.original}</span>
            <span>{word.gender}</span>
            <span>{word.type}</span>
            <span>{word.desc}</span>
            {editEnabled ? <div className="flex flex-col m-4 p-2 border-2 border-slate-400 shadow-xl rounded-xl">
                {filledFields.map((x, key_ind) =>
                    <div className="flex m-1" key={key_ind}>
                        <span className="flex-1 m-1">{x[0]} </span>
                        <input className="flex-1 rounded" onChange={(e) => handleInputChange(x[0], e)} defaultValue={word[x[0]]}></input>
                    </div>
                )}
                {anyChangeMade ? <div className="m-4 p-2 border bg-lime-500 text-center rounded-lg cursor-pointer " onClick={() => saveEditedWord()}>SAVE CHANGES</div> : <></>}
            </div> : deleteClicked ?
                <div> Are you sure to delete this word ?
                    <div className="m-4 p-2 border bg-red-500 text-center rounded-lg cursor-pointer " onClick={() => deleteWord()}>YES</div>
                    <div className="m-4 p-2 border bg-lime-500 text-center rounded-lg cursor-pointer " onClick={() => setDeleteClicked(false)}>NO</div>
                </div> :
                <div>
                    <div className="m-4 p-2 border bg-lime-500 text-center rounded-lg cursor-pointer " onClick={() => setEditEnabled(true)}>EDIT WORD</div>
                    <div className="m-4 p-2 border bg-red-500 text-center rounded-lg cursor-pointer " onClick={() => setDeleteClicked(true)}>DELETE WORD</div>
                </div>
            }

        </div>
        {/* RIGHT PART OF THE POPUP */}
        <div className={`flex flex-col   w-full h-full  flex-1 ${editEnabled ? "max-h-0 lg:max-h-full overflow-hidden" : ""}`}>
            {/* FIRST LINE (DERIVES) OF RIGHT PART */}
            <RelationshipContainer relation={"derives"} popupStates={popupStates}></RelationshipContainer>

            {/* SECOND LINE (LOANS) OF RIGHT PART */}
            <RelationshipContainer relation={"loans"} popupStates={popupStates}></RelationshipContainer>

            {/* THIRD LINE (HOMONYM) OF RIGHT PART */}
            <RelationshipContainer relation={"homonym"} popupStates={popupStates}></RelationshipContainer>
        </div>
    </ >
}


const AddDataPopup = ({ popupStates, modifiedRelation, setFilteredData }) => {
    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation, setMustDepthRecalculate, unsavedWordCount, setUnsavedWordCount] = popupStates

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

        <div className="flex flex-1 justify-center">{modifiedRelation[0]} {modifiedRelation[1]}</div>
        <CreateWordDiv newWordData={newWordData} setNewWordData={setNewWordData}
            relation={modifiedRelation} wordPrev={word}
            newId={newId} allWords={allWords}
            setAddingData={setAddingData}
            setFilteredData={setFilteredData}
            setMustDepthRecalculate={setMustDepthRecalculate}
            unsavedWordCount={unsavedWordCount}
            setUnsavedWordCount={setUnsavedWordCount} ></CreateWordDiv>
    </>


}

const InsertDataPopup = ({ popupStates, modifiedRelation, setFilteredData, hoveredPair, setIsInsertMode }) => {
    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation, setMustDepthRecalculate, unsavedWordCount, setUnsavedWordCount] = popupStates

    const [newWordData, setNewWordData] = useState(null)
    const newId = allWords.length
    console.log(hoveredPair);
    const wordUp = allWords[hoveredPair[0]]
    const wordDown = allWords[hoveredPair[1]]

    const [firstRelation, setFirstRelation] = useState(0)
    const [secondRelation, setSecondRelation] = useState(0)
    const relationsAll = ["derives", "loans", "homonym"]
    return <>
        <div className="flex lg:flex-col justify-center items-center text-center flex-1 flex-row">
            <div className="WORD flex flex-col items-center flex-1 m-2">
                <span className={`p-1 m-1 rounded-xl ${langColors[wordUp.lang][0]}`} > {langColors[wordUp.lang][1]} word</span>
                <span>{wordUp.key}</span>
                <span className="text-2xl">{wordUp.original}</span>
            </div>

            <div className="mt-4 lg:mt-10">{relationsAll.map((rel, rel_id) =>
                <div key={rel_id}
                    className={`m-2 p-2 text-center rounded-xl ${rel_id === firstRelation ? "bg-orange-200 border-black border animate-bounce" : ""}`}
                    onClick={() => setFirstRelation(rel_id)}> {rel} to</div>)}</div>
        </div>

        <CreateWordDiv newWordData={newWordData} setNewWordData={setNewWordData}
            relation={modifiedRelation} wordPrev={word}
            newId={newId} allWords={allWords}
            isInsertMode={true}
            setIsInsertMode={setIsInsertMode}
            insertionRelations={[firstRelation, secondRelation, relationsAll]}
            setMustDepthRecalculate={setMustDepthRecalculate}
            hoveredPair={hoveredPair}
            setAddingData={setAddingData}
            setFilteredData={setFilteredData}
            unsavedWordCount={unsavedWordCount}
            setUnsavedWordCount={setUnsavedWordCount} ></CreateWordDiv>

        <div className="flex lg:flex-col justify-center items-center text-center flex-1 flex-row">
            <div className="WORD flex flex-col items-center flex-1 m-2">
                <span className={`p-1 m-1 rounded-xl ${langColors[wordDown.lang][0]}`} > {langColors[wordDown.lang][1]} word</span>
                <span>{wordDown.key}</span>
                <span className="text-2xl">{wordDown.original}</span>
            </div>
            <div className="mt-4 lg:mt-10">{relationsAll.map((rel, rel_id) =>
                <div key={rel_id}
                    className={`m-2 p-2 text-center rounded-xl ${rel_id === secondRelation ? "bg-orange-200 border-black border animate-bounce" : ""}`}
                    onClick={() => setSecondRelation(rel_id)}> {rel} from</div>)}</div>

        </div>
    </>

}

const RelationshipContainer = ({ relation, popupStates }) => {

    const [word, setPopupOpen, setSelectedWord, allWords, setAddingData, setModifiedRelation, setMustDepthRecalculate, unsavedWordCount, setUnsavedWordCount] = popupStates


    const addButtonStyle = "w-8 h-8 items-center self-center text-center text-2xl relative  rounded-xl text-white bg-emerald-400"
    const relatedWordSpanStyle = "p-1 m-1 rounded cursor-pointer hover:shadow-md text-center"

    return (
        <div className="flex flex-row justify-around   flex-1   h-full">
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