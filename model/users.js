const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDetailSchema = new Schema({
    mobilenumber: {
        type: String
    },
    profilepic: {
        type: String
    },
    devicetoken: {
        type: String,
        required: 'Please enter your devicetoken',
    },
    isVerified: {
        type: Number,
        required: 'Please enter your isVerified',
    },
    lname: {
        type: String
    },
    manufacturer: {
        type: String,
        required: 'Please enter your manufacturer',
    },
    appversion: {
        type: String,
        required: 'Please enter your appversion',
    },
    fcmtoken: {
        type: String,
        required: 'Please enter your fcmtoken',
    },
    app_version_with_build: {
        type: String,
        required: 'Please enter your app_version_with_build',
    },
    email: {
        type: String
    },
    fname: {
        type: String
    },
    nft: {
        type: Number
    },
    osversion: {
        type: String,
        required: 'Please enter your osversion',
    },
    devicetype: {
        type: Number,
        required: 'Please enter your devicetype',
    },
    uniqueId: {
        type: String
    },
    providerName: {
        type: String
    },
    dob: {
        type: Number
    },
    clapCount: {
        type: Number
    },
    connectionCount: {
        type: Number
    },
    viewCount: {
        type: Number
    },
    threadCount: {
        type: Number
    },
    location: {
        type: String
    },
    aboutme: {
        type: String
    },
    isProfileUpdated: {
        type: Boolean
    },
    IsApproved: {
        type: Boolean
    },
    IsSyncContact: {
        type: Boolean
    },
    Approvedby: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    ApprovedDate: {
        type: Number
    },
    ApprovedName: {
        type: String
    },
    countryCode: {
        type: String
    },
    gender: {
        type: String
    },
    displayName: {
        type: String
    },
    createdDate: {
        type: Number
    },
    modifiedDate: {
        type: Number
    },
    nftAddress: {
        type: String
    },
    monetize: {
        type: Number
    },
    accountDetails: {
        type: String
    },
    isKYC: {
        type: Boolean
    },
    isSkip: {
        type: Boolean
    },
    isAgree: {
        type: Number
    },
    companyName1: {
        type: String
    },
    companyName2: {
        type: String
    },
    companyName3: {
        type: String
    },
    schoolOrCollegeName1: {
        type: String
    },
    schoolOrCollegeName2: {
        type: String
    },
    schoolOrCollegeName3: {
        type: String
    },
    temp: {
        type: String
    },
    lastLocationUpdatedDate: {
        type: Date
    },
    friendList: [{
        type: mongoose.Types.ObjectId,
        require: true
    }],
    loc: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        }
    },
    UUId: {
        type: String
    },
    socketId: {
        type: String
    },
    currentChatUser:{
        type: String
    }
});

UserDetailSchema.index({
    loc: '2dsphere'
});

const UserDetail = mongoose.model('userdetails', UserDetailSchema);
module.exports = UserDetail;