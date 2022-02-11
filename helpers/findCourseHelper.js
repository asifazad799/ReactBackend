const db = require('../config/connection');
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId;
const collection = require('../config/collections');
const res = require('express/lib/response');

module.exports = {
    getCourseDetails: (Id) => {
        return new Promise( async(resolve, reject)=>{
            let course = await db.get()
            .collection(collection.COURSES)
            .findOne({_id:objectId(Id)})
            if(course){
                resolve(course)
            }else{
                reject()
            }
        })
    }
}