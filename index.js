import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import mongoose from "mongoose";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
	commentCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
	UserController,
	PostController,
	CommentController,
	ImageController,
} from "./controllers/index.js";

import dotenv from "dotenv";

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync("uploads")) {
			fs.mkdirSync("uploads");
		}
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.post("/uploadavatar", upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

app.get("/posts/:id/comments", CommentController.getAll);
app.post(
	"/posts/:id/comments",
	checkAuth,
	commentCreateValidation,
	handleValidationErrors,
	CommentController.createComment,
);

app.delete("/posts/:id", checkAuth, PostController.remove);
app.delete("/uploads/:imgName", checkAuth, ImageController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.warn(err);
	}
	console.log("Server OK");
});
