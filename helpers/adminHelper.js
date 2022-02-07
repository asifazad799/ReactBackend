const db = require('../config/connection');
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId;
const collection = require('../config/collections');
const res = require('express/lib/response');

module.exports = {
    getTeachersData: () =>{

        return new Promise( async(resolve, reject) => {
            let data = await db.get()
            .collection(collection.TEACHER_COLLECTION)
            .find({})
            .toArray()
            // console.log(data);
            if(data){
                resolve(data)
            }else{
                reject()
            }
        })
    },
    approveApp: (data) =>{
        return new Promise ( async ( resolve, reject ) => {
            console.log(data);
            await db.get()
            .collection(collection.TEACHER_COLLECTION)
            .updateOne( {_id:objectId(data.appId)},{$set:{status:"approved"}} )
            .then(()=>{
                resolve({Id:data.appId})
            })

        })
    },
    rejectApp: (data) =>{
        return new Promise ( async ( resolve, reject ) => {
            console.log(data);
            await db.get()
            .collection(collection.TEACHER_COLLECTION)
            .updateOne( {_id:objectId(data.appId)},{$set:{status:"rejected"}} )
            .then(()=>{
                resolve({Id:data.appId})
            })

        })
    }
}