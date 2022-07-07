// (A) STRIP TAGS FUNCTION
function stripTags (original) {
    // (A1) CREATE DUMMY ELEMENT & ATTACH HTML
    let ele = document.createElement("div");
    ele.innerHTML = original;
   
    // (A2) USE TEXT CONTENT TO STRIP TAGS
    return ele.textContent;
  }
   
  // (B) ORIGINAL STRING
  var str = "<p>This is a <strong>string</strong> with some <u>HTML</u> in it.</p>";
   
  // (C) "CLEANED" STRING
  var cleaned = stripTags(str);
  console.log(cleaned);