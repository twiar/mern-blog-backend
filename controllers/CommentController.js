import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
	try {
		const doc = new CommentModel({
			user: {
				avatarUrl: req.body.user.avatarUrl,
				fullName: req.body.user.fullName,
			},
			text: req.body.text,
			postId: req.body.postId,
		});

		const comment = await doc.save();

		res.json(comment);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Не удалось создать комментарий",
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const comments = await CommentModel.find().populate("user").exec();
		console.log(comments);
		res.json(comments);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Не удалось получить статьи",
		});
	}
};
