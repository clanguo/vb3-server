import { getRepository, Like } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Blog } from "../entity/Blog";
import { ResponsePageData, ResponseResult, sendData, sendError, sendPageData, sendPageError } from "./Common";
import { BlogContent } from "../entity/BlogContent";
import { Tag } from "../entity/Tag";
import EventLog, { EventType } from "../entity/EventLog";
import ProjectController from "./ProjectController";
import SearchCondition from "../entity/SearchCondition";
import { instanceToPlain } from "class-transformer";

export class BlogController {
  private useBlog = getRepository(Blog);
  private useContent = getRepository(BlogContent);
  private useTag = getRepository(Tag);

  async all(request: Request, response: Response, next: NextFunction): Promise<ResponsePageData<Blog[]>> {
    const searchCondition: SearchCondition = SearchCondition.transform(request.query);
    const errors = await searchCondition.validateThis();
    if (errors.length) {
      // return sendError(errors.join("; "));
      return sendPageError(errors.join("; "));
    }

    const blogs = await this.useBlog.find({
      relations: ["tags", "category"],
      skip: (searchCondition.page - 1) * searchCondition.limit,
      take: searchCondition.limit,
      where: {
        title: Like(`%${searchCondition.key}%`)
      },
      order: {
        createdAt: "DESC"
      }
    });
    const count = await this.useBlog.count();
    return sendPageData(blogs, count, searchCondition.limit, searchCondition.page, searchCondition.key);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const blog = await this.useBlog.findOne(request.params.id, { relations: ["content", "tags", "category"] });
    if (blog) {
      return sendData(blog);
    } else {
      return sendError("No Data with `id` :" + request.params.id + " was found");
    }
  }

  async save(request: Request, response: Response, next: NextFunction): Promise<ResponseResult<Blog>> {
    const contentObj = new BlogContent(request.body.content);
    const blog = Blog.transform(request.body);
    blog.content = contentObj;
    const contentErrors = await contentObj.validateThis();
    const blogErrors = await blog.validateThis(true);
    const errors = blogErrors.concat(contentErrors);
    if (errors.length > 0) {
      return sendError(errors.join("; "));
    } else {
      const tags: Tag[] = [];
      for (const tagId of blog.tags) {
        const tag = await this.useTag.findOne(tagId);
        tags.push(tag);
      }
      blog.tags = tags;

      const contentIns = await this.useContent.save(contentObj);
      blog.content = contentIns;
      const blogIns = await this.useBlog.save(blog);

      new ProjectController().addEventLog({
        timing: new Date(), target: blogIns.title, targetId: blogIns.id, type: EventType.addBlog
      });

      return sendData(blogIns);
    }
  }

  /**
   * TODO 鉴权
   */
  async remove(request: Request, response: Response, next: NextFunction) {
    let blogIns = await this.useBlog.findOne(request.params.id, { relations: ["content"] });
    // await this.useContent.remove(userToRemove.)
    if (blogIns) {
      // 不需要等待记录添加就可以直接响应
      new ProjectController().addEventLog({
        timing: new Date(), type: EventType.removeBlog, target: blogIns.title, targetId: blogIns.id
      });

      await this.useBlog.remove(blogIns);
      await this.useContent.remove(blogIns.content);


      return sendData(true);
    } else {
      return sendData(false);
    }
  }

  async editInfo(request: Request, response: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    try {
      const id = request.params.id;
      const blog = await this.useBlog.findOne(id);
      if (!blog) return sendData(false);
      const editBlog = request.body;
      for (const key in editBlog) {
        if (Object.prototype.hasOwnProperty.call(editBlog, key)) {
          if (key !== "content" && key !== "tags") {
            blog[key] = editBlog[key];
          }
        }
      }

      /**
       * 防止content被修改
       */
      delete editBlog.content;

      const errors = await blog.validateThis();
      if (errors.length > 0) {
        return sendError(errors.join("; "));
      } else {
        const tags: Tag[] = [];
        for (const tagId of request.body.tags) {
          const tag = await this.useTag.findOne(tagId);
          tags.push(tag);
        }
        blog.tags = tags;
        await this.useBlog.save(blog);
        return sendData(true);
      }
    } catch (e) {
      return sendError(e instanceof Error ? e.message : e);
    }
  }

  async editContent(request: Request, response: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    const editContent = new BlogContent(request.body.content);
    const errors = await editContent.validateThis();
    if (errors.length) {
      return sendError(errors.join("; "));
    } else {
      let blog = await this.useBlog.findOne(request.params.id, { relations: ["content"] });
      blog.content.content = editContent.content;

      await this.useContent.save(blog.content);
      return sendData(true);
    }
  }
}