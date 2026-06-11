const fibonacci = function(num) {
    let first=1;
    let second=1;
for(let i=0;i<num-1;i++){
    let temp=second;
    second=second+first;
    first=temp;
}
return first;

};

// Do not edit below this line
module.exports = fibonacci;
