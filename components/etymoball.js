
import { langColors } from "@/functions/functions";
import { useEffect, useState } from "react";



export default function Etymoball({ words }) {

    const [wordsList, setWordsList] = useState(words)
    const [coordinates, setCoordinates] = useState([])
    const wordCount = words.length
    const radius = 150
    const sy = Math.sin(0.0 * Math.PI / 180); //fy
    const cy = Math.cos(0.0 * Math.PI / 180); //fy
    const sx = Math.sin(10 * Math.PI / 180); //fx
    const cx = Math.cos(10 * Math.PI / 180); //fx
    useState(() => {


        let phi = 0;
        let theta = 0;
        let max = words.length;
        let i = 0;
        let newCoordinates = []

        for (const i in words) {
            const newWordDict = { cx: 0, cy: 1, cz: 1, h: 20, w: 20, per: 1 }
            phi = Math.acos(-1 + (2 * parseInt(i)) / max);
            theta = Math.sqrt(max * Math.PI) * phi;

            newWordDict.cx = radius * Math.cos(theta) * Math.sin(phi);
            newWordDict.cy = radius * Math.sin(theta) * Math.sin(phi);
            newWordDict.cz = radius * Math.cos(phi);
            newWordDict.h = 20
            newWordDict.w = 20
            newWordDict.per = 2 * radius
                / (2 * radius + newWordDict.cz);

            newWordDict.x = newWordDict.cx * newWordDict.per
            newWordDict.y = newWordDict.cy * newWordDict.per
            newCoordinates.push(newWordDict)
        }

        setCoordinates(newCoordinates)

    }, [])





  

       

        useEffect(() => {
            const interval =   setInterval(() => {
                let phi = 0;
                let theta = 0;
                let max = words.length;
    
                let newCoordinates = []
                let rx1, ry1, rz1
    
    
                for (const ix in coordinates) {
    
                    const i = parseInt(ix)
    
                    rx1 = coordinates[i].cx;
                    ry1 = coordinates[i].cy * cy + coordinates[i].cz * -sy;
                    rz1 = coordinates[i].cy * sy + coordinates[i].cz * cy;
    
                    coordinates[i].cx = rx1 * cx + rz1 * sx;
                    coordinates[i].cy = coordinates[i].cy * cy + coordinates[i].cz * -sy;
                    coordinates[i].cz = rx1 * -sx + rz1 * cx;
    
                    var per = 2 * radius
                        / (2 * radius + coordinates[i].cz);
                    coordinates[i].x = coordinates[i].cx * per;
                    coordinates[i].y = coordinates[i].cy * per;
                    coordinates[i].alpha = per / 2;
                    coordinates[i].per = per
    
                    
                }
    
                setCoordinates([...coordinates])
            }, 1000)
        
            // Cleanup: Clear the interval when the component unmounts
            return () => {
              clearInterval(interval);
            };
          }, []);

    return <div className="text-xl self-center m-24 relative" >


        {words.map((x, i) =>
            <div key={i}className="m-2 absolute transition-all" style={{
                transitionTimingFunction: "linear",
                transitionDuration: "1000ms", 
                transform: `translate(${Math.round(coordinates[i]?.x) - 20}px, ${radius + coordinates[i]?.y}px)`,
                opacity: coordinates[i]?.alpha,
                fontSize: `${coordinates[i]?.per * 6 + 8}px`
            }}> {x} </div>
        )}

    </div>
}