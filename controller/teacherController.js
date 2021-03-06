const jwt = require('jsonwebtoken');
const generateToken = require('../util/generateToken');
const { response } = require('express');
const res = require('express/lib/response');
const teacherHelper = require('../helpers/teacherHelper');
const { uploadFile } = require('../s3');
const fs = require('fs');
const findCourseHelper = require('../helpers/findCourseHelper')

module.exports = {

    signUp : async(req,res) => {
        req.body.status = 'pending'
        teacherHelper.signUp(req.body).then(()=>{
            res.status(200).json({
                message:"signedUp successfully"
            })

        }).catch(()=>{
            res.status(401).json({
                message:"User already exist"
            })
        })
    },
    login: async(req, res) => {
        teacherHelper.logIn(req.body).then((response)=>{
            delete response.user.password;
            res.status(200).json({
                user:response.user,
                message:"logged in successfully",
                token:generateToken(response.user._id)
            })

        }).catch((error)=>{

            if(error.passwordError){
                res.status(401).json({
                    message:"Password or email did not match"
                });
            }

            if(error.userNotFound){

                res.status(401).json({
                    message:"Sorry user not found"
                });

            }

        })

    },
    addNewCourse: async(req, res) => {
        let data = req.body
        data.status = 'pending'
        teacherHelper.addNewCourse(data).then(async(response) => {
            let name = response + "thumbnail"
            let result = await uploadFile(req.file,name)
            teacherHelper.addThumbnail( response, result.Location).then((response) => {
                    fs.unlink(`../back_end/uploads/${req.file.filename}`,(error) => {
                        if(error){
                            console.log(error);
                        }else{
                            console.log('file deleted');
                            res.status(200).json({
                                message:"Course Added successfully"
                            })
                        }
                    })
                }).catch((error) => {
                    res.status(400).json({
                        message:"thumbnail not added"
                })
            })  
        }).catch((error) => {
            if(error.sameTitle){
                fs.unlink(`../back_end/uploads/${req.file.filename}`,(error) => {
                    if(error){
                        console.log(error);
                    }else{
                        console.log('file deleted');
                        res.status(401).json({
                            message:"Please choose a different title"
                        })
                    }
                })
            }else{
                fs.unlink(`../back_end/uploads/${req.file.filename}`,(error) => {
                    if(error){
                        console.log(error);
                    }else{
                        console.log('file deleted');
                        res.status(500).json({
                            message:"Internal error"
                        })
                    }
                })
                
            }
        })
    },
    coursesData: async(req, res) => {
        teacherHelper.getCourseData(req.body.teacher).then((response) => {
            res.status(200).json({
                message:"Data found Successfully",
                courses:response
            })
        }).catch((error)=>{
            res.status(404).json({
                message:"Data Not Found"
            })
        })
    },
    courseDetails: async(req, res) => {
        findCourseHelper.getCourseDetails(req.query.Id)
        .then((response) => {
            res.status(200).json({
                message:"course details got successfully",
                courseTop:response
            })
        }).catch((error) => {
            res.status(404).json({
                message:"course details did not found"
            })
        })
    },
    editCourse: async(req, res) => {
        if(!req.body.thumbnail){
            let name = req.body.courseId + req.file.filename
            let result = await uploadFile(req.file,name)
            req.body.thumbnail = result.Location
            teacherHelper.updateCourseTopBar(req.body).then(() => {
                fs.unlink(`../back_end/uploads/${req.file.filename}`,(error) => {
                    if(error){
                        console.log(error);
                    }else{
                        console.log('file deleted');
                        res.status(200).json({
                            message:"Course Updated successfully"
                        })
                    }
                })
            }).catch(() => {
                res.status(500).json({
                    message:"Course did not Updated"
                })
            })
        }else{
            teacherHelper.updateCourseTopBar(req.body)
        }
    }

}