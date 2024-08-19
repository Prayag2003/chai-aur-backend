import { Request } from "express";
import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req: Request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
    // cb(null, file.originalname)
  },
});

export const upload = multer({ storage: storage });
