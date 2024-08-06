import mongoose, { Schema } from "mongoose";

const muxDataSchama=new Schema({
    chapterId:{
        type:Schema.Types.ObjectId,
        ref:"Chapter"
    },
    assetId:{
        type:String,
    },
    playbackId:{
        type:String
    }
})


export const MuxData = mongoose.models.MuxData || mongoose.model('MuxData', muxDataSchama);