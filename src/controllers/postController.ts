import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { Post } from "../models/Post";
import { Tag } from "../models/Tag";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, desc, tags } = req.body;

    let imageUrl = "";

    if (req.file) {
      try {
        // Uploading image to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (result) resolve(result);
              else reject(error);
            })
            .end(req.file!.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return res
          .status(500)
          .json({ title: "Error", message: "Image upload failed" });
      }
    }

    const tagArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((tag) => tag.trim().replace(/["']/g, ""))
      : [];

    const tagIds = await Promise.all(
      tagArray.map(async (tagName: string) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        return tag._id;
      })
    );

    // Creating a new post
    const post = new Post({
      title,
      desc,
      image: imageUrl,
      tags: tagIds,
    });

    await post.save();
    res.status(201).json(await post.populate("tags"));
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ title: "Error", message: "An unexpected error occurred" });
  }
};

// Controller to fetch all posts with filtering, sorting, and pagination
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { sort, page = 1, limit = 10, keyword, tag } = req.query;

    const allowedParams = ["sort", "page", "limit", "keyword", "tag"];

    const queryParams = Object.keys(req.query);
    const invalidParams = queryParams.filter(
      (param) => !allowedParams.includes(param)
    );

    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: `Invalid query parameters: ${invalidParams.join(", ")}`,
      });
    }

    const filter: any = {};
    if (keyword) {
      filter.$or = [
        { title: new RegExp(keyword as string, "i") },
        { desc: new RegExp(keyword as string, "i") },
      ];
    }
    if (tag) {
      const tagObj = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag}$`, "i") },
      });
      if (tagObj) {
        filter.tags = { $in: [tagObj._id] };
      } else {
        return res.json([]);
      }
    }

    let sortOption: { [key: string]: 1 | -1 } = {};
    if (sort) {
      const sortField = sort as string;
      sortOption[sortField] = 1;
    }

    // Fetching posts from the database with filters, sorting, and pagination
    const posts = await Post.find(filter)
      .populate("tags")
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(400).json({ error: "BAD_REQUEST" });
  }
};
