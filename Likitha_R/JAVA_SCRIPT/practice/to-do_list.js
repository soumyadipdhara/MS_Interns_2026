let todos=[];
function addTask(task){
  todos.push(task);
  console.log("Task added: " + task);
}
function removeTask(task){
  const index = todos.indexOf(task);
    if (index > -1) {
        todos.splice(index, 1);
        console.log("Task removed: " + task);
    } else {
        console.log("Task not found: " + task);
    }
}
function displayTasks(){
  console.log("To-Do List:");
  todos.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  });
}
addTask("Buy groceries");
addTask("Clean the house");
addTask("Finish homework");
displayTasks();