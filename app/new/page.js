"use client"

import { useEffect, useState, useRef, Suspense } from "react";

import SaveToServerButton from "@/components/saveToServerButton";
import {
  reqFields,  checkWordReady
} from "@/functions/functions";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import langColors from "@/functions/languageColors";
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
  


  const [newWordData, setNewWordData] = useState({})
  const [searchLoading, setSearchLoading] = useState(false)
  const [noDataFound, setNoDataFound] = useState(false)
  const [searchCandidatesAfterFilter, setSearchCandidatesAfterFilter] = useState([])

  console.log(newWordData);
   
 
  return (
    <Suspense>



      <main className={`the-container flex min-h-screen flex-row items-center justify-center p-16 overflow-auto dark:bg-gray-900 `} >

        <div className="flex  w-80  flex-col m-4 p-2 border-2 border-slate-400  justify-center items-center rounded-xl text-sm">
          <span className="p-4 mb-4">
            Language Codes
          </span>
          {Object.keys(langColors).map((x,i) =>
                <div key={i} className="flex flex-row justify-around w-full">
                  <span className="w-1/6">{x}</span>
                  <span className="w-2/3">{langColors[x][1]}</span>
                </div>
              )
            }
        </div>
        <CreateWordDiv newWordData={newWordData} setNewWordData={setNewWordData}

          newId={0} allWords={[]}
          initializeClusterMode={true}
          setSearchCandidatesAfterFilter={setSearchCandidatesAfterFilter}
          setNoDataFound={setNoDataFound} 
          setSearchLoading={setSearchLoading}
           
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
              searchCandidatesAfterFilter.map((x,i) =>
                <div  key={i} className="flex flex-row justify-around w-full">
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


