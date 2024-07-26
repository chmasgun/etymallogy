
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
  return unsavedWordCount > 0 && <div className="bg-lime-300   rounded-xl relative  "
    onClick={() => saveClusterToDB({ cid, dataToSave, setUnsavedWordCount })}>
      <span class="animate-ping absolute inline-flex inset-[16%] w-2/3 h-2/3 rounded-xl bg-lime-400 opacity-75"></span>
  
    
    <span className="p-2 inline-block">SAVE {unsavedWordCount} Words</span>
  </div>

}