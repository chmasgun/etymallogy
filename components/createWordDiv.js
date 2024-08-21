
import { InitiateNewClusterClient, checkWordReady, FetchSearchWords, langColors, reqFields, auxiliaryField, autoReqFields, filledFields, fields, relationsAll } from "@/functions/functions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const insertSaveButtonClass = "m-4 p-2 border bg-lime-500 text-center rounded-lg cursor-pointer disabled:opacity-40 disabled:bg-gray-500 disabled:cursor-not-allowed"

export default function CreateWordDiv({ newWordData, setNewWordData, relation, wordPrev, newId, allWords, setAddingData, isInsertMode, initializeClusterMode, setSearchCandidatesAfterFilter, setNoDataFound, setSearchLoading,
    insertionRelations, setMustDepthRecalculate, hoveredPair, setIsInsertMode, setFilteredData, unsavedWordCount, setUnsavedWordCount }) {  // Manual inversion of FROM and TO. Careful!
    const router = useRouter();
    const [allowInitialize, setAllowInitialize] = useState(false)
    const [searchTextKey, setSearchTextKey] = useState("")

    const [searchCandidates, setSearchCandidates] = useState([])

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        let WordDefault = {}
        for (const field of fields) {
            WordDefault[field[0]] = field[1]
        }
        WordDefault["rel"] = { "derives": {}, "loans": {}, "homonym": {} }
        // FIND ID
        WordDefault["id"] = newId



        console.log(WordDefault);
        //console.log(relation)
        //console.log(wordPrev);
        setNewWordData(WordDefault)
    }, [newId])


    const handleInputChange = (key, e) => {

        console.log("pressed");
        console.log([key, e.target.value]);

        const newDict = { ...newWordData }
        newDict[key] = e.target.value.trim()
        setNewWordData(newDict)

    }
    useEffect(() => {

        setAllowInitialize(checkWordReady(newWordData, searchCandidates))

        if (newWordData.key && newWordData.key.length < 3) {
            setSearchCandidates([])
            setSearchCandidatesAfterFilter([])
            setSearchTextKey("")

            setNoDataFound(false)
        }
        else if (searchCandidates.length > 0) {
            const newMatchingWords = searchCandidates.filter(x => x[0].toLocaleLowerCase().slice(0, newWordData.key.length) === newWordData.key)

            setSearchCandidatesAfterFilter(newMatchingWords)
            setNoDataFound(newMatchingWords.length === 0 && searchCandidates.length > 0)

        }
        if (newWordData.key && newWordData.key.slice(0, 3) !== searchTextKey) {
            setSearchTextKey(newWordData.key.slice(0, 3))
        }
    }, [newWordData])

    useEffect(() => {
        const initFetchData = async () => {
            try {

                const newfilteredData = await FetchSearchWords(searchTextKey)
                if (newfilteredData.length > 0) {

                    setSearchCandidates(newfilteredData)
                    setSearchCandidatesAfterFilter(newfilteredData)

                    setNoDataFound(false)
                } else {
                    setNoDataFound(true)

                    console.log("NO DATA FOUND");
                }
                setSearchLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                setSearchLoading(false)

            }
        };
        if (searchTextKey.length === 3) {
            setSearchLoading(true)
            initFetchData();
        }
    }, [searchTextKey])

    async function initializeClusterFunction() {
        console.log("INITALIZE CLUSTER");
        const response = await InitiateNewClusterClient(newWordData)
        if(Object.keys(response).length===0 ){
            setErrorMessage("An error occurred during new cluster creation")
        }else{
            setErrorMessage("Cluster created successfully, redirecting now")
            console.log(newWordData);
            console.log("Cluster creation successful")
            console.log(response["cid"], response["words"][0]["key"]);
            setTimeout(() => {
                router.push(`/tree?cluster=${response["cid"]}&word=${response["words"][0]["key"]+response["words"][0]["lang"]}`);
            }, 500)
        }

    }

    const saveWordData = () => {
        // Part 1 modify the new word
        // FIND DEPTH
        const relationTypeUpDown = relation[1]
        const depthIncrement = relationTypeUpDown === "to" ? 1 : -1
        const parentWordDepth = wordPrev["depth"]
        newWordData["depth"] = parentWordDepth + depthIncrement
        if (parentWordDepth + depthIncrement < 0) {
            console.log(["RECALCULATE FOR ", newId]);
            setMustDepthRecalculate(newId)
        }

        console.log(newWordData);
        // FIND RELATION
        const oppositeRelation = relationTypeUpDown === "to" ? "from" : "to"
        const relName = relation[0]
        newWordData["rel"][relName][oppositeRelation] = [wordPrev["id"]]

        // Part 2 concat new word to the all word list
        console.log(newWordData);
        const newAllWords = [...allWords]
        newAllWords.push(newWordData)


        // Part 3 modify the existing word
        const existingRelation = newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]]  //for the existing word, get if the relation is already defined. We will either initialize or extend the list
        const isRelationDefinedBefore = (existingRelation || []).length > 0
        console.log([existingRelation, isRelationDefinedBefore])
        if (isRelationDefinedBefore) {
            newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]].push(newId)
        } else {
            newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]] = [newId]
        }
        console.log(newAllWords);

        setAddingData(false)
        setFilteredData([newAllWords])
        setUnsavedWordCount(unsavedWordCount + 1)
        setNewWordData(null)
    }

    const insertWordData = () => {
        const firstRelation = insertionRelations[2][insertionRelations[0]]
        const secondRelation = insertionRelations[2][insertionRelations[1]]
        const wordIdUp = hoveredPair[0]
        const wordIdDown = hoveredPair[1]
        const depthUp = allWords[wordIdUp]["depth"]

        // Part 1 prepare the new word
        newWordData["depth"] = depthUp + 1
        newWordData["rel"][firstRelation]["from"] = [wordIdUp]
        newWordData["rel"][secondRelation]["to"] = [wordIdDown]
        // Part 2 concat new word to the all word list
        console.log(newWordData);
        const newAllWords = [...allWords]
        newAllWords.push(newWordData)
        // Part 3 delete the previous relation
        for (const rel of relationsAll) { // search for all relations to locate the relation
            console.log(newAllWords[wordIdUp]["rel"]);
            console.log(rel);
            let indToRemove = newAllWords[wordIdUp]["rel"][rel]["to"]?.indexOf(wordIdDown)
            if (indToRemove > -1) {
                newAllWords[wordIdUp]["rel"][rel]["to"].splice(indToRemove, 1)
            }
            console.log(newAllWords);
            console.log([wordIdDown, wordIdUp, newId]);
            indToRemove = newAllWords[wordIdDown]["rel"][rel]["from"]?.indexOf(wordIdUp)
            if (indToRemove > -1) {
                newAllWords[wordIdDown]["rel"][rel]["from"].splice(indToRemove, 1)
            }
        }
        // Part 4 modify TO of UP word  
        //newAllWords[wordIdUp]["rel"][firstRelation]["to"] 
        const existingRelation = newAllWords[wordIdUp]["rel"][firstRelation]["to"]   //for the existing word, get if the relation is already defined. We will either initialize or extend the list
        const isRelationDefinedBefore = (existingRelation || []).length > 0

        if (isRelationDefinedBefore) {
            newAllWords[wordIdUp]["rel"][firstRelation]["to"].push(newId)
        } else {
            newAllWords[wordIdUp]["rel"][firstRelation]["to"] = [newId]
        }
        // Part 5 modify FROM of DOWN word 
        const existingRelation2 = newAllWords[wordIdDown]["rel"][secondRelation]["from"]   //for the existing word, get if the relation is already defined. We will either initialize or extend the list
        const isRelationDefinedBefore2 = (existingRelation2 || []).length > 0

        if (isRelationDefinedBefore2) {
            newAllWords[wordIdDown]["rel"][secondRelation]["from"].push(newId)
        } else {
            newAllWords[wordIdDown]["rel"][secondRelation]["from"] = [newId]
        }

        setAddingData(false)
        setIsInsertMode(false)
        setFilteredData([newAllWords])
        setUnsavedWordCount(unsavedWordCount + 1)
        setNewWordData(null)
        setMustDepthRecalculate(newId)
        console.log(newAllWords);
    }


    return <div className="flex flex-col m-4 p-2 border-2 border-slate-400 shadow-xl rounded-xl self-center">
        {filledFields.map((x, key_ind) =>
            <div className="flex m-1 relative"  key={key_ind}>
                <span className="flex-1 m-1">{x[0]} </span>
                <input
                    className="flex-1 rounded"
                    onChange={(e) => handleInputChange(x[0], e)}
                    defaultValue={x[1] || ""}
                />
                {x[0] === "lang" ? //if the language name is found, print it
                    <div className="absolute right-0 flex text-xs h-full max-w-20 text-center items-center "> {Object.keys(langColors).includes(newWordData["lang"]) ? langColors[newWordData["lang"]][1] : ""}</div>
                    : <></>}
            </div>)
        }
        {errorMessage !== "" ? <div>{errorMessage}</div>:<></>}
        {isInsertMode ? <button className={insertSaveButtonClass} disabled={!allowInitialize} onClick={() => insertWordData()}>INSERT WORD</button> :
            initializeClusterMode ? <button className={insertSaveButtonClass} disabled={!allowInitialize} onClick={() => initializeClusterFunction()}>INITIALIZE NEW CLUSTER</button> :
                <button className={insertSaveButtonClass} disabled={!allowInitialize} onClick={() => saveWordData()}>SAVE WORD</button>}
    </div>

}