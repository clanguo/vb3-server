import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Base from "./Base";
import { Blog } from "./Blog";

@Entity()
export default class Comment extends Base {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * 所属文章id
   */
  // @JoinColumn()
  @ManyToOne((type) => Blog, (blog) => blog.comments)
  blog: Blog;

  /**
   * 评论内容
   */
  @Column()
  @IsNotEmpty({ message: "评论内容不能为空" })
  @Type(() => String)
  comment: string;

  /**
   * 评论者的头像
   */
  @Column()
  @Type(() => String)
  avater: string = "";

  /**
   * 评论者的id
   */
  @Column()
  @Type(() => String)
  @IsNotEmpty({ message: "userId不能为空" })
  userId: string;

  /**
   * 评论者的昵称
   */
  @Column()
  @IsNotEmpty({ message: "昵称不能为空" })
  @Type(() => String)
  userName: string;

  /**
   * 是否是回复评论的评论
   * 默认是回复blog
   */
  @Column()
  @Type(() => String)
  replyUserId: string = "";

  /**
   * 回复者的id
   * 默认是回复blog
   */
  @Column()
  @Type(() => String)
  replyUserName: string = "";

  /**
   * 回复评论的id
   * 默认是回复blog
   */
  @Column()
  @Type(() => String)
  commentId: string = "";

  /**
   * 回复当前评论的评论
   */
  //  @Column()
  // comments: Comment[];

  public static transform(plainObject: object): Comment {
    return this.baseTransform(this, plainObject);
  }

}