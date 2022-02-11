const db = require('../config/connection');
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId;
const collection = require('../config/collections');
const res = require('express/lib/response');


module.exports = {

    signUp:(data) =>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get()
            .collection(collection.TEACHER_COLLECTION)
            .findOne({email:data.email});

            if(user){
                reject()
            }else{

                delete data.conconfirmPassword;
                data.password = await bcrypt.hash(data.password,10);
                data.experienceInTeaching = parseInt(data.experienceInTeaching)

                await db.get()
                .collection(collection.TEACHER_COLLECTION)
                .insertOne(data).then((response)=>{

                    resolve();

                })
            } 

        })
    },
    logIn:(data)=>{

        return new Promise(async(resolve,reject)=>{

            let user = await db.get()
            .collection(collection.TEACHER_COLLECTION)
            .findOne({email:data.email})
            // console.log(user);

            if(user){
                bcrypt.compare(data.password,user.password)
                .then((status)=>{
                    if(status){
                        resolve({logged:true,user});
                    }else{
                        reject({passwordError:true});
                    }
                })
            }else{
                reject({userNotFound:true});
            }

        })

    },
    addNewCourse: (data) => {
        return new Promise (async(resolve, reject) => {
            let isSameTitile = await db.get().
            collection(collection.COURSES)
            .findOne({title:data.title})
            if(isSameTitile){
                reject({sameTitle:true})
            }else{
                data.teacher = await objectId(data.teacher)
                data.date = await new Date()
                // console.log(data.teacher);
                await db.get().collection(collection.COURSES)
                .insertOne(data).then((res)=>{
                    resolve(data._id)
                }).catch((error)=>{
                    reject()
                })
            }
        })
    },
    addThumbnail: (courseId, link) => {
        return new Promise (async(resolve, reject)=>{
            await db.get().collection(collection.COURSES)
            .updateOne({_id:objectId(courseId)}, {$set:{thumbnial:link}})
            .then((response)=>{
                resolve()
            }).catch((error)=>{
                reject()
            })
        })
    },
    getCourseData: (teacherId) => {
        return new Promise(async(resolve, reject) => {
            let data = await db.get().collection(collection.COURSES)
            .find({teacher:objectId(teacherId)})
            .sort({_id:-1}).toArray()
            // console.log(data.length);
            if(data.length !== 0){
                resolve(data)
            }else{
                reject({dataNotFound:true})
            }
        })
    },
    updateCourseTopBar: (courseDetails) => {
        return new Promise(async(resolve, reject) => {
            await db.get()
            .collection(collection.COURSES)
            .updateOne(
                {_id:objectId(courseDetails.courseId)},
                {$set:{
                    title: courseDetails.title,
                    thumbnial: courseDetails.thumbnail,
                    category: courseDetails.category,
                    language: courseDetails.language,
                    description: courseDetails.description
                }}
            ).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }

}