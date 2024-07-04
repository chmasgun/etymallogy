"use client"
import Image from "next/image";
import * as data from '../public/data.json'
import { useState } from "react";
import WordCard from "@/components/wordCard";

//console.log(data[1]);


const calculatePositions = (data, wordWidth, depthWidth, totalDepth) => {

  let returnDict = {}
  let root = data.filter(x => x.depth === 0)
  let depthItems = root.length
  console.log(["SELECTED ", data]);
  //console.log(root[0]["rel"]["derives"]["to"])
  let idnow = root[0]["id"]
  returnDict[idnow] = depthWidth / 2 - wordWidth / 2
  let derivesTo = root[0]["rel"]["derives"]["to"] || []
  let loansTo = root[0]["rel"]["loans"]["to"] || []
  let homonymTo = root[0]["rel"]["homonym"]["to"] || []

  let goToItems =  [derivesTo.concat(loansTo, homonymTo)]
  let parentPositions = [depthWidth / 2 - wordWidth / 2]


  //for (var depthNow = 1; depthNow <= totalDepth ; depthNow++){
  //  root = data.filter(x => x.depth === depthNow)
  //  depthItems = root.length
  //}
  let safety = 0
  while(goToItems.length > 0){
    safety = safety +  1
    if(safety>50){break}

    console.log(goToItems);
    console.log(data);
    let idsToProcess = goToItems[0]
    let parentPos = parentPositions[0]
    let itemTogetherCount = idsToProcess.length
    for(var idNow= 0; idNow < itemTogetherCount; idNow++){  // Treat the similar siblings together (e.g derived from same root)
      returnDict[idsToProcess[idNow]] = parentPos + (idNow - (itemTogetherCount/2) + 0.5) * wordWidth * 1.5   // assign their left values
      let nodeData = data.filter(x => x.id === idsToProcess[idNow])
      console.log([idsToProcess[idNow],nodeData]);
      let derivesTo = nodeData[0]["rel"]["derives"]["to"] || []
      let loansTo = nodeData[0]["rel"]["loans"]["to"] || []
      let homonymTo = nodeData[0]["rel"]["homonym"]["to"] || []
    
      let newGoToItems =  derivesTo.concat(loansTo, homonymTo)
      console.log([idsToProcess[idNow], newGoToItems]);
      if(newGoToItems.length> 0){ 

        goToItems.push(newGoToItems)
        parentPositions.push(returnDict[idsToProcess[idNow]])
      }

    }
    goToItems.shift()           // remove the first element
    parentPositions.shift()     // remove the first element
    console.log(goToItems);
    console.log(parentPositions);

    }
  return returnDict
}



export default function Home() {

  const [selectedCluster, setSelectedCluster] = useState(0);
  const [filteredData, setFilteredData] = useState([data.filter((x) => x.cluster === 0)]);
  const [maxDepthData, setMaxDepthData] = useState([data.filter((x) => x.cluster === 0)].map(x => Math.max(...x.map(y => y.depth))))
  const [posDict, setPosDict] = useState({})
  


  const handleClusterFilter = (e) => {
    const cluster = parseInt(e.target.value);
    setSelectedCluster(cluster);

    const newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
    const newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth)))
    setFilteredData(newfilteredData);
    setMaxDepthData(newMaxDepthData)

    const topWrapper = document.getElementsByClassName(`word-card-individual`)[0].getBoundingClientRect();
    const depthContainer = document.getElementsByClassName(`depth-container`)[0].getBoundingClientRect();
    console.log(topWrapper);
    console.log(depthContainer);
    console.log(calculatePositions(newfilteredData[0], topWrapper["width"], depthContainer["width"],newMaxDepthData))
    setPosDict(calculatePositions(newfilteredData[0], topWrapper["width"], depthContainer["width"],newMaxDepthData))
  };
  console.log(filteredData);
  console.log(maxDepthData);
  //const dataVisual = data.filter(x => x.cluster === cluster)
  /*const dataVisualDict = filteredData.reduce((acc, cur) => {
    acc[cur.cluster] = acc[cur.cluster] || [];
    acc[cur.cluster].push(cur);
    return acc;
  }, {})
  const dataVisual = Object.values(dataVisualDict)

  console.log(dataVisual);
  console.log(dataVisualDict);
  */

  return (
    <main className="flex min-h-screen flex-col items-center place-content-start p-24">
      <div className="z-10 mb-12 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">

          <code className="font-mono font-bold text-4xl">Etymallogy</code>
        </p>

        <select
          className="bg-gray-200 rounded-md p-2 max-w-md"
          onChange={handleClusterFilter}
        >

          {[0, 3].map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>


      <div className="min-w-full flex self-start">

        {
          filteredData.map((dataCluster, clusterIndex) =>
            <div className="  mb-32  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex}>
              {
                Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((x, rowInd) =>
                  <div className="depth-container flex relative min-h-24 m-6 w-full" key={rowInd}>{ // each depth here
                    dataCluster.filter(a => a.depth === x).map((x, i) => <WordCard x={x} key={i} pos={posDict}></WordCard>)
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
