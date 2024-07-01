"use client"
import Image from "next/image";
import * as data from '../public/data.json'

const langColors = {
  "AR" : 'bg-green-300',
  "TR" : 'bg-red-300',
  "EN" : 'bg-sky-300',
  "FR" : 'bg-indigo-300'
   
}

console.log(data[1]);
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center place-content-evenly p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
           
          <code className="font-mono font-bold text-4xl">Etymallogy</code>
        </p>
        
      </div>

    

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
         {
          data.map(x=> <div className={`mb-12 mr-6 p-2 border-2 text-center justify-center rounded-lg flex flex-col ${langColors[x.lang]}`} >
            <span>{x.key}</span>
            <span className="text-2xl"> {x.original}</span>
            </div>)
         }

        
      </div>
    </main>
  );
}
