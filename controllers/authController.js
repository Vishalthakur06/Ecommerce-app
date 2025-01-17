import { hashPassword,comparePassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js'
import JWT from 'jsonwebtoken'

//Register
export const registerController = async (req,res)=>{
    try{
        const {name,email,password,phone,address,answer} = req.body;
        console.log(name);
        if(!name){
            return res.send({message:'Name is Requierd'});
        }
        if(!email){
            return res.send({message:'Email is Requierd'});
        }
        if(!password){
            return res.send({message:'Password is Requierd'});
        }
        if(!phone){
            return res.send({message:'Phone no is Requierd'});
        }
        if(!address){
            return res.send({message:'Address is Requierd'});
        }
        if(!answer){
            return res.send({message:'Answer is Requierd'});
        }

        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Register, please login'
            })
        }

        //register user
        const hashedPassword = await hashPassword(password)
        const user = new userModel({name,email,password:hashedPassword,phone,address,answer}).save();
        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
};


//Login

export const loginController = async (req,res)=>{
    try{
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            res.status(404).send({
                success:false,
                message:'Invalid email or Password'
            })
        }
        const  user = await userModel.findOne({email});
        if(!user){
          res.status(404).send({
            success:false,
            message:'Email is not Registered',
        }) 
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
            success:false,
            message:'Invalid Password',
        })
        }

        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
    }
}


//forgotPasswordController
export const forgotPasswordController = async(req,res)=>{
    try {
        const {email,answer,newPassword} =req.body;
        if(!email){
            res.status(400).send({
                message:'Email is required'
            })
        }
        if(!answer){
            res.status(400).send({
                message:'answer is required'
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:'newPassword is required'
            })
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
            success:false,
            message:"Wrong Email Or Answer",
            error
        })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}



//test controller
export const testController = (req,res)=>{
    try {
     res.send('Protected Routes');   
    } catch (error) {
        console.log(error);
        res.send({error})
    }
}

//update profile
export const updateProfileController = async(req,res)=>{
    try {
        const {name ,email,password,phone,address} = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if(password&&password.length<6){
            return res.json({error:'Password is required and 6 Character long'})
        }
        const hashedPassword = password?await hashPassword(password):undefined;
        const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
            name : name||user.name,
            password:hashedPassword||user.password,
            phone:phone||user.phone,
            address: address||user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile Updated Successfully",
            updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while Update profile",
            error
        })
    }
}

//orders
export const getOrdersController=async(req,res)=>{
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
             success:false,
            message:"Error while Getting Orders",
            error
        })
    }
}