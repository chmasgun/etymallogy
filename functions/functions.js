import { useState } from "react"





const langColors = {
    "PIE": ["bg-gradient-to-bl from-indigo-300", "Proto-Indo-European"],
    "PGER": ["bg-gradient-to-bl from-orange-300", "Proto-Germanic"],


    "AR": ["bg-lime-500", "Arabic"],
    "TR": ["bg-red-300", "Turkish"],
    "EN": ["bg-sky-300", "English"],
    "FR": ["bg-indigo-300", "French"],
    "LA": ["bg-red-600", "Latin"],
    "IT": ["bg-green-400", "Italian"],
    "GR": ["bg-sky-500", "Greek"],
    "DE": ["bg-orange-400", "German"],
    "FA": ["bg-yellow-500", "Persian"]
    , "DU": ["bg-orange-600", "Dutch"],
}


const DrawRelation = ({ x1, x2, heightOffset, y, depthDiff, pair, setHoveredPair, setIsInsertMode }) => {

    const [lineColor, setLineColor] = useState("#111")
    const [lineWidth, setLineWidth] = useState(1)
    const [clicked, setClicked] = useState(false)

    const setHoverColor = () => {
        setLineColor("#f77")
        setLineWidth(3)
        setHoveredPair(pair)
        console.log(pair);
    }
    const revertHoverColor = (e) => {
        console.log(e)
        console.log([e.relatedTarget, e.toElement]);

        setLineColor("#111")
        setLineWidth(1)
        console.log("LEFTTTTTTTTTTTTTT");
        if (!clicked) {

            setHoveredPair([-1, -1])
        }

    }

    return <svg className="absolute overflow-visible z-0 w-1 h-1">
        <SteppedLine x= {[x1,x2]} heightOffset={heightOffset} y={y} lineColor={lineColor} lineWidth={lineWidth}
            setClicked={setClicked} setHoverColor={setHoverColor} revertHoverColor={revertHoverColor} setIsInsertMode={setIsInsertMode}></SteppedLine>

    </svg>

}


const DirectLine = ({ x,heightOffset, y, lineColor, lineWidth,  setClicked,  setHoverColor,revertHoverColor, setIsInsertMode}) => {
    const [x1,x2] = x
    return <>
        <line

            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={lineColor}
            strokeWidth={lineWidth}></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseOut={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={"transparent"}
            strokeWidth={20}></line>
            </>
}
const SteppedLine = ({ x,heightOffset, y, lineColor, lineWidth,  setClicked,  setHoverColor,revertHoverColor, setIsInsertMode}) => {
    const [x1, x2] = x
    return <>
        <line

            x1={x1}
            y1={heightOffset}
            x2={x1}
            y2={heightOffset + y }
            stroke={lineColor}
            strokeWidth={lineWidth}></line>
        <line

            x1={x1}
            y1={heightOffset+ y }
            x2={x2}
            y2={heightOffset + y }
            stroke={lineColor}
            strokeWidth={lineWidth}></line>
        <line

            x1={x2}
            y1={heightOffset + y }
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={lineColor}
            strokeWidth={lineWidth}></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseOut={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={"transparent"}
            strokeWidth={20}></line>
    </>
}


function RecalculateDepthAfter(allWords, nodeId, setFilteredData) {

    // fix the depth for negative 
    if (allWords[nodeId]["depth"] < 0) { allWords[nodeId]["depth"] = 0 }

    let depthDict = {}
    depthDict[nodeId] = allWords[nodeId]["depth"]
    let parentDict = {}

    let derivesTo = allWords[nodeId]["rel"]["derives"]["to"] || []
    let loansTo = allWords[nodeId]["rel"]["loans"]["to"] || []
    let homonymTo = allWords[nodeId]["rel"]["homonym"]["to"] || []

    let goToItems = derivesTo.concat(loansTo, homonymTo)
    // initialize child-parent mapping
    for (const child of goToItems) {
        parentDict[child] = nodeId
    }
    let safety = 0
    console.log(goToItems);
    console.log(parentDict);
    console.log(depthDict);
    while (goToItems.length > 0) {
        safety = safety + 1
        if (safety > 300) { break }

        console.log(goToItems);
        //console.log(data);
        let idToProcess = goToItems[0]
        let parentDepth = depthDict[parentDict[idToProcess]]
        console.log(parentDict);
        console.log(depthDict);
        //for (var idNow = 0; idNow < itemTogetherCount; idNow++) {  // Treat the similar siblings together (e.g derived from same root)
        allWords[idToProcess]["depth"] = parentDepth + 1
        depthDict[idToProcess] = parentDepth + 1

        //console.log([idsToProcess[idNow], nodeData]);
        let derivesTo = allWords[idToProcess]["rel"]["derives"]["to"] || []
        let loansTo = allWords[idToProcess]["rel"]["loans"]["to"] || []
        let homonymTo = allWords[idToProcess]["rel"]["homonym"]["to"] || []

        let newGoToItems = derivesTo.concat(loansTo, homonymTo)
        //console.log([idsToProcess[idNow], newGoToItems]);
        if (newGoToItems.length > 0) {

            goToItems.push(...newGoToItems)
            for (const child of newGoToItems) {
                parentDict[child] = idToProcess
            }

        }

        //}
        goToItems.shift()           // remove the first element

        //console.log(goToItems);
        //console.log(parentPositions);

    }
    const newAllWords = [...allWords]
    console.log(newAllWords);
    setFilteredData([newAllWords])
}



export { DrawRelation, langColors, RecalculateDepthAfter }