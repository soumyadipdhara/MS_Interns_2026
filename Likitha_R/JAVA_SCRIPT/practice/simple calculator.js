function calculate(a,b,op){
    if(op=='+'){
        return a+b;
    }
    else if(op=='-'){
        return a-b;
    }   
    else if(op=='*'){
        return a*b;
    }
    else if(op=='/'){
        return a/b;
    }   
}
let a=parseFloat(prompt("enter a:"));
let b=parseFloat(prompt("enter b:"));
let op=prompt("enter operator:");
console.log(calculate(a,b,op));