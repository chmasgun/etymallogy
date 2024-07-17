"use client"
import Image from "next/image";
import * as data from '../public/0.json'
import { useEffect, useState, useRef } from "react";
import WordCard from "@/components/wordCard";
import { DrawRelation ,langColors } from "@/functions/functions";
import Legend from "@/components/legend";
import Popup from "@/components/popup";
import { useRouter } from 'next/navigation';
//console.log(data[1]);

const depthMarginPx = 24
const marginClass = `m-[${depthMarginPx}px]`;


const calculatePositions = (data, wordWidth, depthWidth, totalDepth) => {

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


  //for (var depthNow = 1; depthNow <= totalDepth ; depthNow++){
  //  root = data.filter(x => x.depth === depthNow)
  //  depthItems = root.length
  //}
  let safety = 0
  while (goToItems.length > 0) {
    safety = safety + 1
    if (safety > 50) { break }

    //console.log(goToItems);
    //console.log(data);
    let idsToProcess = goToItems[0]
    let parentPos = parentPositions[0]
    let itemTogetherCount = idsToProcess.length
    for (var idNow = 0; idNow < itemTogetherCount; idNow++) {  // Treat the similar siblings together (e.g derived from same root)
      returnDict[idsToProcess[idNow]] = parentPos + (idNow - (itemTogetherCount / 2) + 0.5) * wordWidth * 1.5   // assign their left values
      let nodeData = data.filter(x => x.id === idsToProcess[idNow])
      console.log([idsToProcess[idNow], nodeData]);
      let derivesTo = nodeData[0]["rel"]["derives"]["to"] || []
      let loansTo = nodeData[0]["rel"]["loans"]["to"] || []
      let homonymTo = nodeData[0]["rel"]["homonym"]["to"] || []

      let newGoToItems = derivesTo.concat(loansTo, homonymTo)
      //console.log([idsToProcess[idNow], newGoToItems]);
      if (newGoToItems.length > 0) {

        goToItems.push(newGoToItems)
        parentPositions.push(returnDict[idsToProcess[idNow]])
      }

    }
    goToItems.shift()           // remove the first element
    parentPositions.shift()     // remove the first element
    //console.log(goToItems);
    //console.log(parentPositions);

  }
  return returnDict
}

// TO DO for each depth, go over all nodes, extract from-to relations, and calculate xs and ys
const calculateLines = (data, wordWidth,wordHeight, depthWidth, totalDepth, positionDict) => {
  let outLinesList = []
  for (var depthNow = 0; depthNow <= totalDepth; depthNow++) {  // iterating each depth
    let root = data.filter(x => x.depth === depthNow)
    let linesForDepth = []
    for(var elt of root){ // iterating each element/word
      let derivesTo = elt["rel"]["derives"]["to"] || []
      let loansTo = elt["rel"]["loans"]["to"] || []
      let homonymTo = elt["rel"]["homonym"]["to"] || []
      let newGoToItems = derivesTo.concat(loansTo, homonymTo)

      for(var rel of newGoToItems){ // iterating every relation to gather lines
        linesForDepth.push([positionDict[elt["id"]] + wordWidth / 2, positionDict[rel] + wordWidth / 2 , wordHeight])
      }
      
      console.log(newGoToItems);
    }
    outLinesList.push(linesForDepth)
  }
  return outLinesList
}


export default function Home() {


  const router = useRouter();
  console.log(data["words"]);
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [filteredData, setFilteredData] = useState([data["words"]])//useState([data.filter((x) => x.cluster === 0)]);
  const [maxDepthData, setMaxDepthData] =  useState([data["words"]].map(x => Math.max(...x.map(y => y.depth)))) //useState([data.filter((x) => x.cluster === 0)].map(x => Math.max(...x.map(y => y.depth))))
  const [posDict, setPosDict] = useState({})
  const [lines, setLines] = useState([])
  const [languageList, setLanguageList] = useState([])

  const popupRef = useRef();
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState(data["words"][0])

  const handleClusterFilter = async (e) => {
    const cluster = parseInt(e.target.value);
    setSelectedCluster(cluster);
    let newfilteredData;
    let newMaxDepthData;

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
      }else{
        const responseResolved = await response;
        const data = await responseResolved.json();
        const message = data.message;

        newfilteredData = [data.responseData.clusterData[0].words]
        console.log(["HEY"  ,newfilteredData]);

        // newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
        newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
        setFilteredData(newfilteredData);
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
  
  useEffect( () => {



    const topWrapper = document.getElementsByClassName(`word-card-individual`)[0].getBoundingClientRect();
    const depthContainer = document.getElementsByClassName(`depth-container`)[0].getBoundingClientRect();
    
    const newPosDict = calculatePositions(filteredData[0], topWrapper["width"], depthContainer["width"], maxDepthData)
    setPosDict(newPosDict)
    
    // console.log(calculateLines(newfilteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData,newPosDict))
    setLines(calculateLines(filteredData[0], topWrapper["width"],topWrapper["height"], depthContainer["width"], maxDepthData, newPosDict))

    const newLanguageList = filteredData[0].map(x => x.lang)
    setLanguageList([... new Set(newLanguageList)])
  },[filteredData])
  




  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-24 `}>
      { popupOpen && 
          <Popup word={selectedWord} popupRef={popupRef} 
              setPopupOpen={setPopupOpen} 
              setSelectedWord= {setSelectedWord}
              allWords={filteredData[0]}></Popup>}
      <Legend languages= {languageList}></Legend>
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


      <div className={`min-w-full flex self-start ${popupOpen && "blur-xs"}`}>

        {
          filteredData.map((dataCluster, clusterIndex) =>
            <div className="  mb-32  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex}>
              {
                Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((x, rowInd) =>
                  <div className={`depth-container flex relative min-h-24  w-full`} style={{margin: depthMarginPx}} key={rowInd}>{ // each depth here
                    dataCluster.filter(a => a.depth === x).map((x, i) => <WordCard x={x} key={i} pos={posDict} setSelectedWord={setSelectedWord} setPopupOpen={setPopupOpen}></WordCard>)
                  }
                  {
                    lines[rowInd]?.map( (line,lineIndex) =>
                      <DrawRelation key={rowInd+"-"+lineIndex} x1={line[0]} x2={line[1]} heightOffset={line[2]} y={depthMarginPx}></DrawRelation>
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
