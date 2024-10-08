import { useEffect, useState } from "react"
import langColors from "./languageColors"

const relationsAll = ["derives", "loans", "homonym"]
const relationsAllForText = ["derives from", "is loaned from", "is homonym of"]

const reqFields = [["key", ""], ["lang", ""]]
const auxiliaryField = [["original", ""], ["gender", ""], ["desc", ""], ["type", "noun"], ["detail", ""], ["alt", ""]]
const autoReqFields = [["id", 0], ["depth", 0]]
/*, ["rel", {
    "derives": {},
    "loans": {},
    "homonym": {}
}]]*/

let filledFields = reqFields.concat(auxiliaryField)
let fields = reqFields.concat(auxiliaryField, autoReqFields)

const transitionClassForLinesDefault = "transition-all duration-400"




const DrawRelation = ({ x1, x2, heightOffset, y, depthDiff, pair, setHoveredPair, isInsertMode, setIsInsertMode, highlightedWords }) => {

    const [lineColor, setLineColor] = useState("#777")
    const [lineWidth, setLineWidth] = useState(1)
    const [clicked, setClicked] = useState(false)
    const [lineOpacity, setLineOpacity] = useState(0)
    const [transitionClass, setTransitionClass] = useState(transitionClassForLinesDefault)

    const setHoverColor = () => {
        setLineColor("#f77")
        setLineWidth(3)
        setHoveredPair(pair)
        console.log(pair);
    }
    const revertHoverColor = (e) => {
        if (!isInsertMode) {

            console.log(e)
            console.log([e.relatedTarget, e.toElement]);

            setLineColor("#777")
            setLineWidth(1)
            console.log("LEFTTTTTTTTTTTTTT", clicked, pair);
            if (!clicked) {

                setHoveredPair([-1, -1])
            }
        }

    }
    useEffect(() => {
        setLineColor("#777")
        setLineWidth(1)
    }, [isInsertMode])

    useEffect(() => {
        setLineOpacity(0)
        setTimeout(() => {
            setLineOpacity(highlightedWords.includes(pair[0]) & highlightedWords.includes(pair[1]) ? 1 : 0.05)


        }, 400)
    }, [highlightedWords])

    return <svg className="absolute overflow-visible z-0 w-1 h-1">
        <SteppedLine x={[x1, x2]} heightOffset={heightOffset} y={y}
            lineColor={lineColor} lineWidth={lineWidth} lineOpacity={lineOpacity}
            transitionClass={transitionClass}
            setClicked={setClicked} setHoverColor={setHoverColor} revertHoverColor={revertHoverColor} setIsInsertMode={setIsInsertMode}></SteppedLine>

    </svg>

}


const DirectLine = ({ x, heightOffset, y, lineColor, lineWidth, lineOpacity, transitionClass, setClicked, setHoverColor, revertHoverColor, setIsInsertMode }) => {
    const [x1, x2] = x
    return <>
        <defs>
            <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                markerUnits={"userSpaceOnUse"}
                orient="auto-start-reverse"

                stroke={lineColor}
                fill={lineColor}
            >

                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line
            className={transitionClass}
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill={lineColor}
            opacity={lineOpacity}
            markerEnd="url(#arrow)"></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseLeave={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={"transparent"}
            strokeWidth={20}></line>
    </>
}
const SteppedLine = ({ x, heightOffset, y, lineColor, lineWidth, lineOpacity, transitionClass, setClicked, setHoverColor, revertHoverColor, setIsInsertMode }) => {

    const [x1, x2] = x
    return <>
        <defs>
            <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                markerUnits={"userSpaceOnUse"}
                orient="auto-start-reverse"
                stroke={lineColor}
                fill={lineColor}

            >

                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line
            className={transitionClass}
            x1={x1}
            y1={heightOffset}
            x2={x1}
            y2={heightOffset + y * 0.5}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={lineOpacity}></line>
        <line
            className={transitionClass}
            x1={x1}
            y1={heightOffset + y * 0.5}
            x2={x2}
            y2={heightOffset + y * 0.5}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={lineOpacity}></line>
        <line
            className={transitionClass}
            x1={x2}
            y1={heightOffset + y * 0.5}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={lineOpacity}
            markerEnd="url(#arrow)"
        ></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseLeave={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x1}
            y1={heightOffset + y * 0.5}
            x2={x2}
            y2={heightOffset + y * 0.5}
            stroke={"transparent"}
            strokeWidth={8}></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseLeave={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x2}
            y1={heightOffset + y * 0.5}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={"transparent"}
            strokeWidth={8}>
        </line>

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


async function FetchSearchWords(textkey) {
    let wordsData = []
    try {
        const response = await fetch('/api/search-word-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ key: textkey })
        });

        if (!response.ok) {
            const message = await response.text();
            console.log(message);

        } else {
            const responseResolved = await response;
            const data = await responseResolved.json();
            const message = data.message;
            console.log(["HEY2", data.responseData]);
            wordsData = data.responseData.searchData[0].data
            console.log(["HEY", wordsData]);

            // newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
        }

    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
    }
    // Pass data to the page via props
    return wordsData
}
async function InitiateNewClusterClient(newClusterData) {
    let newfilteredData = {}
    try {
        const response = await fetch('/api/initiate-cluster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ newClusterData: newClusterData })
        });

        if (!response.ok) {
            const message = await response.text();
            console.log(message);
        } else {
            const responseResolved = await response;
            const data = await responseResolved.json();
            const message = data.message;

            newfilteredData = data.responseData.clusterData
            //console.log(["HEY", newfilteredData]);

            // newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
        }

    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
    }
    // Pass data to the page via props
    return newfilteredData
}

