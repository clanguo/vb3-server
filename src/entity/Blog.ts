import { Type } from "class-transformer";
import { IsNotEmpty, IsUrl, MaxLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import { BlogContent } from "./BlogContent";
import Category from "./Category";
import Comment from "./Comment";
import { Tag } from "./Tag";

@Entity()
export class Blog extends Base {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNotEmpty({ message: "标题不能为空" })
  @Type(() => String)
  title: string;

  @Column()
  @Type(() => String)
  poster: string = "";

  @Column()
  @MaxLength(50, { message: "描述不易过长" })
  @Type(() => String)
  description: string = "";

  @Column()
  @Type(() => String)
  qrCode: string = "";

  // @IsNotEmpty({message: "内容必须填写"})
  @JoinColumn()
  @OneToOne((type) => BlogContent, (content) => content.blog)
  content: BlogContent

  @JoinTable()
  @ManyToMany((type) => Tag, (tag) => tag.blogs)
  tags: Tag[];

  @ManyToOne((type) => Category, (category) => category.blogs)
  category: Category;

  // @JoinColumn()
  @OneToMany((type) => Comment, (comment) => comment.blog)
  comments: Comment[];

  public static transform(obj: object): Blog {
    return super.baseTransform(this, obj);
  }
}