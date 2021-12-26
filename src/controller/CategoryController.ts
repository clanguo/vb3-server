import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import Category from "../entity/Category";
import { ResponseResult, sendData, sendError } from "./Common";

export default class CategoryController {
  private useCategory = getRepository(Category);

  public async one(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Category>> {
    const id = req.params.id;
    const category = await this.useCategory.findOne(id, { relations: ["blogs"] });
    return sendData(category);
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Category>> {
    const categoryObj = Category.transform(req.body);
    const errors = await categoryObj.validateThis();
    if (errors.length) {
      return sendError(errors.join("; "));
    }

    const categoryIns = await this.useCategory.save(categoryObj);
    categoryIns.blogs = [];
    return sendData(categoryIns);
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    const id = req.params.id;
    const category = await this.useCategory.findOne(id, { relations: ["blogs"] });
    if (!category) {
      return sendError("不存在id为" + id + "的分类");
    }
    if (category.blogs.length) {
      return sendError("分类所属博客不为空，不能删除");
    }

    await this.useCategory.delete({ id });

    return sendData(true);
  }

  public async all(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Category[]>> {
    const categories = await this.useCategory.find({ relations: ["blogs"] });
    return sendData(categories);
  }
}