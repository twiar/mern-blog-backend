import ImageModel from "../models/Image.js";
import { unlink } from "node:fs";
import process from "node:process";

export const remove = async (req, res) => {
	try {
		const imageId = req.params.imgName;
		unlink(`${process.cwd()}\\uploads\\${imageId}`, (err) => {
			if (err) throw err;
			console.log(`${imageId} was deleted`);
		});

		res.json({
			success: true,
		});
	} catch (err) {
		console.warn(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};
