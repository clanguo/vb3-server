import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Base from "./Base";
import { Blog } from "./Blog";

@Entity()
export class BlogContent extends Base {
  @PrimaryGeneratedColumn()
  id: string;

  @IsNotEmpty({message: "内容必须填写"})
  @Column("text")
  @Type(() => String)
  content: string

  @OneToOne((type) => Blog, (blog) => blog.content)
  blog: Blog

  public static transform(obj: object): BlogContent {
    return super.baseTransform(this, obj);
  }

  public constructor(content: string = "") {
    super();
    this.content = content;
  }
}