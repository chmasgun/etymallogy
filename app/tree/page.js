"use client"
import Image from "next/image";
import { useEffect, useState, useRef, Suspense } from "react";
import WordCard from "@/components/wordCard";
import SaveToServerButton from "@/components/saveToServerButton";
import { DrawRelation, langColors, RecalculateDepthAfter } from "@/functions/functions";
import Legend from "@/components/legend";
import Popup from "@/components/popup";
import { useParams, useRouter , useSearchParams } from 'next/navigation';
//console.log(data[1]);

const depthMarginPx = 24
const leftPixelLimit = 0
const marginClass = `m-[${depthMarginPx}px]`;


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
const calculatePositions = (data, wordWidth, depthWidth, totalDepth) => {

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
  returnDict[idnow] = depthWidth / 2 - wordWidth / 2                  // ASSIGN ROOT TO CENTER. TO DO HANDLE MULTIPLE ROOTS
  let derivesTo = root[0]["rel"]["derives"]["to"] || []
  let loansTo = root[0]["rel"]["loans"]["to"] || []
  let homonymTo = root[0]["rel"]["homonym"]["to"] || []

  let goToItems = [derivesTo.concat(loansTo, homonymTo)]
  let parentPositions = [depthWidth / 2 - wordWidth / 2]
  let parentWidths = [widthBelowDict[idnow]]
  let removedParentOffsets = [0]
  // Part 3 Iterate over the children
  let safety = 0
  while (goToItems.length > 0) {
    safety = safety + 1
    if (safety > 50) { break }


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
      const firstAndLastChildren = [ newGoToItems[0], newGoToItems[newGoToItems.length-1]]
      console.log([idsToProcess[idNow], firstAndLastChildren]);
      let additionalChildrenOffset = widthBelowDict[firstAndLastChildren[0]] - widthBelowDict[firstAndLastChildren[1]] || 0 
      parentOffset[idsToProcess[idNow]] = additionalChildrenOffset
      
      let finalOffsetForWidthImbalance = (additionalChildrenOffset - removedParentOffset) / 2  // remove parent's offset
      returnDict[idsToProcess[idNow]] = parentPos + (extraSpaceNeeded + (finalOffsetForWidthImbalance  + widthForThisSibling - parentWidth) / 2 + idNow) * wordWidth * 1.2  // assign their left values

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
      console.log([node, returnDict]);
      returnDict[node] = returnDict[node] + leftOverflow
    }
  }
  return returnDict
}

// TO DO for each depth, go over all nodes, extract from-to relations, and calculate xs and ys
const calculateLines = (data, wordWidth, wordHeight, depthWidth, totalDepth, positionDict) => {
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
        linesForDepth.push([positionDict[elt["id"]] + wordWidth / 2, positionDict[rel] + wordWidth / 2, wordHeight])
        nodesForDepth.push([elt["id"], rel])
      }

      //console.log(newGoToItems);
    }
    outLinesList.push(linesForDepth)
    outLineNodes.push(nodesForDepth)
  }
  return [outLinesList, outLineNodes]
}


