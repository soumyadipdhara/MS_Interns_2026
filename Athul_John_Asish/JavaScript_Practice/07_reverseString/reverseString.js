const reverseString = function(string) {
let s=""
for(let i=string.length-1;i>=0;i--){
   s+=string[i] 
}
return s
};

// Do not edit below this line
module.exports = reverseString;
