import express from 'express'
import { createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController } from '../controllers/createCategoryController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
const router = express.Router()

//routes
//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)

//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//get All category
router.get('/get-category',categoryController)

//single category
router.get('/single-category/:slug',singleCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

export default router