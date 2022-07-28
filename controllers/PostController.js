import PostModel from "../models/Post.js";
import { unlink } from "node:fs";
import process from "node:process";

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map((obj) => obj.tags)
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec();
		res.json(posts);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: "after",
			},
			(err, doc) => {
				if (err) {
					console.warn(err);
					return res.status(500).json({
						message: "Failed to get post",
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: "Post not found",
					});
				}

				res.json(doc);
			},
		).populate("user");
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.warn(err);
					return res.status(500).json({
						message: "Failed to delete posts",
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: "Post not found",
					});
				}

				unlink(`${process.cwd()}${doc.imageUrl.replace(/\//g, "\\")}`, (err) => {
					if (err) throw err;
					console.log(`${doc.imageUrl} was deleted`);
				});

				res.json({
					success: true,
				});
			},
		);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.replace(/\s/g, "").split(","),
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to create post",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			},
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to update post",
		});
	}
};
