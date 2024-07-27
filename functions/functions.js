import { useEffect, useState } from "react"





const langColors = {
    "PIE": ["bg-gradient-to-bl from-indigo-300", "Proto-Indo-European", "text-gradient-to-bl from-indigo-300"],
    "PGER": ["bg-gradient-to-bl from-orange-300", "Proto-Germanic", "text-gradient-to-bl from-orange-300"],


    "AR": ["bg-lime-500", "Arabic", "text-lime-500"],
    "TR": ["bg-red-300", "Turkish", "text-red-300"],
    "EN": ["bg-sky-300", "English", "text-sky-300"],
    "FR": ["bg-indigo-300", "French", "text-indigo-300"],
    "LA": ["bg-red-600", "Latin", "text-red-600"],
    "IT": ["bg-green-400", "Italian", "text-green-400"],
    "GR": ["bg-sky-500", "Greek", "text-sky-500"],
    "DE": ["bg-orange-400", "German", "text-orange-400"],
    "FA": ["bg-yellow-500", "Persian", "text-yellow-500"]
    , "DU": ["bg-orange-600", "Dutch", "text-orange-600"],
}


const DrawRelation = ({ x1, x2, heightOffset, y, depthDiff, pair, setHoveredPair, isInsertMode, setIsInsertMode, highlightedWords  }) => {

    const [lineColor, setLineColor] = useState("#111")
    const [lineWidth, setLineWidth] = useState(1)
    const [clicked, setClicked] = useState(false)
    const [lineOpacity, setLineOpacity] = useState( highlightedWords.includes(pair[0]) & highlightedWords.includes(pair[1]) ? 1 : 0.1)

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

            setLineColor("#111")
            setLineWidth(1)
            console.log("LEFTTTTTTTTTTTTTT", clicked, pair);
            if (!clicked) {

                setHoveredPair([-1, -1])
            }
        }

    }
    useEffect(() => {
        setLineColor("#111")
        setLineWidth(1)
    }, [isInsertMode])

    return <svg className="absolute overflow-visible z-0 w-1 h-1">
        <SteppedLine x={[x1, x2]} heightOffset={heightOffset} y={y} lineColor={lineColor} lineWidth={lineWidth} lineOpacity={lineOpacity}
            setClicked={setClicked} setHoverColor={setHoverColor} revertHoverColor={revertHoverColor} setIsInsertMode={setIsInsertMode}></SteppedLine>

    </svg>

}


const DirectLine = ({ x, heightOffset, y, lineColor, lineWidth, lineOpacity, setClicked, setHoverColor, revertHoverColor, setIsInsertMode }) => {
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
                opacity={lineOpacity}
            >

                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={lineColor}
            strokeWidth={lineWidth}
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
const SteppedLine = ({ x, heightOffset, y, lineColor, lineWidth, lineOpacity, setClicked, setHoverColor, revertHoverColor, setIsInsertMode }) => {
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
            >

                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
        </defs>
        <line

            x1={x1}
            y1={heightOffset}
            x2={x1}
            y2={heightOffset + y}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={lineOpacity}></line>
        <line

            x1={x1}
            y1={heightOffset + y}
            x2={x2}
            y2={heightOffset + y}
            stroke={lineColor}
            strokeWidth={lineWidth}
            opacity={lineOpacity}></line>
        <line

            x1={x2}
            y1={heightOffset + y}
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
            y1={heightOffset + y}
            x2={x2}
            y2={heightOffset + y}
            stroke={"transparent"}
            strokeWidth={20}></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseLeave={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true); setIsInsertMode(true); setTimeout(() => setClicked(false), 20) }}
            x1={x2}
            y1={heightOffset + y}
            x2={x2}
            y2={heightOffset + y * 2 - 8}
            stroke={"transparent"}
            strokeWidth={20}>
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

export { DrawRelation, langColors, RecalculateDepthAfter, FetchSearchWords }