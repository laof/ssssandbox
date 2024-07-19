const express = require("express");
const http = require("http");
const https = require("https");
const router = express.Router();
const port = 8080;
function ggg(req) {
  return req.query.target;
}

function getHttp(url) {
  return url.startsWith("http://") ? http : https;
}

function test(urlString, fn) {
  const parsedUrl = new URL(urlString);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  };

  const req = getHttp(urlString).request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      fn(data);
    });
  });

  req.on("error", (error) => {
    console.error("請求出錯", error);
  });

  req.end();
}

function download(fileUrl, res) {
  getHttp(fileUrl).get(fileUrl, (downloadRes) => {
    // 设置响应头，指定文件名
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    // 将下载的数据传递给响应对象
    downloadRes.pipe(res);
  });
}

/* GET data */
router.get("/get", function (req, res, next) {
  const aa = ggg(req);

  if (aa) {
    test(aa, function (data) {
      res.send(data);
    });
  } else {
    res.send("get: no target");
  }
});

router.get("/download", function (req, res, next) {
  const aa = ggg(req);
  if (aa) {
    download(aa, res);
  } else {
    res.send("download: no target");
  }
});

const aaa = `
<script>
fetch("/get?target=https://laof.github.io/get-nodes-test-app/json/data.json")
.then((response) => response.json())
.then((data) => {
  return fetch("http://localhost:34560", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 设置请求头为 JSON 格式
    },
    body: JSON.stringify({target:data}), // 将数据转换为 JSON 字符串作为请求体
  });
})
.then(() =>{
  window.close()
  document.body.innerHTML="执行完毕，请关闭"
})
.catch((error) => {
  window.close()
  document.body.innerHTML="执行失败，请稍后重试"
});
</script>
`;

/* GET data */
router.get("/", function (req, res, next) {
  res.send(`
  
  <div>请等待...</div>
  ${aaa}
  
  `);
});

const bbb = `
<script>
let ccc = ""
fetch("/get?target=https://laof.github.io/get-nodes-test-app/json/ssr.txt")
.then((response) => response.text())
.then((data) => {
  const button = document.createElement('button');
  button.style.padding='150px'
  button.innerText = '点击我';
  ccc = data;
  button.addEventListener('click', function() {
     copy();
  });
 
  // 将按钮追加到body里面
  document.body.appendChild(button);
})

function copy() {
  navigator.clipboard
    .writeText(ccc)
    .then(() => alert(' copying ok'))
}
</script>
`; 

/* GET data */
router.get("/app", function (req, res, next) {
  res.send(`
  
  <div>请等待...</div>
  ${bbb}
  
  `);
});

/* GET data */
router.get("/json", function (req, res, next) {
  res.send({data:34});
});

const app = express();

app.use("/", router);

const listener = app.listen(port, function () {
  console.log("Listening on port " + listener.address().port);
});
