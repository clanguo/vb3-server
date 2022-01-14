import { ReadStream } from "fs";
import * as qiniu from "qiniu";

const accessKey = "JmMiB72wy2jCYW06hrYixFxfSyM2xVt3nDrLX1Ep";
const secretKey = "rNh1PqEGRqUyVnSSk4R06HsmsnIXiGitDCHP764Y";

const bucket = "vb3";

// 定义鉴权对象mac
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 配置参数
const options = {
  scope: bucket,
};

const bucketManager = new qiniu.rs.BucketManager(mac, {});
const publicBucketDomain = "http://static.clanguo.top";

export function putReadableStream(key: string, readableStream: ReadStream, config: qiniu.conf.Config = {}): Promise<string | void> {
  return new Promise((resolve, reject) => {
    // 上传凭证
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    // 创建数据流上传
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    formUploader.putStream(uploadToken, key, readableStream, putExtra, function (err, body, info) {
      if (err) {
        return reject(err);
      }

      if (info.statusCode === 200) {
        // 访问地址过期时间
        // const deadline = parseInt((Date.now() / 1000).toString()) + 3600;
        const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
        return resolve(publicDownloadUrl);
      } else {
        return reject({ body, info });
      }
    });
  });
}