import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

import { formidable } from "formidable";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudinary from "../config/cloudinary.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(errorHandler(404, "Category not found!"));
  }
  if (req.user.id !== category.userRef) {
    return next(errorHandler(404, "You can delete your own category!"));
  }
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(errorHandler(404, "Category not found!"));
  }
  if (req.user.id !== category.userRef) {
    return next(errorHandler(401, "You can only update your own categories!"));
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategorys = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const categories = await Category.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res) => {
  try {
    console.log("File:", req.file);
    // console.log("User:", req.body.userRef);
    let photoUrl = null;

    const photo = req.file; //files.image[0];
    const result = await cloudinary.uploader.upload(photo.path, {
      folder: "category",
      public_id: Date.now() + "_" + photo.originalname.split(" ").join("_"),
    });
    photoUrl = result.secure_url;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      photoUrl: photoUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      photoUrl: photoUrl,
    });
  }
};