const checkWordReady = (wordData, searchData) => {

    let isReady = true
    for (const field of reqFields) {
        //console.log(wordData, field, wordData[field] !== "", isReady && (wordData[field] !== ""));
        isReady = isReady && Object.keys(wordData).includes(field[0]) && (wordData[field[0]].trim() !== "")
    }

    isReady = isReady && Object.keys(langColors).includes(wordData["lang"])

    isReady = isReady && !searchData.map(x => x[0] + x[1]).includes(wordData["key"] + wordData["lang"])
    return isReady

}
const calculateAllChildrenRecursively = (data, nodeList) => {

    console.log(data, nodeList);
    if (nodeList.length === 0) {
        return []
    }
    else {

        let result = []
        for (const node of nodeList) {
            let derivesTo = data[node]["rel"]["derives"]["to"] || []
            let loansTo = data[node]["rel"]["loans"]["to"] || []
            let homonymTo = data[node]["rel"]["homonym"]["to"] || []

            let goToItems = derivesTo.concat(loansTo, homonymTo)
            result.push(node)
            result.push(calculateAllChildrenRecursively(data, goToItems))
        }
        return result.flat(1)
    }
}

const calculateWidthBelowNode = (data, nodeList) => {

    if (nodeList.length === 0) {
        return 1
    }
    else {

        let result = 0
        for (const node of nodeList) {
            let derivesTo = data[node]["rel"]["derives"]["to"] || []
            let loansTo = data[node]["rel"]["loans"]["to"] || []
            let homonymTo = data[node]["rel"]["homonym"]["to"] || []

            let goToItems = derivesTo.concat(loansTo, homonymTo)
            result += calculateWidthBelowNode(data, goToItems)
        }
        return result
    }
}

