// only for the decoration

import {create} from "zustand"

type ConfettiStore={
    isOpen:boolean;
    onOpen:()=>void;
    onClose:()=>void;
};

export const useConfettistore= create<ConfettiStore> ((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}));