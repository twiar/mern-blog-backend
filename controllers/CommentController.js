import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
	try {
		const doc = new CommentModel({
			title: req.body.title,
			text: req.body.text,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось создать комментарий",
		});
	}
};
