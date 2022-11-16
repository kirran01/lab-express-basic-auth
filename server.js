var d = new Date();
var curr_hour = d.getHours();
var curr_min = d.getMinutes();
var curr_sec=d.getSeconds()
let time=`${curr_hour}:${curr_min}:${curr_sec}`
console.log("the only time is now", time);
const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server up on ${PORT}`);
});
