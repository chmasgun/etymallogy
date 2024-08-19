"use client"
import Image from "next/image";
import { useEffect, useState, useRef, Suspense } from "react";
import WordCard from "@/components/wordCard";
import SaveToServerButton from "@/components/saveToServerButton";
import {
  DrawRelation, langColors, RecalculateDepthAfter, calculateWidthBelowNode, prepareWidthBelowNode, calculateLines, calculatePositions,
  findHighlightedWords, calculateHighlightPositions, calculateAllChildrenRecursively, relationsAll, prepareInheritanceTextShort,
  findDescendantWords
} from "@/functions/functions";
import Legend from "@/components/legend";
import { Popup, TransferNodePopup } from "@/components/popup";
import { ModeToggleDiv, HighlightToggleDiv } from "@/components/modeToggle";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SearchBar from "@/components/SearchBar";
//console.log(data[1]);

const depthMarginPx = 16
const leftPixelLimit = 400
const marginClass = `m-[${depthMarginPx}px]`;

const isProd = process.env.NEXT_PUBLIC_IS_PROD === "1";
const isDev = process.env.NEXT_PUBLIC_IS_PROD === "0";


export default function Tree() {

  const router = useRouter();
  //const searchParams =  useSearchParams()

  let cluster = -1
  let initWord = null
  //if(typeof document !== 'undefined'){
  //let searchParams = new URLSearchParams(document.location.search);
  let searchParams = useSearchParams()
  // console.log(searchParams);
  cluster = searchParams.get("cluster");
  initWord = searchParams.get("word")
  //}


  useEffect(() => {
    const initFetchData = async () => {
      try {

        //console.log(cluster, initWord);
        // setPosDict({});
        const newfilteredData = await fetchData(parseInt(cluster));
        setFilteredData(newfilteredData);
        //console.log(newfilteredData);
        const highlightWord = newfilteredData[0].findIndex(word => word.key + word.lang === initWord)

        //console.log(highlightWord, newfilteredData[0]);
        if (highlightWord > -1) {
          findHighlightedWords(newfilteredData[0][highlightWord], newfilteredData[0], setHighlightedWords)
        }
        setSelectedCluster(cluster);
        setUnsavedWordCount(0);
        setWordToHighlight(highlightWord)


        let newMaxDepthData = newfilteredData.map(x => Math.max(...x.map(y => y.depth)));
        setMaxDepthData(newMaxDepthData);


        setDataFetchComplete(true)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    setDataFetchComplete(false)
    setPosDictReadyForInitialFocus(false)
    setShouldFocusInitially(false)
    setLines([[], []])
    setPosDict({})
    setSearchBarSmallMode(true)
    initFetchData();
  }, [cluster, initWord]);

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
  const searchBarRef = useRef()
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState("")
  const [wordToHighlight, setWordToHighlight] = useState(-1) // similar to mustDepthRecalculate
  const [highlightedWords, setHighlightedWords] = useState([])
  const [editModeToggle, setEditModeToggle] = useState(0)
  const [highlightToggleFlag, setHighlightToggleFlag] = useState(false)

  // transfer variables
  const [transferEnabled, setTransferEnabled] = useState(false)
  const [childrenNodes, setChildrenNodes] = useState([])
  const [transferNodeUnder, setTransferNodeUnder] = useState(null)
  const [transferRelation, setTransferRelation] = useState(1)
  // Search bar states
  const [searchBarSmallMode, setSearchBarSmallMode] = useState(true)
  const [searchMustReset, setSearchMustReset] = useState(false)

  // after selecting the word
  const [afterClickSmallPopupOn, setAfterClickSmallPopupOn] = useState(false)
  const [inheritanceTextShort, setInheritanceTextShort] = useState([])
  const [shouldFindDescendants, setShouldFindDescendants] = useState(false)
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
  function putHighlightFirstFunction(word) {
    return highlightedWords.includes(word.id) ? 1 : -1
  }

  useEffect(() => {
    if (dataFetchComplete) {

      // update max depth info
      let newMaxDepthData = filteredData.map(x => Math.max(...x.map(y => y.depth))) // again multiple clusters
      setMaxDepthData(newMaxDepthData)

      const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0;
      const depthContainer = document.getElementsByClassName(`depth-container`)[0]?.getBoundingClientRect() || 0;

      //console.log(filteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData);
      //console.log(highlightToggleFlag, posDictReadyForInitialFocus);
      //console.log(highlightToggleFlag || !posDictReadyForInitialFocus);

      if (highlightToggleFlag || !posDictReadyForInitialFocus) { // run here either at the start, or when all data will be highlighted

        const [newPosDict, maxLeftValue] = calculatePositions(filteredData[0], topWrapper["width"], newMaxDepthData, leftPixelLimit)
        setPosDict(newPosDict)
        setPosDictReadyForInitialFocus(true)
        setAdditionalRightMargin(maxLeftValue)

        // console.log(calculateLines(newfilteredData[0], topWrapper["width"], depthContainer["width"], newMaxDepthData,newPosDict))
        setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], newMaxDepthData, newPosDict))

        console.log("SETTING LINES", newPosDict, posDict);

        const newLanguageList = filteredData[0].map(x => x.lang)
        setLanguageList([... new Set(newLanguageList)])


        //console.log(selectedWord);
        //console.log(selectedWord, calculateAllChildrenRecursively(filteredData[0], [3]));


        if (highlightToggleFlag) {

          showAllTree()
        }
      }

    }
  }, [filteredData])




  useEffect(() => {
    if (shouldFocusInitially && posDictReadyForInitialFocus && Object.keys(posDict).length > 0) {

      // FOCUS PART
      const divToFocus = document.querySelectorAll(".word-card-" + wordToHighlight)[0];
      const mainDiv = document.querySelector(".the-container")
      const bodyDiv = document.body.getBoundingClientRect()

      const newLeftValue = posDict[wordToHighlight] - bodyDiv.width / 2 + divToFocus?.getBoundingClientRect().width || 0

      //FOR MOBILE
      mainDiv.scrollLeft = newLeftValue + bodyDiv.width / 2 - divToFocus?.getBoundingClientRect().width / 2 || 0
      divToFocus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // LEFT IS FOR WEB. TOP IS FOR MOBILE+WEB
      window.scrollTo({ left: newLeftValue + bodyDiv.width * 0.3, top: divToFocus.getBoundingClientRect().top - bodyDiv.top - window.innerHeight * 0.6, behavior: 'smooth' })
 
      setShouldFocusInitially(false)

    }
  }, [shouldFocusInitially, posDictReadyForInitialFocus])

  useEffect(() => { console.log("YES", isInsertMode); setPopupOpen(isInsertMode) }, [isInsertMode]) // is insertion mode is activated, trigger popup
  useEffect(() => { if (!popupOpen) { setHoveredPair([-1, -1]) } }, [popupOpen]) // when closing the popup, reset hovered pair
  useEffect(() => {
    if (mustDepthRecalculate > -1) {
      console.log("CALCULATING DEPTH");
      RecalculateDepthAfter(filteredData[0], mustDepthRecalculate, setFilteredData)
      setMustDepthRecalculate(-1)
    }
  }, [mustDepthRecalculate])

  useEffect(() => {
    if (transferEnabled) {
      setChildrenNodes(calculateAllChildrenRecursively(filteredData[0], [selectedWord["id"]]))
    } else {
      setChildrenNodes([])
      setTransferNodeUnder(null)
    }
  }, [transferEnabled])

  useEffect(() => {

    if (wordToHighlight > -1) {
      const newHiglightedWords = findHighlightedWords(filteredData[0][wordToHighlight], filteredData[0], setHighlightedWords)
      setHighlightToggleFlag(false)
      //console.log("CALCULATING HIGHLIGHT", wordToHighlight, posDictReadyForInitialFocus, newHiglightedWords);
      if (posDictReadyForInitialFocus) {

        const newPosDict = calculateHighlightPositions(posDict, setPosDict, newHiglightedWords)
        const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0;
        //console.log(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], maxDepthData, newPosDict));
        setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], maxDepthData, newPosDict))
        setShouldFocusInitially(true)
        const newLanguageList = filteredData[0].filter(word => newHiglightedWords.includes(word.id)).map(x => x.lang)
        setLanguageList([... new Set(newLanguageList)])
        setAfterClickSmallPopupOn(true)
        setInheritanceTextShort(prepareInheritanceTextShort(wordToHighlight, filteredData[0]))
      }
    } else {
      // refresh the tree
      if (posDictReadyForInitialFocus) {
        //console.log("SET FILTERED DATA HERE");
        setFilteredData([...filteredData])
        const newLanguageList = filteredData[0].map(x => x.lang)
        setLanguageList([... new Set(newLanguageList)])

      }
    }
  }, [wordToHighlight, posDictReadyForInitialFocus])

  useEffect(() => {
    if (shouldFindDescendants) {
      // Descendants calculation, positions are recalculated. Similar to showAllTree. Logic is from filteredData useEffect because when wordToHighlight is set to 1, filteredData is modified
      const newHiglightedWords = findDescendantWords(filteredData[0][wordToHighlight], filteredData[0], setHighlightedWords)
       
      setShouldFindDescendants(false)

      const topWrapper = document.getElementsByClassName(`word-card-individual`)[0]?.getBoundingClientRect() || 0;
      const depthContainer = document.getElementsByClassName(`depth-container`)[0]?.getBoundingClientRect() || 0;

      const [newPosDict, maxLeftValue] = calculatePositions(filteredData[0], topWrapper["width"], maxDepthData, leftPixelLimit)
      setPosDict(newPosDict)
      setPosDictReadyForInitialFocus(true)
      setAdditionalRightMargin(maxLeftValue)

      setLines(calculateLines(filteredData[0], topWrapper["width"], topWrapper["height"], maxDepthData, newPosDict))

      console.log("SETTING LINES", newPosDict, posDict);

      const newLanguageList = filteredData[0].filter(x=> newHiglightedWords.includes(x.id)).map(x => x.lang)
      setLanguageList([... new Set(newLanguageList)])

       // FOCUS PART
       const divToFocus = document.querySelectorAll(".word-card-" + wordToHighlight)[0];
       const mainDiv = document.querySelector(".the-container")
       const bodyDiv = document.body.getBoundingClientRect()
 
       const newLeftValue = posDict[wordToHighlight] - bodyDiv.width / 2 
 
       //FOR MOBILE
       mainDiv.scrollLeft = newLeftValue + bodyDiv.width / 2 - divToFocus?.getBoundingClientRect().width / 2 || 0
       divToFocus?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       // LEFT IS FOR WEB. TOP IS FOR MOBILE+WEB
       window.scrollTo({ left: newLeftValue + bodyDiv.width * 0.0, top: divToFocus.getBoundingClientRect().top - bodyDiv.top - window.innerHeight * 0.3, behavior: 'smooth' })
        console.log(newLeftValue + bodyDiv.width * 0.7,divToFocus.getBoundingClientRect().top - bodyDiv.top - window.innerHeight * 0.3 );
    }
  }, [shouldFindDescendants])

  console.log("word to highlight", wordToHighlight);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchBarSmallMode(true)
        setSearchMustReset(true)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);

  function showAllTree() {
    //console.log("SHOWING TREE", filteredData[0].length);

    setHighlightToggleFlag(true);
    setHighlightedWords(filteredData[0].map((x, i) => i));
    setWordToHighlight(-1)
    setChildrenNodes([])
    setTransferNodeUnder(null)
    setTransferEnabled(false)
    //setSelectedWord("")
  }


  function transferExecute() {

    const relationStr = relationsAll[transferRelation]
    const childNodeId = selectedWord["id"]
    const parentNodeId = transferNodeUnder["id"]
    let oldParentNodesId = []
    for (const rel of relationsAll) {
      const tempFrom = filteredData[0][childNodeId]["rel"][rel]["from"] || []
      oldParentNodesId.push(...tempFrom)

    }

    const newFilteredData = [...filteredData[0]]

    // Step 3 - Remove previous parent's proper TO value
    for (const oldParentNow of oldParentNodesId) {
      for (const rel of relationsAll) { // search for all relations to locate the relation

        let indToRemove = newFilteredData[oldParentNow]["rel"][rel]["to"]?.indexOf(childNodeId)
        if (indToRemove > -1) {
          newFilteredData[oldParentNow]["rel"][rel]["to"].splice(indToRemove, 1)
        }

      }
    }
    // Step 1 - Assign new parent's TO value
    const existingRelationParent = newFilteredData[parentNodeId]["rel"][relationStr]["to"]
    const isRelationDefinedBeforeParent = (existingRelationParent || []).length > 0
    if (isRelationDefinedBeforeParent) {
      newFilteredData[parentNodeId]["rel"][relationStr]["to"].push(childNodeId)
    } else {
      newFilteredData[parentNodeId]["rel"][relationStr]["to"] = [childNodeId]
    }
    // Step 2 - Assign child's new FROM value
    //// step 2.1 Reset child's all FROM values
    for (const rel of relationsAll) {
      delete newFilteredData[childNodeId]["rel"][rel]["from"]
    }
    //// step 2.2 Set child's proper FROM value
    newFilteredData[childNodeId]["rel"][relationStr]["from"] = [parentNodeId]



    setFilteredData([newFilteredData])
    setUnsavedWordCount(unsavedWordCount + 1)
    setMustDepthRecalculate(parentNodeId)
    console.log(parentNodeId, childNodeId, oldParentNodesId);
  }


  return (
    <Suspense>



      <main className={`the-container flex min-h-screen flex-col items-center place-content-start p-16 lg:overflow-visible overflow-auto scroll-smooth `} > {/**dark:bg-gray-900 */}
        {transferEnabled &&
          <TransferNodePopup
            selectedWord={selectedWord}
            transferNodeUnder={transferNodeUnder}
            setTransferEnabled={setTransferEnabled}
            transferExecute={transferExecute}
            transferRelation={transferRelation}
            setTransferRelation={setTransferRelation}
            childrenNodes={childrenNodes}
          ></TransferNodePopup>}
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
            hoveredPair={hoveredPair}
            transferEnabled={transferEnabled}
            setTransferEnabled={setTransferEnabled} ></Popup>}

        <div className="fixed z-50 max-w-[98vw] right-0 top-0 flex flex-row justify-end lg:w-auto w-full pointer-events-none">
          <div className="flex flex-1 flex-col items-end">
            {/* SEARCH BAR OUTER CONTAINER */}
            <div className={`${searchBarSmallMode ? "w-[0%]" : "w-[100%] lg:w-[200%]"} relative min-w-16 max-w-[32rem] transition-all flex m-2 mr-0 lg:m-2`} ref={searchBarRef}>
              {/*<div className="left-0 z-10 w-8 h-8 bg-gray-400 self-center rounded-l-xl"></div>*/}
              <SearchBar key={cluster + "_" + initWord} smallMode={searchBarSmallMode}
                setSmallMode={setSearchBarSmallMode}
                searchMustReset={searchMustReset} setSearchMustReset={setSearchMustReset}></SearchBar>
            </div>
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
          <Legend languages={languageList} isHiddenOnMobile={!searchBarSmallMode}></Legend>
        </div>



        {/* <div className="z-10 mb-60 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">


        </div> */}


        <div className={`outer-container min-w-full flex self-start mt-60 ${(popupOpen && !transferEnabled) && "blur-xs"}`}
          style={{ minWidth: additionalRightMargin + 600 }}
          key={selectedCluster}>

          {
            filteredData.map((dataCluster, clusterIndex) =>
              <div className=" tree-container mb-80  flex flex-col flex-auto text-center  justify-center lg:text-left items-center" key={clusterIndex + "_" + selectedCluster}>
                {
                  Array.from(Array(maxDepthData[clusterIndex] + 1).keys()).map((d, rowInd) =>
                    <div className={`depth-container flex relative min-h-16 lg:min-h-20  w-full`} style={{ margin: depthMarginPx }} key={rowInd + "_" + selectedCluster}>{ // each depth here
                      // sorting the array so that the highlighted words are rendered the last, to avoid blurring
                      dataCluster.filter(a => a.depth === d).sort(putHighlightFirstFunction).map((x, i) =>
                        <WordCard x={x} key={rowInd + "_" + selectedCluster + "_" + i}
                          pos={posDict}
                          selectedCluster={selectedCluster}
                          setSelectedWord={setSelectedWord}
                          setPopupOpen={setPopupOpen}
                          hoveredPair={hoveredPair}
                          highlightedWords={highlightedWords}
                          editModeToggle={editModeToggle}
                          wordToHighlight={wordToHighlight}
                          setWordToHighlight={setWordToHighlight}
                          isProd={isProd}
                          transferEnabled={transferEnabled}
                          childrenNodesOfTransfer={childrenNodes}
                          setTransferNodeUnder={setTransferNodeUnder}
                          afterClickSmallPopupOn={afterClickSmallPopupOn}
                          setAfterClickSmallPopupOn={setAfterClickSmallPopupOn}
                          inheritanceTextShort={inheritanceTextShort}
                          setShouldFindDescendants={setShouldFindDescendants}
                        ></WordCard>)
                    }
                      {
                        lines[0][rowInd]?.map((line, lineIndex) =>
                          <DrawRelation key={rowInd + "-" + lineIndex + "-" + line[0] + "-" + line[1]}
                            x1={line[0] || -1000} x2={line[1] || -1000}
                            heightOffset={line[2]}
                            y={depthMarginPx}
                            pair={lines[1][rowInd][lineIndex]}
                            setHoveredPair={editModeToggle ? setHoveredPair : (() => { })}
                            isInsertMode={isInsertMode}
                            setIsInsertMode={editModeToggle ? setIsInsertMode : (() => { })} // only if edit mode is enabled
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