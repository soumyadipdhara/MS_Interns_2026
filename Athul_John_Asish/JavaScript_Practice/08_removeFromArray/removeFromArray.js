const removeFromArray = function(arr,key) {
a=[];
let count=0;
for(let i=0;i<arr.length;i++){
    if(arr[i]==key){
        continue
    }
    else{
        a[count]=arr[i];
        count=count+1;
    }
}
return a;
};

// Do not edit below this line
module.exports = removeFromArray;
