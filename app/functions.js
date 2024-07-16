




const langColors = {
    "AR": ['bg-lime-500', "Arabic"],
    "TR": ['bg-red-300', "Turkish"],
    "EN": ['bg-sky-300',"English"],
    "FR": ['bg-indigo-300',"French"],
    "LA": ['bg-red-600',"Latin"],
    "IT": ['bg-green-400',"Italian"],
    "GR": ['bg-sky-500',"Greek"]

}


const DrawRelation = ({x1, x2, heightOffset, y, depthDiff}) => {

    return <svg className="absolute overflow-visible"><line 
        x1={x1}
        y1={heightOffset}
        x2={x2}
        y2={heightOffset + y *2 }
        stroke={"#111"}></line></svg>

}





export { DrawRelation , langColors}