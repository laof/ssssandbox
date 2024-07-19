const got = require("got");
const atob = require("atob");
var http = require("https");
const cheerio = require("cheerio");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const re = [
  "aHR0cDovL2dpdGh1",
  "Yi5jb20vQWx2aW45",
  "OTk5L25ldy1wYWMv",
  "d2lraS9zcyVFNSU4",
  "NSU4RCVFOCVCNCVC",
  "OSVFOCVCNCVBNiVF",
  "NSU4RiVCNw==",
].join("");

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<p>ss://<a href="mailto:YWVzLTI1Ni1nY206ZG9uZ3RhaXdhbmcuY29t@www.dongtaiwang4.com">YWVzLTI1Ni1nY206ZG9uZ3RhaXdhbmcuY29t@www.dongtaiwang4.com</a>:33333#www.dongtaiwang.com%20%E6%B4%9B%E6%9D%89%E7%9F%B6</p>
</body>
</html>
`;

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
};

httpGet(
  "https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7"
).then((res) => {
  console.log(res);
});

// const $ = cheerio.load(html);
// const els = $("body p").contents();
// els.each(function () {
//   const that = this;
//   if (
//     this.data &&
//     (this.data.startsWith("ssr://") || that.data.startsWith("ss://"))
//   ) {
//     cheerio.html(this);
//   }
// });
