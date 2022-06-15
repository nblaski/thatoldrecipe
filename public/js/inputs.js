// Global variables
let form = document.forms["newForm"];

let nameInput = document.getElementById("name");

// document.addEventListener('DOMContentLoaded', function() {
//     autosize(document.querySelectorAll('#story'));
// }, false);

function addField(element, input){
    // Stopping the function if the input field is empty
    if(element.previousElementSibling.value.trim() === ""){
        return false;
    }

    // Creating the div container
    let div = document.createElement("div");
    div.setAttribute("class", "field");

    let field;
    if(input.id === "stepName") {
        // Creating the input element
        field = document.createElement("textarea");
        field.setAttribute("rows", 4);
        field.setAttribute("cols", 50);
        field.setAttribute("id", "stepName");
        field.setAttribute("name", `${input.id}[]`);
    } else {
        field = document.createElement("input");
        field.setAttribute("type", "text");
        field.setAttribute("id", "ingredients");
        field.setAttribute("name", `${input.id}[]`);
    }
    

    // Creating the span  plus element

    let plus = document.createElement("span");
    plus.setAttribute("onclick", `addField(this, getElementById('${input.id}'))`);
    let plusText = document.createTextNode("+");
    plus.appendChild(plusText);

    // Creating the span minus element
    let minus = document.createElement("span");
    minus.setAttribute("onclick", "removeField(this)");
    let minusText = document.createTextNode("-");
    minus.appendChild(minusText);


    const countAll = document.querySelectorAll('#stepName').length;
    console.log(countAll);

    let stepHeader = document.createElement("h6");
    stepHeader.setAttribute("style", "width: 100%");
    stepHeader.setAttribute("id", "stepHeader");

  
    stepHeader.innerHTML = `Step ${countAll}`


    let inputDiv = document.getElementById(input.id)

    // Adding the elements to the DOM
    inputDiv.insertBefore(div, inputDiv.lastChild);
    div.appendChild(stepHeader);
    div.appendChild(field);
    div.appendChild(plus);
    div.appendChild(minus);


    // Un hiding the minus sign
    element.nextElementSibling.style.display = "block";

    // Hiding the plus sign
    element.style.display = "none";
}



function addLine(element, input){
    // Stopping the function if the input field is empty
    if(element.previousElementSibling.value.trim() === ""){
        return false;
    }
    console.log("activated");

    // Creating the div container
    let li = document.createElement("li");
    li.setAttribute("class", "fieldNew");


    let field;
    if(input.id === "stepOL") {
        // Creating the input element
        field = document.createElement("textarea");
        field.setAttribute("id", "stepNameOLtxt");
        field.setAttribute("class", "form-control");
        field.setAttribute("name", `${input.id}[]`);
    } else {
        field = document.createElement("input");
        field.setAttribute("type", "text");
        field.setAttribute("id", "ingredients");
        field.setAttribute("name", `${input.id}[]`);
    }
    

    // Creating the span  plus element

    let plus = document.createElement("span");
    plus.setAttribute("onclick", `addLine(this, getElementById('${input.id}'))`);
    let plusText = document.createTextNode("+");
    plus.appendChild(plusText);

    // Creating the span minus element
    let minus = document.createElement("span");
    minus.setAttribute("onclick", "removeField(this)");
    let minusText = document.createTextNode("-");
    minus.appendChild(minusText);

    let inputOL = document.getElementById(input.id)

    // Adding the elements to the DOM
    inputOL.insertBefore(li, inputOL.lastChild);
    li.appendChild(field);
    li.appendChild(plus);
    li.appendChild(minus);


    // Un hiding the minus sign
    element.nextElementSibling.style.display = "block";

    // Hiding the plus sign
    element.style.display = "none";
}







// Remove element function
function removeField(element){
    element.parentElement.remove();
}

// form.onsubmit = function(event){
//     // Prevent the form to communicate with the server
//     event.preventDefault();

//     //Fetch the values from the input fields
//     let data = new FormData(form);

//     // Storing the values inside an array, so we can handle them
//     // We don't want empty values
//     let notes = [];
//     data.forEach(function(value){
//         if(value !== ""){
//             notes.push(value);
//         }
//     });

//     // Output the values to the screen
//     let out = "";
//     for(let node of notes){
//         out += `
//             <p>
//                 ${notes}
//                 <span onclick="markAsDone(this)"> Mark As Done </span>
//             </p>
//         `;
//     }

//     document.querySelector(".notes").innerHTML = out;

//     // Delete all input elements except the last one
//     let inputFields = document.querySelectorAll(".field");
//     inputFields.forEach(function(element, index){
//         if(index == inputFields.length - 1){
//             element.children[0].value = "";
//         } else {
//             element.remove();
//         }
//     });
// }

// markAsDone Function
function markAsDone(element){
    element.classList.add("mark");
    element.innerHTML = "&check;";
}
