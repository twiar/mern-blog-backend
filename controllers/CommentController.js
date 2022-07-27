import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
	try {
		const doc = new CommentModel({
			fullName: req.body.fullName,
			text: req.body.text,
			avatarUrl: req.avatarUrl,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Не удалось создать комментарий",
		});
	}
};
