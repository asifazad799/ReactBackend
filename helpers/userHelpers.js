const db = require('../config/connection');
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId;
const collection = require('../config/collections');
const res = require('express/lib/response');

module.exports = {
    signUp:(data)=>{

        return new Promise(async(resolve,reject)=>{

            let user = await db.get().collection(collection.USER_COLLECTION)
            .findOne({email:data.email});
            

            if(user){

                reject();

            }else{
                data.password = await bcrypt.hash(data.password,10);
                delete data.confirmPassword;
                
                await db.get().collection(collection.USER_COLLECTION)
                .insertOne(data).then(()=>{

                    resolve();

                })
            }

        })
    },
    logIn : (data)=>{
        return new Promise(async(resolve,reject)=>{

            let user = await db.get()
            .collection(collection.USER_COLLECTION)
            .findOne({email:data.email});

            if(user){
                bcrypt.compare(data.password,user.password)
                .then((status)=>{
                    if(status){
                        resolve({logged:true,user});
                    }else{
                        reject({wrongPassword:true})
                    }
                })
            }else{
                reject({userNotFound:true});
            };

        });
    },
}
