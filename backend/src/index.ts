import express, { Express, Request, Response } from "express";
import path from 'path'
import dotenv from 'dotenv'
dotenv.config();

const app = express();

// Env Vars:
const port = process.env.PORT || 5000;
const relative_assets_path = process.env.STATIC_ASSET_FOLDER_PATH || "../frontend/build"

const static_assets_path = path.join(__dirname, "..", relative_assets_path)

app.use(express.static(static_assets_path))

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(static_assets_path, "index.html"))
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});