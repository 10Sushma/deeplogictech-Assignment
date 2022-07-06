var express = require("express");
const app = express();
const cheerio = require("cheerio");//For extracting the text in the HTML code of the page
const fetch = require("node-fetch");// getting data from a static website
app.use(express.json());

function getFromTime(resp) {
  fetch('https://time.com/') // Perform a fetch function to get data from the time website.  
    .then((res) => res.text())// Convert that returned data into simple HTML.
    .then((html) => { // Use that returned data and then send that data to a callback function called resp 
      resp(html);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getLatestNews(data) {
// Load the HTML data into the cheerio instance. This means that we will now be selecting the required tags from the HTML that is returned from the fetch method we defined earlier in the getFromTime method.
  const $ = cheerio.load(data);
  let latestNews = [];// Define the latestNews array. This array will store all of our titles.
  $("section")
    .children("div")
    .children("ul")
    .children(".latest-stories__item")
    .each(function (i, el) {
      latestNews.push({
        title: $(el).children("a").children("h3").text(),
        link: "https://time.com/" + $(el).children("a").attr("href"),
      });
    });
  return latestNews;
}

// Running the getFromTime function and providing the HTML data(the datavariable) in the callback arguments.
getFromTime((data) => {
  news = getLatestNews(data);
});

app.get("/", async (req, res) => {
  res.json('Welcome');
});
app.get("/getTimeStories", async (req, res) => {
    res.json(news);
  });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
