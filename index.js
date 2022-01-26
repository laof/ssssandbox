const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const got = require("got");
const atob = require("atob");
const re = [
  "aHR0cDovL2dpdGh1",
  "Yi5jb20vQWx2aW45",
  "OTk5L25ldy1wYWMv",
  "d2lraS9zcyVFNSU4",
  "NSU4RCVFOCVCNCVC",
  "OSVFOCVCNCVBNiVF",
  "NSU4RiVCNw=="
].join("");

function getList(text, key) {
  const values = [];
  const reg = {
    ss: /ss:\/\/(.*?)(?=[\r\n,])/g,
    ssr: /ssr:\/\/(.*?)(?=[\r\n,])/g,
    vmess: /vmess:\/\/(.*?)(?=[\r\n,])/g
  };

  if (!reg[key]) {
    return values;
  }

  const vs = text.match(reg[key]) || [];

  if (vs.length) {
    vs.forEach((item, index) => {
      values.push({
        name: key + index,
        value: item
      });
    });
  }

  return values;
}

function stringHTML(htmlString) {
  const text = [];
  const $ = cheerio.load(htmlString);
  const els = $("body *").contents();
  els.each(function () {
    const that = this;
    if (that.nodeType === 3) {
      text.push(that.data);
    }
  });
  return text.join("\n");
}

function loadData(url) {
  return new Promise(async (resolve) => {
    try {
      const response = await got(atob(url));
      const html = stringHTML(response.body)
      const ssr = getList(html, "ssr");
      const ss = getList(html, "ss");
      resolve(ssr.concat(ss));
    } catch (error) {
      resolve("error.response.body");
    }
  });
}

/* GET data */
router.get("/", function (req, res, next) {

  loadData(re)
    .then((list) => {
      const data = list.map((item) => item.value).join("\n");
      res.send(data);
    })
    .catch((e) => {
      res.send("loadData Error ...");
    });
});

const app = express();

app.use("/", router);

const listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
