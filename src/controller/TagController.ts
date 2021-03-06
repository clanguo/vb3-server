import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import ConfigManager from "../config/configManager";
import { EventType } from "../entity/EventLog";
import { Tag } from "../entity/Tag";
import { ResponseResult, sendData, sendError } from "./Common";
import ProjectController from "./ProjectController";

export class TagController {
  private useTag = getRepository(Tag);

  public async add(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Tag>> {
    const tag = Tag.transform(req.body);
    /**
     * 添加tag时不添加blog
     */
    delete tag.blogs;
    /**
     * 防止已添加的数据被使用
     */
    delete tag.id;
    const errors = await tag.validateThis();
    if (errors.length) {
      return sendError(errors.join("; "));
    }
    const tagIns = await this.useTag.save(tag);

    new ProjectController().addEventLog({
      timing: new Date(), type: EventType.addTag, target: tagIns.name, targetId: tagIns.id
    });

    tag.blogs = [];

    return sendData(tagIns);
  }

  public async find(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Tag>> {
    const id = req.params.id;
    const tag = await this.useTag.findOne(id, { relations: ["blogs"] });
    if (tag) {
      return sendData(tag);
    } else {
      return sendError("Not Data with `id` :" + id + " was found!");
    }
  }

  public async all(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<Tag[]>> {
    const tags = await this.useTag.find({ relations: ["blogs"], order: { createdAt: "DESC" } });
    return sendData(tags);
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    const id = req.params.id;
    const tagIns = await this.useTag.findOne(id);
    if (tagIns) {
      new ProjectController().addEventLog({
        timing: new Date(), type: EventType.removeTag, target: tagIns.name, targetId: tagIns.id
      })
      await this.useTag.remove(tagIns);
      return sendData(true);
    } else {
      return sendData(false);
    }

  }

  // 解除tag和blog之间的关联
  public async unLink(req: Request, res: Response, next: NextFunction): Promise<ResponseResult<boolean>> {
    const tagId = req.params.id;
    const blogId = req.body.id;

    ConfigManager.setConfig({
      lastUpdatedTime: Date.now()
    });

    const tag = await this.useTag.findOne(tagId, { relations: ["blogs"] });
    tag.blogs = tag.blogs.filter(blog => blog.id !== blogId);
    await this.useTag.save(tag);
    return sendData(true);
  }
}