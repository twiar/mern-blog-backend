import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
	imageUrl: String,
});

export default mongoose.model("Image", ImageSchema);
