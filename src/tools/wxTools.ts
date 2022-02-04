import axios from "axios";
import { putBuffer } from "./qiniuTool";

export async function getQRCode(id: string): Promise<string> {
  const tokenRes = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx78c4c8a73b3108c0&secret=a50ae6833f32faa85615cfaf133281dd");
  if (tokenRes.data.access_token) {
    const bufferRes = await axios.request({
      url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${tokenRes.data.access_token}`,
      method: "POST",
      data: {
        "path": `packageA/pages/blog/index?id=${id}`,
        "width": 150
      },
      responseType: "arraybuffer"
    });
    const randomCode = Math.random().toString(16).slice(2, 6);
    return await putBuffer(`qr_${id}_${randomCode}.jpeg`, bufferRes.data);
  } else {
    console.log(tokenRes.data);
    throw new Error("未知错误，请处理");
  }
}