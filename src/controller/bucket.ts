import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import { readFileSync } from "fs";
import logger from "helpers/logger";
import { S3BucketOptions, S3UpdateResult } from "types";

export default class S3Utils {
  private s3!: S3Client;
  private static instance: S3Utils;
  private readonly s3Options: S3BucketOptions;

  constructor(options: S3BucketOptions) {
    this.s3Options = options;
    this.s3 = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  static getInstance(options: S3BucketOptions) {
    if (!S3Utils.instance) {
      S3Utils.instance = new S3Utils(options);
    }
    return S3Utils.instance;
  }

  isAllowedMimeType(mime: string) {
    return this.s3Options.mimeTypes.includes(mime.toString());
  }

  isLargeFile(size: number) {
    return size > this.s3Options.maxSize;
  }

  getFileName(file: any, dir: string) {
    const extIndex = file.name.lastIndexOf(".");
    if (extIndex === -1) return undefined;
    const ext = file.name.substring(extIndex + 1);
    const fileName = dir + "/" + randomBytes(16).toString("hex") + "." + ext;
    return fileName;
  }

  async uploadFile(file: any, dir: string): Promise<S3UpdateResult | null> {
    try {
      const Key = this.getFileName(file, dir);
      const Body = readFileSync(file.path);
      const params = {
        Bucket: this.s3Options.directory,
        Key,
        Body,
        ContentType: file.type,
      };
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return {
        url: `https://${this.s3Options.directory}.s3.amazonaws.com/${Key}`,
        key: Key,
      };
    } catch (err: any) {
      logger.error(err.stack);
      return null;
    }
  }

  async deleteFile(url: string, dir: string): Promise<boolean> {
    try {
      const keyIndex = url.lastIndexOf("/");
      const key = `${dir}/${url.substring(keyIndex + 1)}`;
      console.log("Delete key", key);

      const params = {
        Bucket: this.s3Options.directory,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
