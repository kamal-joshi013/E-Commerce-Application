import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'types'
    },
    types:{
        type:String,
        enum:['Product','Categories']
    }
})

export const LikeModel = new mongoose.model('Like',likeSchema);