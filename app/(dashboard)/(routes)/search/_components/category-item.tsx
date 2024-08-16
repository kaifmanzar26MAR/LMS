"use client"

import { cn } from "@/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { IconType } from "react-icons"
import qs from 'query-string'

interface CategoryItemPorps{
    key:string,
    label:string,
    icon?:IconType,
    value:string
}
export const CategoryItem=({key, label, icon: Icon, value}:CategoryItemPorps)=>{
    const pathname= usePathname();
    const router=useRouter();
    const serachParams=useSearchParams();

    const currentCategoryId= serachParams.get('categoryId')
    const currentTitle= serachParams.get("title");
    const isSelected= currentCategoryId === value;

    const onClick=()=>{
        const url= qs.stringifyUrl({
            url:pathname,
            query:{
                title:currentTitle,
                categoryId:isSelected ? null :value,
            }
        }, { skipNull:true, skipEmptyString:true})

        router.push(url);
        
    }
    return(
        <button  className={cn(
            "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hvoer:border-sky-700 transition",
            isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
        )} onClick={onClick}>
            {Icon && <Icon size={20}/>}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}