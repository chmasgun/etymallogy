"use client"

import { useEffect, useState, useRef, Suspense } from "react";

import SaveToServerButton from "@/components/saveToServerButton";
import {
  reqFields, langColors, checkWordReady
} from "@/functions/functions";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FetchSearchWords } from "@/functions/functions";
//console.log(data[1]);

import CreateWordDiv from "@/components/createWordDiv";


const isProd = process.env.NEXT_PUBLIC_IS_PROD === "1";
const isDev = process.env.NEXT_PUBLIC_IS_PROD === "0";



export default function NewTree() {

  const router = useRouter();






  //const [selectedCluster, setSelectedCluster] = useState(cluster);
  const [filteredData, setFilteredData] = useState([])//useState([data.filter((x) => x.cluster === 0)]);
  const [maxDepthData, setMaxDepthData] = useState([].map(x => Math.max(...x.map(y => y.depth)))) //useState([data.filter((x) => x.cluster === 0)].map(x => Math.max(...x.map(y => y. 
  const popupRef = useRef();
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState("")
  const [allowInitialize, setAllowInitialize] = useState(false)


  const [newWordData, setNewWordData] = useState({})
  const [searchTextKey, setSearchTextKey] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [noDataFound, setNoDataFound] = useState(false)
  const [searchCandidates, setSearchCandidates] = useState([])
  const [searchCandidatesAfterFilter, setSearchCandidatesAfterFilter] = useState([])


  console.log(newWordData);
  console.log(searchCandidates);

  useEffect(() => {

    setAllowInitialize(checkWordReady(newWordData))

    if (newWordData.key && newWordData.key.length < 3) {
      setSearchCandidates([])
      setSearchCandidatesAfterFilter([])
      setSearchTextKey("")

      setNoDataFound(false)
    }
    else if (searchCandidates.length > 0) {
      const newMatchingWords = searchCandidates.filter(x => x[0].toLocaleLowerCase().slice(0, newWordData.key.length) === newWordData.key)

      setSearchCandidatesAfterFilter(newMatchingWords)
      setNoDataFound(newMatchingWords.length === 0 && searchCandidates.length > 0)

    }
    if (newWordData.key && newWordData.key.slice(0, 3) !== searchTextKey) {
      setSearchTextKey(newWordData.key.slice(0, 3))
    }
  }, [newWordData])

  useEffect(() => {
    const initFetchData = async () => {
      try {

        const newfilteredData = await FetchSearchWords(searchTextKey)
        if (newfilteredData.length > 0) {

          setSearchCandidates(newfilteredData)
          setSearchCandidatesAfterFilter(newfilteredData)

          setNoDataFound(false)
        } else {
          setNoDataFound(true)

          console.log("NO DATA FOUND");
        }
        setSearchLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchLoading(false)

      }
    };
    if (searchTextKey.length === 3) {
      setSearchLoading(true)
      initFetchData();
    }
  }, [searchTextKey])

  function initializeClusterFunction() {
    console.log("INITALIZE CLUSTER");
    initiateNewClusterClient(newWordData)
    console.log(newWordData);
  }

  console.log(searchCandidatesAfterFilter);
  return (
    <Suspense>



      <main className={`the-container flex min-h-screen flex-row items-center justify-center p-16 overflow-auto dark:bg-gray-900 `} >

        <div className="flex  w-80  flex-col m-4 p-2 border-2 border-slate-400  justify-center items-center rounded-xl text-sm">
          <span className="p-4 mb-4">
            Language Codes
          </span>
          {Object.keys(langColors).map(x =>
                <div className="flex flex-row justify-around w-full">
                  <span className="w-1/6">{x}</span>
                  <span className="w-2/3">{langColors[x][1]}</span>
                </div>
              )
            }
        </div>
        <CreateWordDiv newWordData={newWordData} setNewWordData={setNewWordData}

          newId={0} allWords={[]}
          initializeClusterMode={true}
          initializeClusterFunction={initializeClusterFunction}
          buttonEnabled={allowInitialize}
        //setAddingData={setAddingData}
        //setFilteredData={setFilteredData}
        //setMustDepthRecalculate={setMustDepthRecalculate}
        //unsavedWordCount={unsavedWordCount}
        //setUnsavedWordCount={setUnsavedWordCount} 
        ></CreateWordDiv>

        <div className="flex  w-80  flex-col m-4 p-2 border-2 border-slate-400  justify-center items-center rounded-xl">
          <span className="p-4 mb-4">
            Existing words
          </span>
          {searchLoading ?
            <div>Loading</div>
            : noDataFound ? <div>No data found </div>
              :
              searchCandidatesAfterFilter.map(x =>
                <div className="flex flex-row justify-around w-full">
                  <span className="w-1/2">{x[0]}</span>
                  <span className="w-1/4">{x[1]}</span>
                  <span className="w-1/6 text-center"> {x[2]}</span>
                </div>
              )
          }
        </div>

      </main>
    </Suspense>
  );
}



async function initiateNewClusterClient(newClusterData) {
  let newfilteredData
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

      //newfilteredData = [data.responseData.clusterData[0].words]
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