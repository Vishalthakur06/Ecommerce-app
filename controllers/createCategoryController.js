import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

//create category
export const createCategoryController = async(req,res)=>{
    try {
        const {name} = await req.body;
        if(!name){
           return res.status(401).send({
            message:'Name is Required'
        }) 
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
            message:'Category Already Exists'
        }) 
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:'New Category Created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
}

//update category
export const updateCategoryController = async(req,res) =>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category
        })
    } catch (error) {
         console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While Updating Category'
        })
    }
}

//get All Category
export const categoryController = async(req,res)=>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"All Category Lists",
            category
        })
    } catch (error) {
         console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While getting all category'
        })
    }
}


//Single category
export const singleCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Getting Single Category Successfully",
            category
        })
    } catch (error) {
         console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While getting single category'
        })
    }
}

//delete category
export const deleteCategoryController = async(req,res) =>{
    try {
        const {id} = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully",
            category
        })
    } catch (error) {
         console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While Deleting Category'
        })
    }
}