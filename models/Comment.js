import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
	{
		user: {
			fullName: {
				type: String,
				required: true,
			},
			avatarUrl: String,
		},
		text: {
			type: String,
			required: true,
		},
		postId: {
			type: String,
			required: true,
			unique: false,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Comment", CommentSchema);
