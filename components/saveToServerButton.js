
import { langColors } from "@/functions/functions";


const saveClusterToDB = async ({cid, dataToSave ,setUnsavedWordCount}) => {

    try {
        const response = await fetch('/api/save-cluster-updated', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
  
          },
          body: JSON.stringify({ cid: cid, filteredData: dataToSave })
        });
  
        if (!response.ok) {
          const message = await response.text();
          console.log(message);
        } else {
          const responseResolved = await response;
          const data = await responseResolved.json();
          const message = data.message;
  
         // newfilteredData = [data.responseData.clusterData[0].words]
          console.log(["HEY", message]);
          setUnsavedWordCount(0)
          // newfilteredData = [data.filter((x) => x.cluster === cluster)]; // we will have multiple clusters, hence making a list
          //setFilteredData(newfilteredData);
        }
  
      } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
      }
  
}



export default function SaveToServerButton({ unsavedWordCount, setUnsavedWordCount, cid, filteredData }) {

  //console.log(pos);
  console.log([cid, filteredData]);
  const dataToSave = filteredData[0]
  return unsavedWordCount > 0 && <div className="pointer-events-auto flex relative justify-center items-center z-30 pl-8 pr-8 w-48 h-12 ">
   <div className="absolute left-0 top-0 backdrop-blur-sm w-full h-full rounded-xl z-10"></div>
   <div className="bg-lime-300 border shadow-lg border-gray-400/50  rounded-xl  z-20 relative "
    onClick={() => saveClusterToDB({ cid, dataToSave, setUnsavedWordCount })}>
      <span className="animate-ping absolute inline-flex inset-[12%] w-3/4 h-3/4 rounded-xl bg-lime-400 opacity-75"></span>
  
    
    <span className="p-2 inline-block">SAVE {unsavedWordCount} Words</span>
  </div>
 </div>
}