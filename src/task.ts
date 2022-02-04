import { getRepository } from "typeorm";
import { Blog } from "./entity/Blog";
import { getQRCode } from "./tools/wxTools";

export async function task() {
  const useBlog = getRepository(Blog);

  const blogs = await useBlog.find();
  for (const blog of blogs) {
    if (!blog.qrCode) {
      const qrCode = await getQRCode(blog.id);
      blog.qrCode = qrCode;
      useBlog.save(blog);
    }
  }

  console.log("success");
}