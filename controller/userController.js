const { response } = require('express');
const res = require('express/lib/response');
const userHelper = require('../helpers/userHelpers');
const jwt = require('jsonwebtoken');
const generateToken = require('../util/generateToken');

module.exports = {

    landingPage: async (req,res) =>{
        // console.log('asif')

        res.json({
            message:"asif"
        })

    },
    signUp: async(req,res) =>{

        // console.log(req.body);
        userHelper.signUp(req.body).then(()=>{

            res.status(201).json({
                message:'signed up successfully'
            });

        }).catch(()=>{

            res.status(401).json({
                message:"user already exist"
            })

        })
       
    },
    logIn: async(req,res)=>{
        userHelper.logIn(req.body).then((response)=>{

            delete response.user.password;
            res.status(201).json({
                user:response.user,
                message:"logged successfully",
                token:generateToken(response.user._id)
            });

        }).catch((error)=>{

            if(error.wrongPassword){
                res.status(401).json({
                    message:"wrong user name or password"
                })
            }

            if(error.userNotFound){
                res.status(401).json({
                    message:"sorry user did not found"
                })
            }

        })
    }

}