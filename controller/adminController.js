const jwt = require('jsonwebtoken');
const generateToken = require('../util/generateToken');
const { response } = require('express');
const res = require('express/lib/response');
const adminHelper = require('../helpers/adminHelper')

module.exports = {
    logIn : async(req,res) => {
        let email = "asif@mail.com"
        let password = "asifazad"
        // console.log(req.body);
        if(req.body.email == email){
            if(req.body.password == password){
                res.status(200).json({
                    message:"logged in successfully",
                    user:{email},
                    token:generateToken(email)
                })
            }else{
                res.status(401).json({
                    message:"Password or email did not match"
                });
            }
        }else{
            res.status(401).json({
                message:"Sorry user not found"
            });
        }
    },
    getTeachersData: async(req,res) => {
        // console.log('asif');
        adminHelper.getTeachersData().then((response) => {
            console.log(response);
            return res.status(200)
            .json({data:response,message:"data fetched succesfully"})
        })
        
    },
    approveApplication: async (req,res) => {
        // console.log('asif');
        // console.log(req.body);
        let id = req.body.appId
        adminHelper.approveApp(req.body).then((response)=>{
            res.status(200).json({
                message:`approved ${response.Id}`
            })
        })
    },
    rejectApplication: async (req,res) => {
        // console.log('asif');
        // console.log(req.body);
        let id = req.body.appId
        adminHelper.rejectApp(req.body).then((response)=>{
            console.log(response.Id);
            res.status(200).json({
                message:`rejected ${response.Id}`,
            })
        })
    }
}