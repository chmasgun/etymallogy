

export default function ModeToggle({ editModeToggle,  setEditModeToggle }) {


    return <div className="m-2 p-0 w-40 h-12 bg-gray-100 rounded-full relative dark:bg-gray-400 dark:text-slate-800"
        onClick={() => {setEditModeToggle(1 - editModeToggle)} }>
        <div className={`h-full w-1/2 aspect-square ${editModeToggle ? "bg-green-300" : "bg-red-300"} rounded-full relative  transition-all`}
            style={{ left: editModeToggle ? "50%" : "0%" }}></div>
        <div className="h-full w-full box-border flex flex-row absolute p-inherit flex  left-0 top-0">
            <div className="h-full w-1/2  flex items-center justify-center"> View</div>
            <div className="h-full w-1/2  flex items-center justify-center"> Edit</div>
        </div>
    </div>
}