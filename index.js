const https = require("node:https");
const http = require('http');
const PORT = 3000;

let data = "";
let json_array  ='';
let latest_news=[] 

async function fetchData() {
  return new Promise((resolve, reject) => {
    https
      .get('https://time.com/', (res) => {
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function getData() {
    try {
      const data = await fetchData();
      //console.log(data)
      for (let i= (data.indexOf('latest-stories__item')); i<=data.lastIndexOf('latest-stories__item');i++){
        json_array+=data[i]
      }
    //  console.log(json_array)
      new_text=''
      final_arr=[]
      final_str=''
      new_text+=json_array.split('<li class="latest-stories__item">')
      new_arr=new_text.split(',')
      for(let i=0;i<new_arr.length;i=i+2){
        final_str +=new_arr[i]
        final_arr.push(new_arr[i])
      }
    //   console.log(final_arr)
     let  link_arr=[]
     
    for (let i in final_arr){
    let  link_str=''
            for (let j=final_arr[i].indexOf('/'); j<=final_arr[i].indexOf('/"'); j++){
              link_str+=final_arr[i][j]       
            }
       
       link_arr.push('https://time.com/'+link_str)
       link_str=''
      }
   
      let  title_arr=[]
     
      for (let i in final_arr){
      let  title_str=''
              for (let j=(final_arr[i].indexOf('e">'))+3; j<final_arr[i].indexOf('</'); j++){
                title_str+=final_arr[i][j]       
              }
         
              title_arr.push(title_str)
              title_str=''
        }
        // console.log(title_arr)  
        for (let i=0;i<=5;i++){
            let obj
           obj={title:title_arr[i],link:link_arr[i]}
            latest_news.push(obj)
           
        }
        // console.log(lastest_news)
    }

    
    catch (error) {
        console.log("following error occured while fetching:", error);
    }
}
getData()

const server = http.createServer(function (req, res) {
    if (req.url === "/getTimeStories" && req.method === "GET") {
        res.end(JSON.stringify( latest_news ));
      }
 
});
server.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}/`);
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