export default function Tree() {

  const router = useRouter();
  //const searchParams =  useSearchParams()

  let cluster = 0
  //if(typeof document !== 'undefined'){
    //let searchParams = new URLSearchParams(document.location.search);
    let searchParams =  useSearchParams()
    console.log(searchParams);
    cluster = searchParams.get("cluster");
  //}

  
  useEffect(() => {
    const initFetchData = async () => {
      try {
        console.log(cluster);
        const newfilteredData = await fetchData(parseInt(cluster));
        console.log(newfilteredData["words"]);
        setFilteredData(newfilteredData);
        setSelectedCluster(cluster);
        setUnsavedWordCount(0);
        setPosDict({});
        
        let newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth)));
        setMaxDepthData(newMaxDepthData);


        setDataFetchComplete(true)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    initFetchData();
  }, []);

  const [selectedCluster, setSelectedCluster] = useState(cluster);
  const [filteredData, setFilteredData] = useState([])//useState([data.filter((x) => x.cluster === 0)]);
  const [maxDepthData, setMaxDepthData] = useState([].map(x => Math.max(...x.map(y => y.depth)))) //useState([data.filter((x) => x.cluster === 0)].map(x => Math.max(...x.map(y => y.depth))))
  const [posDict, setPosDict] = useState({})
  const [lines, setLines] = useState([[], []])
  const [languageList, setLanguageList] = useState([])
  const [unsavedWordCount, setUnsavedWordCount] = useState(0)
  const [hoveredPair, setHoveredPair] = useState([-1, -1])
  const [isInsertMode, setIsInsertMode] = useState(false)
  const [mustDepthRecalculate, setMustDepthRecalculate] = useState(-1)
  const [dataFetchComplete, setDataFetchComplete] = useState(false)

  const popupRef = useRef();
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState("")
 


  console.log(filteredData);
  console.log(maxDepthData);
  console.log(lines);
  console.log(languageList);
  console.log(selectedWord)
  console.log(selectedCluster);
  console.log(posDict);

  useEffect(() => {
    if(dataFetchComplete){

      // update max depth info
      let newMaxDepthData = filteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
      setMaxDepthData(newMaxDepthData)
      
      const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0 ;
      const depthContainer = document.getElementsByClassName(`depth-container`)[0]?.getBoundingClientRect() || 0 ;
      
      const newPosDict = calculatePositions(filteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData)
      setPosDict(newPosDict)
      
      // console.log(calculateLines(newfilteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData,newPosDict))
      setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], depthContainer["width"], newMaxDepthData, newPosDict))
      
      const newLanguageList = filteredData[0].map(x => x.lang)
      setLanguageList([... new Set(newLanguageList)])
      
      setSelectedWord(filteredData[0][0])
      
    }
  }, [filteredData])

  useEffect(() => { setPopupOpen(isInsertMode) }, [isInsertMode]) // is insertion mode is activated, trigger popup
  useEffect(() => {
    if (mustDepthRecalculate > -1) {
      console.log("CALCULATING DEPTH");
      RecalculateDepthAfter(filteredData[0], mustDepthRecalculate, setFilteredData)
      setMustDepthRecalculate(-1)
    }
  }, [mustDepthRecalculate])


  return (
    
    
    <main className={`flex min-h-screen flex-col items-center place-content-start p-16 `}>
      {popupOpen &&
        <Popup word={selectedWord} popupRef={popupRef}
          setPopupOpen={setPopupOpen}
          setSelectedWord={setSelectedWord}
          allWords={filteredData[0]}
          setFilteredData={setFilteredData}
          unsavedWordCount={unsavedWordCount}
          setUnsavedWordCount={setUnsavedWordCount}
          isInsertMode={isInsertMode}
          setIsInsertMode={setIsInsertMode}
          setMustDepthRecalculate={setMustDepthRecalculate}
          hoveredPair={hoveredPair} ></Popup>}
      <Legend languages={languageList}></Legend>
      <SaveToServerButton unsavedWordCount={unsavedWordCount} setUnsavedWordCount={setUnsavedWordCount} cid={selectedCluster} filteredData={filteredData}></SaveToServerButton>


      <div className="z-10 mb-12 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">
        
      
      </div>


      <div className={`min-w-full flex self-start ${popupOpen && "blur-xs"}`} key={selectedCluster}>

        {
          filteredData.map((dataCluster, clusterIndex) =>
            <div className="  mb-32  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex + "_" + selectedCluster}>
              {
                Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((x, rowInd) =>
                  <div className={`depth-container flex relative min-h-24  w-full`} style={{ margin: depthMarginPx }} key={rowInd + "_" + selectedCluster}>{ // each depth here
                    dataCluster.filter(a => a.depth === x).map((x, i) =>
                      <WordCard x={x} key={rowInd + "_" + selectedCluster + "_" + i}
                        pos={posDict}
                        selectedCluster={selectedCluster}
                        setSelectedWord={setSelectedWord}
                        setPopupOpen={setPopupOpen}
                        hoveredPair={hoveredPair}></WordCard>)
                  }
                    {
                      lines[0][rowInd]?.map((line, lineIndex) =>
                        <DrawRelation key={rowInd + "-" + lineIndex}
                          x1={line[0]} x2={line[1]}
                          heightOffset={line[2]}
                          y={depthMarginPx}
                          pair={lines[1][rowInd][lineIndex]}
                          setHoveredPair={setHoveredPair}
                          setIsInsertMode={setIsInsertMode}></DrawRelation>
                      )
                    }
                  </div>)
              }



            </div>
          )
        }


      </div>
    </main>
    
  );
}
async function fetchData(cluster) {
  let newfilteredData
  try {
    const response = await fetch('/api/fetch-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ cid: parseInt(cluster) })
    });

    if (!response.ok) {
      const message = await response.text();
      console.log(message);
    } else {
      const responseResolved = await response;
      const data = await responseResolved.json();
      const message = data.message;

      newfilteredData = [data.responseData.clusterData[0].words]
      console.log(["HEY", newfilteredData]);

      // newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
    }

  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
  }
  // Pass data to the page via props
  return newfilteredData
}