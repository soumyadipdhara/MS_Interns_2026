const sumAll = function(num1,num2) {
    let c1=0;
    let c2=0;
    if(num1<=num2){
        c1=num1;
        c2=num2;
    }
    else{
        c1=num2;
        c2=num1;
    }
    let sum=0;
    while(c1<=c2){
        sum+=c1;
        c1=c1+1;
    }
    return sum;

};

// Do not edit below this line
module.exports = sumAll;
