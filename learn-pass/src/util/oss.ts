import OSS, { Checkpoint } from 'ali-oss';
import { Process } from '@/type';
import downloadFile from './download';

const OSS_OPTION = {
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI4GHkJcbbT5raepiWgS7D',
  accessKeySecret: 'WSA2tLdAYAaBKaYaRdr7gIQQb9xNkA',
  bucket: 'learn-pass',
};

const HOST = `https://${OSS_OPTION.bucket}.${OSS_OPTION.region}.aliyuncs.com/`;

const client = new OSS(OSS_OPTION);

enum PATH {
  COVER = 'cover',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

interface Buffer {
  checkpoint: Checkpoint | null;
  name: string;
  file: File | null;
}

class Buffer {
  constructor() {
    this.checkpoint = null;
    this.name = '';
    this.file = null;
  }
}

let buffer = new Buffer();

const setBuffer = ({ name, checkpoint, file }: Buffer) => {
  buffer.name = name;
  buffer.checkpoint = checkpoint;
  buffer.file = file;
};

const clearBuffer = () => {
  buffer = new Buffer();
};

const getUniqueId = () => Date.now().toString(36);

const getName = (file: File, path: PATH) =>
  `${path}/${getUniqueId()}-${file.name}`;

const uploadCover = (file: File) => {
  const fileName = getName(file, PATH.COVER);
  return multipartUpload(file, fileName);
};

const uploadDocument = (file: File) => upload(file, PATH.DOCUMENT);

const uploadVideo = (file: File) => upload(file, PATH.VIDEO);

const upload = (file: File, path: PATH) => {
  clearBuffer();
  const fileName = getName(file, path);
  return (getProcess?: Process) => multipartUpload(file, fileName, getProcess);
};

const resumeUpload = () => (getProcess?: Process) => {
  if (buffer.name && buffer.file && buffer.checkpoint) {
    return multipartUpload(
      buffer.file,
      buffer.name,
      getProcess,
      buffer.checkpoint,
    );
  }
};

const multipartUpload = async (
  file: File,
  name: string,
  getProcess?: Process,
  checkpoint?: Checkpoint,
) => {
  const result = await client.multipartUpload(name, file, {
    progress(process: number, checkpoint: Checkpoint) {
      getProcess?.({
        process,
      });

      setBuffer({
        name,
        file,
        checkpoint,
      });
    },
    checkpoint: checkpoint,
  });

  clearBuffer();
  return {
    name: result.name
      .split('/')
      .splice(-1)
      .toString() as string,
    path: result.name,
  };
};

const abortMultipartUpload = () => {
  const name = buffer.checkpoint?.name;
  const uploadId = buffer.checkpoint?.uploadId;

  if (name && uploadId) {
    client.abortMultipartUpload(name, uploadId);
    clearBuffer();
  }
};

const isFileExist = async (path: string) => {
  const { objects } = await client.list({ prefix: path, 'max-keys': 1 }, {});
  return objects?.[0].name === path;
};

const download = async (path: string) => {
  if (await isFileExist(path)) {
    const response = {
      'content-disposition': `attachment;`,
    };

    const url = client.signatureUrl(path, { response });

    downloadFile(url);
  } else return Promise.reject();
};

const getUrl = (path: string) => `${HOST}${path}`;

const getVideoPreviewUrl = (path: string) =>
  client.signatureUrl(path, {
    process: 'video/snapshot,t_5000,w_160,f_png,m_fast,ar_auto',
    expires: 1000,
  });

const deleteFile = async (path: string) => {
  if (await isFileExist(path)) {
    try {
      await client.delete(path);
    } catch (e) {
      console.log('oss delete file error！', e);
    }
  }
};

export {
  uploadCover,
  uploadDocument,
  download,
  getUrl,
  uploadVideo,
  resumeUpload,
  abortMultipartUpload,
  getVideoPreviewUrl,
  deleteFile,
};
