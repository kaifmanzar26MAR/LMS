import { Chapter } from "@/app/Models/chapter-schmea";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';
import { MuxData } from "@/app/Models/muxdata-schema";
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});
export async function POST(req:Request, {params}: {params:{courseId: string, chapterId:string}}) {
    try {
        const {userId}=auth();
        const values= await req.json();
        
        await dbConnect();
    
        const chapter=await Chapter.findOne({_id:params.chapterId, courseId:params.courseId});
    
        if(!chapter){
            return new NextResponse("No chpater found!!", {status:400});
        }
        console.log("chapter", chapter)
        const updatedchapter=await Chapter.findOneAndUpdate({_id:params.chapterId, courseId:params.courseId},{...values});
        console.log("updated chapter", updatedchapter);
        if(values.videoUrl){
            const existingMuxData= await MuxData.findOne({chapterId:params.chapterId});
            console.log( "existing ", existingMuxData);
            if(existingMuxData){
                console.log("in")
                try {
                    // Check if the asset exists
                    const asset = await mux.video.assets.retrieve(existingMuxData.assetId);
            
                    if (asset) {
                        // If the asset exists, delete it
                        
                        // const delInstance = await mux.video.assets.delete(existingMuxData.assetId);
                        // console.log("Deleted mux.video asset:", delInstance);
            
                        // Delete the document from MuxData collection
                        const delMuxData = await MuxData.findOneAndDelete({ _id: existingMuxData._id });
                        console.log("Deleted muxdata document:", delMuxData);
                    } else {
                        console.error("Mux asset not found.");
                    }
                } catch (error) {
                    console.error("Error deleting Mux video or MuxData document:", error);
                }
            }
            console.log("...creating")
            const asset=await mux.video.assets.create({
                input:values.videoUrl,
                playback_policy: "public",
                test:false
            }) 
            if(!asset){
                return new NextResponse("Somethig went worng in asset creation!!", {status:400});
            }
            console.log("assest",asset)
            const newMux=await MuxData.create({
                chapterId:params.chapterId,
                assetId:asset.id,
                playbackId:asset.playback_ids?.[0].id,
            })

            if(!newMux){
                return new NextResponse("Something went wrong in muxdata creation!!", {status:400});
            }

            const chapterMux= await Chapter.findOne({_id:params.chapterId, courseId:params.courseId});
            chapterMux.muxData=newMux._id;
            chapterMux.save()
        }
    
        if(!updatedchapter){
            return new NextResponse("Something went wrong in updating chapter!!", {status:400})
        }
        
        return NextResponse.json(updatedchapter);
    } catch (error) {
        console.log("[CHAPTER] update error "+ error);
        return new NextResponse("Chapter update Error "+ error, {status: 500})
    }
}