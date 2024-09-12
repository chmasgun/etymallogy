
import langColors from "@/functions/languageColors";
import { FetchSearchWords } from "@/functions/functions";
import { useRouter } from "next/navigation";
import { useState, useEffect, } from "react";
const maxSearchResults = 8

export default function SearchBar({ smallMode, setSmallMode, searchMustReset, setSearchMustReset }) {

    const router = useRouter()

    const [searchText, setSearchText] = useState("")
    const [searchTextKey, setSearchTextKey] = useState("")
    const [searchCandidates, setSearchCandidates] = useState([])
    const [searchCandidatesAfterFilter, setSearchCandidatesAfterFilter] = useState([])
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
    const [noDataFound, setNoDataFound] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    //const [dropdownWordSelected, setDropdownWordSelected] = useState(-1)

    function resetSearch() {
        setIsSearchDropdownOpen(false)
        setSearchCandidates([])
        setSearchCandidatesAfterFilter([])
        setSearchTextKey("")
        setSearchText("")
        setNoDataFound(false)
    }

    function searchHandle(e) {
        e.preventDefault()

        if (e.target.value.length < 3) {
            resetSearch()

        } else {
            //console.log(searchCandidates);
            const newText = e.target.value.toLocaleLowerCase().trim()
            const newTextKey = newText.slice(0, 3)
            const newMatchingWords = searchCandidates.filter(x => x[0].toLocaleLowerCase().slice(0, newText.length) === newText)

            setSearchCandidatesAfterFilter(newMatchingWords)
            setSearchTextKey(newTextKey)
            setIsSearchDropdownOpen(true)
            
            setNoDataFound(newMatchingWords.length === 0) // && searchCandidates.length > 0
            
            //console.log(newTextKey, searchTextKey);
            if (newTextKey !== searchTextKey) {
                //if (searchTextKey.length === 3) { // this condition is mostly satisfied above, but I can make a search like 'su ' right now, with a space
                console.log("fetching", newTextKey);
                setSearchLoading(true)   // now modified together with noDataFound
                initFetchData(newTextKey);
                //}
            }


        }

        // be careful while changing this
        setSearchText(e.target.value)
    }


    function dropdownItemClickHandle(index) {
        const wordSelected = searchCandidatesAfterFilter[index]
        //router.push({path:  `/tree?${wordSelected[2]}`})
        router.push(`/tree?cluster=${wordSelected[2]}&word=${wordSelected[0] + wordSelected[1]}`);
        console.log(wordSelected);
    }

    async function initFetchData  (searchInput)  {
        try {

            const newfilteredData = await FetchSearchWords(searchInput)
            if (newfilteredData.length > 0) {

                setSearchCandidates(newfilteredData)
                setSearchCandidatesAfterFilter(newfilteredData)
                setIsSearchDropdownOpen(true)
                setNoDataFound(false)
            } else {
                setNoDataFound(true)

                console.log("NO DATA FOUND");
            }
            setSearchLoading(false)
            setTimeout(() => {
                if(document.getElementsByClassName("search-result").length> 0){
                    document.getElementsByClassName("search-result")[0].scrollIntoView({ behavior: 'smooth', block: "center" })
                }
            }, 50)
        } catch (error) {
            console.error('Error fetching data:', error);
            setSearchLoading(false)

        }
    };





    useEffect(() => {
        if (!searchLoading) {
            if (searchText.length > 3) {  //user typed in more letters before the search results are returned, hence need more filter


                const newMatchingWords = searchCandidates.filter(x => x[0].toLocaleLowerCase().slice(0, searchText.length) === searchText)
                setSearchCandidatesAfterFilter(newMatchingWords)
                setNoDataFound(newMatchingWords.length === 0) //&& searchCandidates.length > 0
            }
        }
    }, [searchLoading])

    useEffect(() => {
        if (searchMustReset) {
            resetSearch()
            setSearchMustReset(false)
        }
    }, [searchMustReset])


    return <div className="flex flex-col justify-center self-center w-full  relative z-50 pointer-events-auto" onClick={() => setSmallMode(false)}>
        <div>
            { /*<span className="absolute right-0 top-0 bottom-0 text-center">{'\uD83D\uDD0D'}</span>*/}
            <input
                type="text"
                className={`self-center w-full placeholder-gray-400 text-gray-900 p-4 ${smallMode ? "rounded-xl" : "rounded-t-xl"}  outline-0 text-lg`}
                placeholder={smallMode ? '\uD83D\uDD0D' : 'Search for a word, try \'wine\' or \'şarap\''}
                onChange={searchHandle}
                value={searchText}

            />

            { // search close button
                isSearchDropdownOpen ? <div className="flex justify-center absolute right-0 mr-4 p-1 w-8 h-8 bg-red-300 top-1/4 rounded items-center text-4xl"
                    onClick={() => resetSearch()}>
                    {searchLoading ? // if the search is loading, add a spinning svg
                        <svg className="animate-spin  text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        :
                        <span className="relative block" style={{ top: "-3px" }}> &#215; </span>}
                </div> : <></>}
            {isSearchDropdownOpen ? <div className="flex absolute flex-col w-full justify-center text-lg bg-gray-200 rounded-b-xl overflow-auto">
                {searchCandidatesAfterFilter.slice(0, maxSearchResults).map((x, i) =>
                    <span key={i} className="search-result p-2 lg:pl-6 dark:bg-gray-500 dark:hover:bg-gray-400  hover:bg-gray-300 flex  justify-between" onClick={() => dropdownItemClickHandle(i)}>
                        <span>{x[0]}</span>
                        <span className={`right italic mr-2 text-sm lg:text-base lg:mr-4 ${langColors[x[1]][2]}`}>{langColors[x[1]][1]}</span>
                    </span>
                )}
                {noDataFound && !searchLoading ? <div className="search-result p-2 pl-6 italic text-sm  dark:bg-gray-500"> No matching result</div> : <></>}

            </div> : <></>}

        </div>
    </div>
}