const prepareWidthBelowNode = (data) => {
    const widthBelowDict = {}
    for (const node in data) {
        widthBelowDict[node] = calculateWidthBelowNode(data, [node])
    }
    console.log(widthBelowDict);
    return widthBelowDict
}
const calculatePositions = (data, wordWidth, totalDepth, leftPixelLimit) => {

    // Part 0 Define parent offset dictionary. This is used in aligning children properly, in the case of adjusted parent (after unbalanced children offset)
    const parentOffset = {}
    // Part 1 Recursively calculate width needed for each node
    const widthBelowDict = prepareWidthBelowNode(data)
    console.log(widthBelowDict);


    // Part 2 Pick the root and the children
    let returnDict = {}
    let root = data.filter(x => x.depth === 0)
    let depthItems = root.length
    //console.log(["SELECTED ", data]);
    //console.log(root[0]["rel"]["derives"]["to"])
    let idnow = root[0]["id"]
    returnDict[idnow] = 0 / 2 - wordWidth / 2                  // ASSIGN ROOT TO CENTER. TO DO HANDLE MULTIPLE ROOTS
    let derivesTo = root[0]["rel"]["derives"]["to"] || []
    let loansTo = root[0]["rel"]["loans"]["to"] || []
    let homonymTo = root[0]["rel"]["homonym"]["to"] || []

    let goToItems = [derivesTo.concat(loansTo, homonymTo)]
    let parentPositions = [0 / 2 - wordWidth / 2]
    let parentWidths = [widthBelowDict[idnow]]
    let removedParentOffsets = [0]
    // Part 3 Iterate over the children
    let safety = 0
    while (goToItems.length > 0) {

        let idsToProcess = goToItems[0]
        let parentPos = parentPositions[0]
        let parentWidth = parentWidths[0]
        let itemTogetherCount = idsToProcess.length
        let removedParentOffset = removedParentOffsets[0]
        let extraSpaceNeeded = 0
        for (var idNow = 0; idNow < itemTogetherCount; idNow++) {  // Treat the similar siblings together (e.g derived from same root)
            const widthForThisSibling = widthBelowDict[idsToProcess[idNow]] || 1

            let nodeData = data[idsToProcess[idNow]]//data.filter(x => x.id === idsToProcess[idNow])
            let derivesTo = nodeData["rel"]["derives"]["to"] || []
            let loansTo = nodeData["rel"]["loans"]["to"] || []
            let homonymTo = nodeData["rel"]["homonym"]["to"] || []

            let newGoToItems = derivesTo.concat(loansTo, homonymTo)
            // small fix on parent, based on different width children
            const firstAndLastChildren = [newGoToItems[0], newGoToItems[newGoToItems.length - 1]]
            //console.log([idsToProcess[idNow], firstAndLastChildren]);
            let additionalChildrenOffset = widthBelowDict[firstAndLastChildren[0]] - widthBelowDict[firstAndLastChildren[1]] || 0
            parentOffset[idsToProcess[idNow]] = additionalChildrenOffset

            let finalOffsetForWidthImbalance = (additionalChildrenOffset - removedParentOffset) / 2  // remove parent's offset
            returnDict[idsToProcess[idNow]] = parentPos + (extraSpaceNeeded + (finalOffsetForWidthImbalance + widthForThisSibling - parentWidth) / 2 + idNow) * wordWidth * 1.2  // assign their left values

            extraSpaceNeeded += (widthForThisSibling - 1)

            if (newGoToItems.length > 0) {

                goToItems.push(newGoToItems)
                parentPositions.push(returnDict[idsToProcess[idNow]])
                parentWidths.push(widthBelowDict[idsToProcess[idNow]])
                removedParentOffsets.push(parentOffset[idsToProcess[idNow]])
            }

        }
        goToItems.shift()           // remove the first element
        parentPositions.shift()     // remove the first element
        parentWidths.shift()
        removedParentOffsets.shift()
    }
    const leftOverflow = leftPixelLimit - Math.min(...Object.keys(returnDict).map(x => returnDict[x]))
    if (leftOverflow > 0) {

        for (const node of Object.keys(returnDict)) {
            //console.log([node, returnDict]);
            returnDict[node] = returnDict[node] + leftOverflow
        }
    }
    const maxLeftValue = Math.max(...Object.keys(returnDict).map(x => returnDict[x]))
    return [returnDict, maxLeftValue]
}
// TO DO for each depth, go over all nodes, extract from-to relations, and calculate xs and ys
const calculateLines = (data, wordWidth, wordHeight, totalDepth, positionDict) => {
    let outLinesList = []
    let outLineNodes = []
    for (var depthNow = 0; depthNow <= totalDepth; depthNow++) {  // iterating each depth
        let root = data.filter(x => x.depth === depthNow)
        let linesForDepth = []
        let nodesForDepth = []
        for (var elt of root) { // iterating each element/word
            let derivesTo = elt["rel"]["derives"]["to"] || []
            let loansTo = elt["rel"]["loans"]["to"] || []
            let homonymTo = elt["rel"]["homonym"]["to"] || []
            let newGoToItems = derivesTo.concat(loansTo, homonymTo)

            for (var rel of newGoToItems) { // iterating every relation to gather lines
                linesForDepth.push([positionDict[elt["id"]] + wordWidth / 2, positionDict[rel] + wordWidth / 2, wordHeight]) // x-from, x-to, height
                nodesForDepth.push([elt["id"], rel])
            }

            //console.log(newGoToItems);
        }
        outLinesList.push(linesForDepth)
        outLineNodes.push(nodesForDepth)
    }
    return [outLinesList, outLineNodes]
}
const findHighlightedWords = (wordData, filteredData, setHighlightedWords) => {

    let newHighlightedWords = [wordData.id]

    let derivesFrom = wordData["rel"]["derives"]["from"] || []
    let loansFrom = wordData["rel"]["loans"]["from"] || []
    let homonymFrom = wordData["rel"]["homonym"]["from"] || []

    let goToItems = derivesFrom.concat(loansFrom, homonymFrom)
    while (goToItems.length > 0) {
        let nodeData = filteredData[goToItems[0]]//data.filter(x => x.id === idsToProcess[idNow])
        console.log(filteredData, goToItems, nodeData);
        derivesFrom = nodeData["rel"]["derives"]["from"] || []
        loansFrom = nodeData["rel"]["loans"]["from"] || []
        homonymFrom = nodeData["rel"]["homonym"]["from"] || []

        let newGoToItems = derivesFrom.concat(loansFrom, homonymFrom)
        newHighlightedWords.push(goToItems[0])
        goToItems.push(...newGoToItems)

        goToItems.shift()
    }

    setHighlightedWords([...newHighlightedWords])

    return [...newHighlightedWords]
}
const findDescendantWords = (wordData, filteredData, setHighlightedWords) => {

    let newHighlightedWords = [wordData.id]

    let derivesFrom = wordData["rel"]["derives"]["to"] || []
    let loansFrom = wordData["rel"]["loans"]["to"] || []
    let homonymFrom = wordData["rel"]["homonym"]["to"] || []

    let goToItems = derivesFrom.concat(loansFrom, homonymFrom)
    while (goToItems.length > 0) {
        let nodeData = filteredData[goToItems[0]]//data.filter(x => x.id === idsToProcess[idNow])
        console.log(filteredData, goToItems, nodeData);
        derivesFrom = nodeData["rel"]["derives"]["to"] || []
        loansFrom = nodeData["rel"]["loans"]["to"] || []
        homonymFrom = nodeData["rel"]["homonym"]["to"] || []

        let newGoToItems = derivesFrom.concat(loansFrom, homonymFrom)
        newHighlightedWords.push(goToItems[0])
        goToItems.push(...newGoToItems)

        goToItems.shift()
    }

    setHighlightedWords([...newHighlightedWords])

    return [...newHighlightedWords]
}
const calculateHighlightPositions = (posDict, setPosDict, highlightedWords) => {


    const leafNode = highlightedWords[0]
    const leafNodeLeftValue = posDict[leafNode]

    const newPosDict = { ...posDict }
    let changedAny = false
    for (const node of highlightedWords) {
        changedAny = changedAny || (newPosDict[node] !== leafNodeLeftValue)
        newPosDict[node] = leafNodeLeftValue
    }

    if (changedAny) {  //if the left offset is changing, meaning that a relocation needed

        const nodesRight = Object.keys(newPosDict).filter(x => newPosDict[x] > leafNodeLeftValue + 125)
        const minOffset = Math.min(...nodesRight.map(x => newPosDict[x] - leafNodeLeftValue))
        console.log(nodesRight, minOffset);
        // if the space is not enough, add some offset for everything to the right
        if (minOffset < 200) {
            for (const node of nodesRight) {
                newPosDict[node] += 75
            }
        }

    }

    setPosDict(newPosDict)
    return newPosDict
}

