import got from 'got';

const BILIBILI_API = 'https://api.bilibili.com';

const reqApi = got.extend({
  prefixUrl: BILIBILI_API,
  responseType: 'json',
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.Referer = 'https://www.bilibili.com/';
        options.headers['User-Agent'] =
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
        options.headers.Connection = 'keep-alive';
        options.headers.Origin = 'https://message.bilibili.com';
      },
    ],
  },
});

const reqUserSpace = async function (id: string): Promise<Record<string, any>> {
  const res = await reqApi.get('x/web-interface/card', {
    searchParams: {
      mid: id,
    },
    headers: {
      Referer: 'https://space.bilibili.com/',
    },
  });

  return res.body as any;
};

let start = new Date().toLocaleString();
let totalReduce = 0;
let fansCache: number = 0;
let lost: number = 0;
const renderUserVideos = async function (id: string) {
  const a = await reqUserSpace(id);
  const b = a.data;
  if (b.follower) {
    if (fansCache) {
      totalReduce += lost;
      lost = fansCache - b.follower;
    }
    fansCache = b.follower;
  }
  console.log(
    '开始时间:',
    start,
    '当前时间:',
    new Date().toLocaleString(),
    '当前粉丝数:',
    fansCache,
    '每秒粉丝数减少',
    Math.round(lost / 5),
    '掉粉总数',
    totalReduce,
    '-------每5秒统计下',
  );
};

setInterval(async () => {
  await renderUserVideos('777536');
}, 5000);
