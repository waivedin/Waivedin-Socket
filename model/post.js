const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postContent: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "UserDetails"
    },
    tagId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Schema"
    },
    threadId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "ThreadMaster"
    },
    tagName: {
        type: String
    },
    profileName: {
        type: String
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    coordinates: {
        type: [Number],
        default: [0, 0],
        index: '2dsphere'
    },
    status: {
        type: Boolean
    },
    bgColor: {
        type: String
    },
    gender: {
        type: Number
    },
    textColor: {
        type: String
    },
    profilePic: {
        type: String
    },
    thumbNail: {
        type: String
    },
    score: {
        type: Number
    },
    viewCount: {
        type: Number
    },
    threadCount: {
        type: Number
    },
    clapCount: {
        type: Number
    },
    allowAnonymous: {
        type: Boolean
    },
    postType: {
        type: Number
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: Number
    },
    nft: {
        type: Number
    },
    nftAddress: {
        type: String
    },
    threadLimit: {
        type: Number
    },
    createdDate: {
        type: Number
    },
    modifiedDate: {
        type: Number
    },
    scoreModifiedDate: {
        type: Number
    },
    isThreadRun: {
        type: Boolean
    },
    nftMediaUrl: {
        type: String
    },
    nftStatus: {
        type: Boolean
    },
    nfttokenId: {
        type: String
    },
    nfttxId: {
        type: String
    },
    attributes: {
        type: Object
    },
    jobId: {
        type: String
    },
    jobStatus: {
        type: Boolean
    },
    nftipfs: {
        type: String
    },
    monetize: {
        type: Number
    },
    monetizeAmount: {
        type: Number
    },
    monetizeActualAmount: {
        type: Number
    },
    monetizePlatformAmount: {
        type: Number
    },
    monetizeTax: {
        type: Number
    },
    currencyCode: {
        type: String
    },
    currencySymbol: {
        type: String
    },
    isRepost: {
        type: Boolean
    },
    commentCount: {
        type: Number,
        default: 0
    }
});


const Post = mongoose.model('post', PostSchema);
module.exports = Post;