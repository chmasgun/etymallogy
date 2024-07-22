//import { OAuth2Client } from "google-auth-library";
//import jwt from "jsonwebtoken";
import { getClusterData,  saveClusterData } from "@/functions/mongodb_ops";
//const {createHash} = require('node:crypto');

export   async function POST(req, res) {
  console.log("SAVE DATA  clicked")
  try {
    if (req.method === "POST"  ) {
     
      const clusterData = await req.json() ;
     
      let dbInsertStatus = 0;
    
      console.log(clusterData);
      try {
      
        const result = await saveClusterData(clusterData.cid, clusterData.filteredData);
        dbInsertStatus = result.status;
        console.log(result);

        if(dbInsertStatus=== -3){
           
          return new Response("Couldnt find the data.", {
            status: 400
          })        
        } 

        
        //const secret = process.env.JWT_SECRET       
        return new Response(JSON.stringify({
          message: "Request successful",
          responseData: result
          // token: jwt.sign(result, secret, { expiresIn: '1h' })
        }), {
          status: 200
        });
        

      } catch (error) {
        console.error(error);
        return new Response("Bir hata oluştu", {
          status: 400
        }) 
      }

      
    } else {
      return new Response("Bilinmeyen bir hata oluştu", {
        status: 400
      })
    
    }
  } catch (error) {
    console.error(error);
    return new Response("Bilinmeyen bir hata oluştu. Veri formatı bozuk olabilir.", {
      status: 500
    })
   
  }
}

 