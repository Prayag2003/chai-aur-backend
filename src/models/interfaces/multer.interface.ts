import { Request } from "express";

export interface MulterRequest extends Request {
  files: {
    avatar?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };
}
