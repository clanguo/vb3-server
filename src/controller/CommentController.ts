import { instanceToPlain } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Blog } from "../entity/Blog";
import Comment from "../entity/Comment";
import SearchCondition from "../entity/SearchCondition";
import { ResponsePageData, ResponseResult, sendData, sendError, sendPageData, sendPageError } from "./Common";

export default class CommentController {
  private useComment = getRepository(Comment);
  private useBlog = getRepository(Blog);

  public async all(req: Request, res: Response, next: NextFunction): Promise<ResponsePageData<Comment[]>> {
    const condition = SearchCondition.transform(req.query);
    const validatorError = await condition.validateThis();
    if (validatorError && validatorError.length) {
      return sendPageError(validatorError.join("; "));
    }

    const result = await this.useComment.findAndCount({
      skip: (condition.page - 1) * condition.limit,
      take: condition.limit,
      order: {
        createdAt: "DESC"
      }
    });

    return sendPageData(result[0], result[1], condition.limit, condition.page, condition.key);
  }

  public async one(req: Request, res: Response, next: NextFunction): Promise<ResponsePageData<Comment[]>> {
    const condition = SearchCondition.transform(req.query);
    const validatorError = await condition.validateThis();
    if (validatorError && validatorError.length) {
      return sendPageError(validatorError.join("; "));
    }

    const id = req.params.id;

    const result = await this.useComment.findAndCount({
      // skip: (condition.page - 1) * condition.limit,
      // take: condition.limit,
      where: {
        blog: {
          id
        }
      },
      order: {
        createdAt: "DESC"
      }
    });

    return sendPageData(result[0], result[1], condition);
  }

  public async save(req: Request, res: Response, nexy: NextFunction): Promise<ResponseResult<Comment>> {
    const comment = Comment.transform(req.body);
    const validatorError = await comment.validateThis();
    if (validatorError && validatorError.length) {
      return sendError(validatorError.join("; "));
    }

    const id = req.params.id as string;
    if (!id) {
      return sendError(`请求参数不正确，请重新检查参数`)
    }

    const blogIns = await this.useBlog.findOne(id, { relations: ["comments"] });
    if (!blogIns) {
      return sendError(`不存在id为${id}的文章，请重新检查参数`)
    }

    delete comment.id;
    try {
      const commentIns = await this.useComment.save(comment);
      blogIns.comments.unshift(commentIns);
      await this.useBlog.save(blogIns);
      return sendData(commentIns);
    } catch (e) {
      console.log(e);
    }

  }

  public async allWithUserId(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Comment[]>> {
    const userId = req.params.id;
    if (!userId) {
      return sendError("参数错误，请检查url是否正确");
    }

    const result = await this.useComment.find({
      where: {
        userId
      },
      relations: [
        "blog"
      ],
      order: {
        createdAt: "DESC"
      }
    });

    return sendData(result);
  }
}