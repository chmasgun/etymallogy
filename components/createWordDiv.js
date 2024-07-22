
import { langColors } from "@/functions/functions";
import { useEffect } from "react";


export default function CreateWordDiv({ newWordData, setNewWordData, relation, wordPrev, newId, allWords, setAddingData, setFilteredData,unsavedWordCount,setUnsavedWordCount}) {  // Manual inversion of FROM and TO. Careful!
    const reqFields = [["key", ""], ["lang", ""],["original",""]]
    const auxiliaryField = [["desc", ""], ["type", ""]]
    const autoReqFields = [["id", newId], ["depth", 0], ["rel", {
        "derives": {},
        "loans": {},
        "homonym": {}
    }]]

    let fields = reqFields.concat(auxiliaryField, autoReqFields)

    
    useEffect( () => {
        let WordDefault = {}
        for (const field of fields) {
            WordDefault[field[0]] = field[1]
        }

        // FIND DEPTH
        const relationTypeUpDown =  relation[1]
        const depthIncrement = relationTypeUpDown==="to" ? 1 : -1
        const parentWordDepth = wordPrev["depth"]
        WordDefault["depth"] = parentWordDepth + depthIncrement

        // FIND RELATION
        const oppositeRelation = relationTypeUpDown === "to" ? "from" : "to"
        const relName = relation[0]
        WordDefault["rel"][relName][oppositeRelation] = [wordPrev["id"]]

        //console.log(WordDefault);
        //console.log(relation)
        //console.log(wordPrev);
        setNewWordData(WordDefault)
    },[])


    const handleInputChange = (key, e) => {
        
        console.log("pressed");
        console.log([key, e.target.value]);

        const newDict = { ...newWordData}
        newDict[key]  = e.target.value
        setNewWordData(newDict)
        
    }

    const saveWordData = () => {


        const newAllWords = [...allWords]
        const existingRelation = newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]]  //for the existing word, get if the relation is already defined. We will either initialize or extend the list
        const isRelationDefinedBefore = (existingRelation || []).length > 0 
        console.log(   [existingRelation,  isRelationDefinedBefore])
        if(isRelationDefinedBefore){
            newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]].push(newId)
        }else{
            newAllWords[wordPrev["id"]]["rel"][relation[0]][relation[1]] = [newId]
        }
        console.log(newAllWords);
        newAllWords.push(newWordData)
        console.log(newAllWords);
        setAddingData(false)
        setFilteredData([newAllWords])
        setUnsavedWordCount(unsavedWordCount + 1 )
    }


    return <div className="flex flex-col m-4">
        {reqFields.concat(auxiliaryField).map((x,key_ind) =>
            <div key={key_ind}> {x[0]} <input onChange={(e) => handleInputChange(x[0],e)}></input> </div>)
        }
        <div className="m-8 border bg-lime-500" onClick={() => saveWordData()}>SAVE WORD</div>
    </div>






    //console.log(pos);
    return <div key={x.id} style={{ left: `${pos[x.id] || 0}px` }}
        onClick={() => { setSelectedWord(x); setPopupOpen(true) }}
        className={`word-card-individual  absolute border-2 min-w-32 min-h-24 z-10 text-center  justify-center rounded-lg flex flex-col ${langColors[x.lang][0]} hover:shadow-lg`} >
        { // absolute
        }
        <span>{x.key}</span>
        <span className="text-2xl"> {x.original}</span>
        <span className="text-xs"> {x.id}</span>
    </div>
}