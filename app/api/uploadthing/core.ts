import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();

 const handleAuth=()=>{
    const {userId} = auth();
    if(!userId) throw new Error("Unauthorized!!")
    return {userId};
 }
 
export const ourFileRouter = {
 courseImage: f({image:{maxFileCount:1, maxFileSize:"4MB"}})
 .middleware(()=>handleAuth())
 .onUploadComplete(()=>{}),

 courseAttachment: f(["text", "image", "video", "audio", "pdf"])
 .middleware(()=>handleAuth())
 .onUploadComplete(()=>{}),

 courseVideo: f({video:{maxFileCount:1, maxFileSize:"512GB"}})
 .middleware(()=> handleAuth())
 .onUploadComplete(()=>{})

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;