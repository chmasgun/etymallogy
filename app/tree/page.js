"use client"
import Image from "next/image";
import { useEffect, useState, useRef, Suspense } from "react";
import WordCard from "@/components/wordCard";
import SaveToServerButton from "@/components/saveToServerButton";
import {
  DrawRelation, langColors, RecalculateDepthAfter, calculateWidthBelowNode, prepareWidthBelowNode, calculateLines, calculatePositions,
  findHighlightedWords, calculateHighlightPositions
} from "@/functions/functions";
import Legend from "@/components/legend";
import Popup from "@/components/popup";
import { ModeToggleDiv, HighlightToggleDiv } from "@/components/modeToggle";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
//console.log(data[1]);

const depthMarginPx = 16
const leftPixelLimit = 400
const marginClass = `m-[${depthMarginPx}px]`;

const isProd = process.env.NEXT_PUBLIC_IS_PROD === "1";
const isDev = process.env.NEXT_PUBLIC_IS_PROD === "0";



export default function Tree() {

  const router = useRouter();
  //const searchParams =  useSearchParams()

  let cluster = 0
  let initWord = null
  //if(typeof document !== 'undefined'){
  //let searchParams = new URLSearchParams(document.location.search);
  let searchParams = useSearchParams()
  console.log(searchParams);
  cluster = searchParams.get("cluster");
  initWord = searchParams.get("word")
  //}


  useEffect(() => {
    const initFetchData = async () => {
      try {
        
        console.log(cluster, initWord);
        // setPosDict({});
        const newfilteredData = await fetchData(parseInt(cluster));
        setFilteredData(newfilteredData);
        console.log(newfilteredData);
        const highlightWord = newfilteredData[0].findIndex(word => word.key + word.lang === initWord)

        console.log(highlightWord, newfilteredData[0]);
        if (highlightWord > -1) {
          findHighlightedWords(newfilteredData[0][highlightWord], newfilteredData[0], setHighlightedWords)
        }
        setSelectedCluster(cluster);
        setUnsavedWordCount(0);
        setWordToHighlight(highlightWord)
        setShouldFocusInitially(true)

        let newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth)));
        setMaxDepthData(newMaxDepthData);


        setDataFetchComplete(true)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    initFetchData();
  }, []);

  const [additionalRightMargin, setAdditionalRightMargin] = useState(0)
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
  const [shouldFocusInitially, setShouldFocusInitially] = useState(false)
  const [posDictReadyForInitialFocus, setPosDictReadyForInitialFocus] = useState(false)

  const popupRef = useRef();
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState("")
  const [wordToHighlight, setWordToHighlight] = useState(-1) // similar to mustDepthRecalculate
  const [highlightedWords, setHighlightedWords] = useState([])
  const [editModeToggle, setEditModeToggle] = useState(0)
  const [highlightToggleFlag, setHighlightToggleFlag] = useState(false)

  /*
  console.log(filteredData);
  console.log(maxDepthData);
  console.log(lines);
  console.log(languageList);
  console.log(selectedWord)
  console.log(selectedCluster);
  console.log(posDict);
  console.log(highlightedWords);
*/
  useEffect(() => {
    if (dataFetchComplete) {

      // update max depth info
      let newMaxDepthData = filteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
      setMaxDepthData(newMaxDepthData)

      const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0;
      const depthContainer = document.getElementsByClassName(`depth-container`)[0]?.getBoundingClientRect() || 0;

      console.log(filteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData);
      console.log(highlightToggleFlag, posDictReadyForInitialFocus);
      console.log(highlightToggleFlag || !posDictReadyForInitialFocus);
     
      if(highlightToggleFlag || !posDictReadyForInitialFocus){ // run here either at the start, or when all data will be highlighted

        const [newPosDict, maxLeftValue] = calculatePositions(filteredData[0], topWrapper["width"], newMaxDepthData, leftPixelLimit)
        setPosDict(newPosDict)
        setPosDictReadyForInitialFocus(true)
        setAdditionalRightMargin(maxLeftValue)
        
        // console.log(calculateLines(newfilteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData,newPosDict))
        setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], newMaxDepthData, newPosDict))
        
        console.log("SETTING LINES", newPosDict, posDict);
        if(highlightToggleFlag){

          showAllTree()
        }
      }
      const newLanguageList = filteredData[0].map(x => x.lang)
      setLanguageList([... new Set(newLanguageList)])

      setSelectedWord(filteredData[0][0])








    }
  }, [filteredData])

  useEffect(() => {
    if (shouldFocusInitially && posDictReadyForInitialFocus && Object.keys(posDict).length > 0) {

      console.log("EFFECT", shouldFocusInitially, posDict);
      const divToFocus = document.querySelectorAll(".word-card-" + wordToHighlight)[0];
      const mainDiv = document.querySelector(".the-container")
      const bodyDiv = document.body.getBoundingClientRect()
      //divToFocus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      //console.log("FOCUSING", divToFocus.getBoundingClientRect());
      //console.log("FOCUSING", mainDiv.getBoundingClientRect());
      console.log("FOCUSING", divToFocus.getBoundingClientRect());
      console.log("FOCUSING BODY", bodyDiv);
      console.log(posDict, wordToHighlight, posDict[wordToHighlight] - bodyDiv.width / 2, divToFocus?.getBoundingClientRect());

      const newLeftValue = posDict[wordToHighlight] - bodyDiv.width / 2 + divToFocus?.getBoundingClientRect().width || 0

      //setTimeout(() => {
      //divToFocus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log(divToFocus.getBoundingClientRect(), divToFocus.getBoundingClientRect().top);
      mainDiv.scrollLeft = newLeftValue
      window.scrollTo(newLeftValue, divToFocus.getBoundingClientRect().top - window.innerHeight / 2)
      console.log("SET SCROLL after wait VAL", [mainDiv.scrollLeft, divToFocus.getBoundingClientRect().top]);

      setShouldFocusInitially(false)
      //}, 50)
    }
  }, [shouldFocusInitially, posDictReadyForInitialFocus])

  useEffect(() => { setPopupOpen(isInsertMode) }, [isInsertMode]) // is insertion mode is activated, trigger popup
  useEffect(() => { if (!popupOpen) { setHoveredPair([-1, -1]) } }, [popupOpen]) // when closing the popup, reset hovered pair
  useEffect(() => {
    if (mustDepthRecalculate > -1) {
      console.log("CALCULATING DEPTH");
      RecalculateDepthAfter(filteredData[0], mustDepthRecalculate, setFilteredData)
      setMustDepthRecalculate(-1)
    }
  }, [mustDepthRecalculate])

  
  useEffect(() => {
    console.log("INSIDE WORDTOHIGHLIGHT", wordToHighlight, posDictReadyForInitialFocus);
    if (wordToHighlight > -1) {
      const newHiglightedWords = findHighlightedWords(filteredData[0][wordToHighlight], filteredData[0], setHighlightedWords)
      setHighlightToggleFlag(false)
      console.log("CALCULATING HIGHLIGHT", wordToHighlight, posDictReadyForInitialFocus,newHiglightedWords);
      if (posDictReadyForInitialFocus) {

        const newPosDict = calculateHighlightPositions(posDict, setPosDict, newHiglightedWords)
        const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0;
        console.log(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], maxDepthData, newPosDict));
        setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], maxDepthData, newPosDict))
      }
    }else{
      // refresh the tree
      if (posDictReadyForInitialFocus) {
        console.log("SET FILTERED DATA HERE");
        setFilteredData([...filteredData])
      }
    }
  }, [wordToHighlight,posDictReadyForInitialFocus])
 
  console.log(lines);

  function showAllTree() {
    console.log("SHOWING TREE", filteredData[0].length);
    setHighlightToggleFlag(true);
    setHighlightedWords(filteredData[0].map((x, i) => i));
    setWordToHighlight(-1)
  }

  return (
    <Suspense>



      <main className={`the-container flex min-h-screen flex-col items-center place-content-start p-16 overflow-auto dark:bg-gray-900 `} >
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

        <div className="fixed z-50 max-w-[98vw] right-0 top-0 flex flex-row justify-center">
          <div className="flex flex-col items-center">
            <HighlightToggleDiv
              highlightToggleFlag={highlightToggleFlag} //toggle is unclickable in "All". User must click on a word to switch to focus mode
              highlightToggleHandler={() => {
                !highlightToggleFlag && showAllTree()
                 
              }}></HighlightToggleDiv>
            {isDev && <>
              <ModeToggleDiv editModeToggle={editModeToggle} setEditModeToggle={setEditModeToggle} showAllTree={showAllTree} ></ModeToggleDiv>
              <SaveToServerButton unsavedWordCount={unsavedWordCount} setUnsavedWordCount={setUnsavedWordCount} cid={selectedCluster} filteredData={filteredData}></SaveToServerButton>
            </>
            }

          </div>
          <Legend languages={languageList}></Legend>
        </div>



        <div className="z-10 mb-40 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">


        </div>


        <div className={`outer-container min-w-full flex self-start ${popupOpen && "blur-xs"}`}
          style={{ minWidth: additionalRightMargin + 600 }}
          key={selectedCluster}>

          {
            filteredData.map((dataCluster, clusterIndex) =>
              <div className=" tree-container mb-[2000px]  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex + "_" + selectedCluster}>
                {
                  Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((x, rowInd) =>
                      dataCluster.filter(a => a.depth === x).map((x, i) =>
                        <WordCard x={x} key={rowInd + "_" + selectedCluster + "_" + i}
                          pos={posDict}
                          selectedCluster={selectedCluster}
                          setSelectedWord={setSelectedWord}
                          setPopupOpen={setPopupOpen}
                          hoveredPair={hoveredPair}
                          highlightedWords={highlightedWords}
                          editModeToggle={editModeToggle}
                          setWordToHighlight={setWordToHighlight}
                          isProd={isProd} ></WordCard>)
                    }
                      {
                        lines[0][rowInd]?.map((line, lineIndex) =>
                          <DrawRelation key={rowInd + "-" + lineIndex}
                            x1={line[0]} x2={line[1]}
                            heightOffset={line[2]}
                            y={depthMarginPx}
                            pair={lines[1][rowInd][lineIndex]}
                            setHoveredPair={setHoveredPair}
                            isInsertMode={isInsertMode}
                            setIsInsertMode={setIsInsertMode}
                            highlightedWords={highlightedWords}></DrawRelation>
                        )
                      }
                    </div>)
                }



              </div>
            )
          }


        </div>
      </main>
    </Suspense>
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