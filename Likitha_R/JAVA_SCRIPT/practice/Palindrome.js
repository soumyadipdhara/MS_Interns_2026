function Palindrome(str) {
 let reversed = str.split("").reverse().join("");
 if (str === reversed) {
   return "Palindrome";
 } else {
   return "Not a palindrome";
 }
}

console.log(Palindrome("racecar"));
console.log(Palindrome("hello"));
