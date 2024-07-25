"use client"
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import WordCard from "@/components/wordCard";
import SaveToServerButton from "@/components/saveToServerButton";
import { DrawRelation, langColors, RecalculateDepthAfter } from "@/functions/functions";
import Legend from "@/components/legend";
import Popup from "@/components/popup";
import { useRouter } from 'next/navigation';
//console.log(data[1]);

 


export default function Home() {

 
  return (
    <main className={`flex min-h-screen flex-col items-center place-content-start p-24 `}>
    
      <div className="z-10 mb-12 max-w-5xl w-full items-center justify-center   font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">

          <code className="font-mono font-bold text-4xl">Etymallogy</code>
        </p>

    
      </div>


   
    </main>
  );
}
