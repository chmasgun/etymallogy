import { useState } from "react"





const langColors = {
    "AR": ["bg-lime-500", "Arabic"],
    "TR": ["bg-red-300", "Turkish"],
    "EN": ["bg-sky-300","English"],
    "FR": ["bg-indigo-300","French"],
    "LA": ["bg-red-600","Latin"],
    "IT": ["bg-green-400","Italian"],
    "GR": ["bg-sky-500","Greek"]

}


const DrawRelation = ({x1, x2, heightOffset, y, depthDiff, pair, setHoveredPair}) => {

    const [lineColor, setLineColor] = useState("#111")

    const setHoverColor = () =>{
        setLineColor("#f77")
        setHoveredPair(pair)
        console.log(pair);
    } 
    const revertHoverColor = () =>{
        setLineColor("#111")
        setHoveredPair([-1,-1])
    }

    return <svg className="absolute overflow-visible z-0"><line  
        onMouseEnter={()=> setHoverColor()} 
        onMouseLeave={() => revertHoverColor()}
        x1={x1}
        y1={heightOffset}
        x2={x2}
        y2={heightOffset + y *2 }
        stroke={lineColor}
        strokeWidth={5}></line></svg>

}





export { DrawRelation , langColors}