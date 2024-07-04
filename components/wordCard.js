
const langColors = {
    "AR": 'bg-lime-500',
    "TR": 'bg-red-300',
    "EN": 'bg-sky-300',
    "FR": 'bg-indigo-300',
    "LA": 'bg-red-600',
    "IT": 'bg-green-400',
    "GR": 'bg-sky-500'

}


export default function WordCard({x, pos}) {

    console.log(pos);
    return <div key = {x.id} style={{left : `${pos[x.id] || 0}px` }}
        className={`word-card-individual  absolute border-2 min-w-32 min-h-24  text-center  justify-center rounded-lg flex flex-col ${langColors[x.lang]}`} > 
        { // absolute
        }
        <span>{x.key}</span>
        <span className="text-2xl"> {x.original}</span>
        <span className="text-xs"> {x.id}</span>
    </div>
}