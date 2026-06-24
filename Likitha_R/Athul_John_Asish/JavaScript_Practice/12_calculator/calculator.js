const add = function(num1,num2) {
	return num1+num2;
};

const subtract = function(num1,num2) {
	return num1-num2;
};

const sum = function(arr) {
	t=0;
  for(let i=0;i<arr.length;i++){
    t+=arr[i];
  }
  return t;
};

const multiply = function(arr) {
  s=1;
  if(!arr){
    return 0;
  }
  for(let i=0;i<arr.length;i++){
    s*=arr[i];
  }
  return s;
};

const power = function(num1,num2) {
	return num1 ** num2;
};

const factorial = function(num) {
	fact=1;
  if(num==0){
    return 1;
  }
  while(num>0){
    fact*=num
    num=num-1
  }
  return fact
};

// Do not edit below this line
module.exports = {
  add,
  subtract,
  sum,
  multiply,
  power,
  factorial
};
