const hour = new Date().getHours(); 
let greet;

if (hour < 18) {
  greet= "Good day";
} else {
  greet= "Good evening";
}
console.log(greet);