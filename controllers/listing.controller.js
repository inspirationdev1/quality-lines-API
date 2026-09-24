import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// const formidable = require("formidable");
import { formidable } from "formidable";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// const cloudinary = require("../config/cloudinary");
import cloudinary from "../config/cloudinary.js";

export const createListing = async (req, res, next) => {
  try {
    // let photoUrl = null;
    // const form = new formidable.IncomingForm();
    // form.parse(req, async (err, fields, files) => {
    //   if (err)
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "Error parsing form data." });

    //   if (files.image && files.image[0]) {
    //     const photo = files.image[0];
    //     const result = await cloudinary.uploader.upload(photo.filepath, {
    //       folder: "products",
    //       public_id:
    //         Date.now() + "_" + photo.originalFilename.split(" ").join("_"),
    //     });
    //     photoUrl = result.secure_url;
    //     req.body.imageUrls= [{photoUrl:photoUrl}]
    //   }
    // });

    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(404, "You can delete your own listing!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const uploadFiles = async (req, res, next) => {
  try {
    let photoUrl = null;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "Error parsing form data." });

      if (files.image && files.image[0]) {
        const photo = files.image[0];
        const result = await cloudinary.uploader.upload(photo.filepath, {
          folder: "products",
          public_id:
            Date.now() + "_" + photo.originalFilename.split(" ").join("_"),
        });
        photoUrl = result.secure_url;
        req.body.imageUrls = [{ photoUrl: photoUrl }];
      }
    });

    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
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
      folder: "products",
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
