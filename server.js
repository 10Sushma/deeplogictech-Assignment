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
     let  url2=[]
     
    for (let i in final_arr){
    let  url1=''
            for (let j=final_arr[i].indexOf('/'); j<=final_arr[i].indexOf('/"'); j++){
                url1+=final_arr[i][j]       
            }
       
       url2.push('https://time.com/'+url1)
       url1=''
      }
    //   console.log(url2)
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
           obj={title:title_arr[i],link:url2[i]}
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