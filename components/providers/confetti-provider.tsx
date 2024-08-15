"use client"

import ReactConfetti from "react-confetti"
import { useConfettistore } from "@/hooks/use-confetti-store"

export const ConfettiProvider=()=>{
    const confetti= useConfettistore();

    if(!confetti.isOpen){
        return null;
    }

    return (
        <ReactConfetti 
            className="pointer-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={()=>{
                confetti.onClose();
            }}
        />
    )
}