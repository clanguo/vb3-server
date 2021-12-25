import { IsNotEmpty, MaxLength, maxLength } from "class-validator";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import Base from "./Base";
import { Blog } from "./Blog";


@Entity()
export class Tag extends Base {
  @PrimaryGeneratedColumn()
  id: string;

  @IsNotEmpty({ message: "标签不能为空" })
  @MaxLength(10, { message: "标签名不易过长" })
  @Column()
  name: string;

  @ManyToMany((type) => Blog, (blog) => blog.tags)
  blogs: Blog[];

  public static transform(obj: object): Tag {
    return super.baseTransform(this, obj);
  }
}