function prepareInheritanceTextShort(wordId, filteredData) {
    const word = filteredData[wordId]
    let fromRelDict = {}
    let fromRelTexts = []
    for (const [id, rel] of relationsAll.entries()) {
        let relFrom = word["rel"][rel]["from"] || []
        if (relFrom.length > 0) {
            for (const parentNow of relFrom) { //in case there are several parents with same relation

                const thisWordLang = langColors[word.lang][1]
                const parentWord = filteredData[parentNow]
                const parentWordLang = langColors[parentWord.lang][1]
                fromRelTexts.push(<span>{"The " + thisWordLang + " " + (word.type || "word") + " "} <span className="font-bold">{word.original || word.key} </span>{" " + relationsAllForText[id] + " the " + parentWordLang + " " + (parentWord.type || "word") + " "} <span className="font-bold">{parentWord.original || parentWord.key} </span></span>)
            }
        }
    }
    return fromRelTexts
}

export {
    DrawRelation,  RecalculateDepthAfter, FetchSearchWords, InitiateNewClusterClient,
    calculateWidthBelowNode, prepareWidthBelowNode, calculateLines, calculatePositions,
    findHighlightedWords, findDescendantWords, calculateHighlightPositions, reqFields, auxiliaryField, autoReqFields, filledFields, fields, relationsAll, checkWordReady,
    calculateAllChildrenRecursively, prepareInheritanceTextShort
}