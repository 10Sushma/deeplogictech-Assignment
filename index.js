const https = require("https");
const http = require("http");

let data = "";
let latest_array = [];
async function fetchData() {
  // wrapping fetching operation in promise to use async await
  return new Promise((resolve, reject) => {
    https
      .get("https://time.com/", (res) => {
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// function that calls fetch() and get the page source html as response
async function getLatestNews() {
  try {
    const data = await fetchData();
    // using regular expressions to get the pattern and filter out the latest news section from html
    const p1 =
      /(<li)\s+(class="latest-stories__item">)\s+(<a)\s+(href="\/)([0-9]+\/).*\s+(<h3)\s+(class="latest-stories__item-headline">).*\s+(<\/a>)/gm;

    let result = data.match(p1);

    for (i = 0; i <= 5; i++) {
      // separating the url part and title part from each single latest news
      let p2 = /(\/[0-9]+\/).*"/gm;
      let urlPart = result[i].match(p2);
      let url = urlPart[0];

      url = url.slice(0, url.length - 1);

      let p3 = /(>[a-zA-Z0-9]+).*</gm;
      let titlePart = result[i].match(p3);
      let title = titlePart [0];
     title =title.slice(1,title.length - 1);

      // putting each news link and title in object, and then pushing that object into the resultant array
      const NewsObject = { title:title, link: "https://time.com" + url };
      latest_array .push(NewsObject);
    }
  } catch (err) {
    console.log(err);
  }
}
getLatestNews();
const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories" && req.method === "GET") {
    res.end(JSON.stringify( latest_array));
  }
});

server.listen(3000, () => {
  console.log("server is running at port 3000");
});
// var express = require("express");
// const app = express();
// const cheerio = require("cheerio");//For extracting the text in the HTML code of the page
// const fetch = require("node-fetch");// getting data from a static website
// app.use(express.json());

// function getFromTime(resp) {
//   fetch('https://time.com/') // Perform a fetch function to get data from the time website.  
//     .then((res) => res.text())// Convert that returned data into simple HTML.
//     .then((html) => { // Use that returned data and then send that data to a callback function called resp 
//       resp(html);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function getLatestNews(data) {
// // Load the HTML data into the cheerio instance. This means that we will now be selecting the required tags from the HTML that is returned from the fetch method we defined earlier in the getFromTime method.
//   const $ = cheerio.load(data);
//   let latestNews = [];// Define the latestNews array. This array will store all of our titles.
//   $("section")
//     .children("div")
//     .children("ul")
//     .children(".latest-stories__item")
//     .each(function (i, el) {
//       latestNews.push({
//         title: $(el).children("a").children("h3").text(),
//         link: "https://time.com/" + $(el).children("a").attr("href"),
//       });
//     });
//   return latestNews;
// }

// // Running the getFromTime function and providing the HTML data(the datavariable) in the callback arguments.
// getFromTime((data) => {
//   news = getLatestNews(data);
// });

// app.get("/", async (req, res) => {
//   res.json('Welcome');
// });
// app.get("/getTimeStories", async (req, res) => {
//     res.json(news);
//   });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
