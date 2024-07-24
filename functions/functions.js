import { useState } from "react"





const langColors = {
    "AR": ["bg-lime-500", "Arabic"],
    "TR": ["bg-red-300", "Turkish"],
    "EN": ["bg-sky-300", "English"],
    "FR": ["bg-indigo-300", "French"],
    "LA": ["bg-red-600", "Latin"],
    "IT": ["bg-green-400", "Italian"],
    "GR": ["bg-sky-500", "Greek"]

}


const DrawRelation = ({ x1, x2, heightOffset, y, depthDiff, pair, setHoveredPair, setIsInsertMode }) => {

    const [lineColor, setLineColor] = useState("#111")
    const [lineWidth, setLineWidth] = useState(1)
    const [clicked, setClicked] = useState(false)

    const setHoverColor = () => {
        setLineColor("#f77")
        setLineWidth(3)
        setHoveredPair(pair)
        console.log(pair);
    }
    const revertHoverColor = (e) => {
        console.log(e)
        console.log([e.relatedTarget, e.toElement]);

        setLineColor("#111")
        setLineWidth(1)
        console.log("LEFTTTTTTTTTTTTTT");
        if(!clicked){

            setHoveredPair([-1, -1])
        }
         
    }

    return <svg className="absolute overflow-visible z-0 w-1 h-1">
        <line

            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={lineColor}
            strokeWidth={lineWidth}></line>
        <line className="z-10"
            onMouseEnter={() => setHoverColor()}
            onMouseOut={(e) => revertHoverColor(e)}
            onClick={(e) => { setClicked(true);setIsInsertMode(true);setTimeout(() => setClicked(false),20)}}
            x1={x1}
            y1={heightOffset}
            x2={x2}
            y2={heightOffset + y * 2}
            stroke={"transparent"}
            strokeWidth={20}></line>

    </svg>

}





export { DrawRelation, langColors }