"use client"
import Image from "next/image";
import * as data from '../public/0.json'
import { useEffect, useState, useRef } from "react";
import WordCard from "@/components/wordCard";
import SaveToServerButton from "@/components/saveToServerButton";
import { DrawRelation, langColors, RecalculateDepthAfter } from "@/functions/functions";
import Legend from "@/components/legend";
import Popup from "@/components/popup";
import { useRouter } from 'next/navigation';
//console.log(data[1]);

const depthMarginPx = 24
const marginClass = `m-[${depthMarginPx}px]`;


const calculateWidthBelowNode = (data, nodeList) => {

  if(nodeList.length ===0){
    return 1
  }
  else{

    let result = 0
    for(const node of nodeList){
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
    const widthBelowDict ={}
    for(const node in data){
      widthBelowDict[node] = calculateWidthBelowNode(data, [node])
    }
    console.log(widthBelowDict);
    return widthBelowDict
}
const calculatePositions = (data, wordWidth, depthWidth, totalDepth) => {
  
  
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
  let parentWidths = [ widthBelowDict[idnow]]

  // Part 3 Iterate over the children
  let safety = 0
  while (goToItems.length > 0) {
    safety = safety + 1
    if (safety > 50) { break }

    //console.log(goToItems);
    //console.log(data);
    let idsToProcess = goToItems[0]
    let parentPos = parentPositions[0]
    let parentWidth = parentWidths[0]
    let itemTogetherCount = idsToProcess.length
    let extraSpaceNeeded = 0
    for (var idNow = 0; idNow < itemTogetherCount; idNow++) {  // Treat the similar siblings together (e.g derived from same root)
      const widthForThisSibling = widthBelowDict[idsToProcess[idNow]] || 1

 
      returnDict[idsToProcess[idNow]] = parentPos + (   extraSpaceNeeded + ( widthForThisSibling - parentWidth)/2 + idNow) * wordWidth * 1.2  // assign their left values
      
      extraSpaceNeeded += (widthForThisSibling - 1)
      let nodeData = data.filter(x => x.id === idsToProcess[idNow])
      //console.log([idsToProcess[idNow], nodeData]);
      let derivesTo = nodeData[0]["rel"]["derives"]["to"] || []
      let loansTo = nodeData[0]["rel"]["loans"]["to"] || []
      let homonymTo = nodeData[0]["rel"]["homonym"]["to"] || []

      let newGoToItems = derivesTo.concat(loansTo, homonymTo)
      //console.log([idsToProcess[idNow], newGoToItems]);
      if (newGoToItems.length > 0) {

        goToItems.push(newGoToItems)
        parentPositions.push(returnDict[idsToProcess[idNow]])
        parentWidths.push(widthBelowDict[idsToProcess[idNow]])
      }

    }
    goToItems.shift()           // remove the first element
    parentPositions.shift()     // remove the first element
    parentWidths.shift()
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


export default function Home() {


  const router = useRouter();
  console.log(data["words"]);
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [filteredData, setFilteredData] = useState([data["words"]])//useState([data.filter((x) => x.cluster === 0)]);
  const [maxDepthData, setMaxDepthData] = useState([data["words"]].map(x => Math.max(...x.map(y => y.depth)))) //useState([data.filter((x) => x.cluster === 0)].map(x => Math.max(...x.map(y => y.depth))))
  const [posDict, setPosDict] = useState({})
  const [lines, setLines] = useState([[], []])
  const [languageList, setLanguageList] = useState([])
  const [unsavedWordCount, setUnsavedWordCount] = useState(0)
  const [hoveredPair, setHoveredPair] = useState([-1, -1])
  const [isInsertMode, setIsInsertMode] = useState(false)
  const [mustDepthRecalculate, setMustDepthRecalculate] = useState(-1)

  const popupRef = useRef();
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState(data["words"][0])

  const handleClusterFilter = async (e) => {
    const cluster = parseInt(e.target.value);
    
    let newfilteredData;

    try {
      const response = await fetch('/api/fetch-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({ cid: cluster })
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
        setFilteredData(newfilteredData);
        setSelectedCluster(cluster);
        setUnsavedWordCount(0)
        setPosDict({})
        let newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
        setMaxDepthData(newMaxDepthData)
      }

    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }




  };
  console.log(filteredData);
  console.log(maxDepthData);
  console.log(lines);
  console.log(languageList);
  console.log(selectedWord)
  console.log(selectedCluster);

  useEffect(() => {
    // update max depth info
    let newMaxDepthData = filteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
    setMaxDepthData(newMaxDepthData)

    const topWrapper = document.getElementsByClassName(`word-card-individual`)[0].getBoundingClientRect();
    const depthContainer = document.getElementsByClassName(`depth-container`)[0].getBoundingClientRect();

    const newPosDict = calculatePositions(filteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData)
    setPosDict(newPosDict)

    // console.log(calculateLines(newfilteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData,newPosDict))
    setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], depthContainer["width"], newMaxDepthData, newPosDict))

    const newLanguageList = filteredData[0].map(x => x.lang)
    setLanguageList([... new Set(newLanguageList)])

    setSelectedWord(filteredData[0][0])

  }, [filteredData])

  useEffect(() => { setPopupOpen(isInsertMode)}, [isInsertMode]) // is insertion mode is activated, trigger popup
  useEffect(() => {
      if(mustDepthRecalculate > -1){
        console.log("CALCULATING DEPTH");
        RecalculateDepthAfter(filteredData[0], mustDepthRecalculate, setFilteredData)
        setMustDepthRecalculate(-1)
      }
  }, [mustDepthRecalculate])


  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-24 `}>
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
          setMustDepthRecalculate = {setMustDepthRecalculate}
          hoveredPair={hoveredPair} ></Popup>}
      <Legend languages={languageList}></Legend>
      <SaveToServerButton unsavedWordCount={unsavedWordCount} setUnsavedWordCount={setUnsavedWordCount} cid={selectedCluster} filteredData={filteredData}></SaveToServerButton>


      <div className="z-10 mb-12 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">

          <code className="font-mono font-bold text-4xl">Etymallogy</code>
        </p>

        <select
          className="bg-gray-200 rounded-md p-2 max-w-md m-4 "
          onChange={handleClusterFilter}
        >

          {[0, 1].map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>


      <div className={`min-w-full flex self-start ${popupOpen && "blur-xs"}`} key={selectedCluster}>

        {
          filteredData.map((dataCluster, clusterIndex) =>
            <div className="  mb-32  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex+"_"+selectedCluster}>
              {
                Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((x, rowInd) =>
                  <div className={`depth-container flex relative min-h-24  w-full`} style={{ margin: depthMarginPx }} key={rowInd+"_"+selectedCluster}>{ // each depth here
                    dataCluster.filter(a => a.depth === x).map((x, i) =>
                      <WordCard x={x} key={rowInd+"_"+selectedCluster+"_"+ i}   
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
