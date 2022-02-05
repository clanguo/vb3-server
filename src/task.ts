import { createConnection, getRepository } from "typeorm";
import { Blog } from "./entity/Blog";
import { getQRCode } from "./tools/wxTools";

createConnection().then(async () => {
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
}).catch(e => {
  console.log("发生了预期之外的错误");
  console.log(e);
});