// Global variables
let form = document.forms["newForm"];

let nameInput = document.getElementById("name");




function addLine(element, input){
    let inputOL = document.getElementById(input.id)
    let olIngredients = document.getElementById(input.id);
    // Stopping the function if the input field is empty
    if(element.previousElementSibling.value.trim() === ""){
        // inputIngredients = document.getElementById("ingredients_error");
        // inputIngredients.setAttribute("style", "display: block");
        return false;
    }
    console.log("activated");



    // const last = document.getElementsByClassName("form-control ingGridArea");
    // const lastNum = last.length;
    // const lastElement = last.item(lastNum - 1);
    // console.log(lastElement + " " + lastNum);
    // console.log(lastElement);

    // // remove warning function
    // function removeWarning() {
    //     input = document.getElementById(this.id + "_error");
    //     input.setAttribute("style", "display: none");
    // }
    // // remove warning
    // lastElement.onkeyup = removeWarning;




    // Creating the li container
    let li = document.createElement("li");
    li.setAttribute("class", "liStepNum");

    // Creating the div container
    let div = document.createElement("div");
    div.setAttribute("class", "grow-wrap");

    // Creating the li ingredient container
    let liIng = document.createElement("li")

    // Creating the div ingredient container
    let divIng = document.createElement("div");
    divIng.setAttribute("class", "ingredients");


    let field;
    let fieldTitle;
    let ingredient;
    let amount;
    if(input.id === "stepName") {
        fieldTitle = document.createElement("textarea");
        fieldTitle.setAttribute("class", "form-control stepGridAreaTitle");
        fieldTitle.setAttribute("name", `${input.id}Title[]`);
        fieldTitle.setAttribute("id", "stepTitleTextarea")
        fieldTitle.setAttribute("onInput", "this.parentNode.dataset.replicatedValue = this.value");
        fieldTitle.setAttribute("placeholder", "Step title...");

        // Creating the input element
        field = document.createElement("textarea");
        // field.setAttribute("id", "stepName");
        field.setAttribute("id", "stepTextarea")
        field.setAttribute("class", "form-control stepGridArea");
        field.setAttribute("name", `${input.id}[]`);
        field.setAttribute("onInput", "this.parentNode.dataset.replicatedValue = this.value");
        field.setAttribute("placeholder", "Step instructions...");

    } else {
        ingredient = document.createElement("input");
        ingredient.setAttribute("type", "text");
        ingredient.setAttribute("name", "ingredients[]");
        ingredient.setAttribute("class", "form-control ingGridArea");
        amount = document.createElement("input");
        amount.setAttribute("type", "text");
        amount.setAttribute("name", "amount[]");
        amount.setAttribute("class", "form-control amountGridArea");
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

   
    

    // Adding the elements to the DOM
    if(input.id === "stepName") {
        console.log(input.id);
        inputOL.insertBefore(li, inputOL.lastChild);
        div.appendChild(field);
        div.appendChild(fieldTitle);
        div.appendChild(plus);
        div.appendChild(minus);
        li.appendChild(div);
    } else {
        console.log(input.id);
        olIngredients.insertBefore(liIng, olIngredients.lastChild);
        divIng.appendChild(ingredient);
        divIng.appendChild(amount);
        divIng.appendChild(plus);
        divIng.appendChild(minus);
        liIng.appendChild(divIng)
    }


    // Un hiding the minus sign
    element.nextElementSibling.style.display = "block";

    // Hiding the plus sign
    element.style.display = "none";
}







// Remove element function
function removeField(element){
    console.log(element);
    element.closest("li").remove();
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
// function markAsDone(element){
//     element.classList.add("mark");
//     element.innerHTML = "&check;";
// }



// TEST ---------------------------------------------------------------------------- 

// ///======Clone method
// $(document).ready(function () {
//     $("body").on("click", ".add_node_btn_frm_field", function (e) {
//       var index = $(e.target).closest(".form_field_outer").find(".form_field_outer_row").length + 1;
//       var cloned_el = $(e.target).closest(".form_field_outer_row").clone(true);
  
//       $(e.target).closest(".form_field_outer").last().append(cloned_el).find(".remove_node_btn_frm_field:not(:first)").prop("disabled", false);
  
//       $(e.target).closest(".form_field_outer").find(".remove_node_btn_frm_field").first().prop("disabled", true);
  
//       //change id
//       $(e.target)
//         .closest(".form_field_outer")
//         .find(".form_field_outer_row")
//         .last()
//         .find("input[type='text']")
//         .attr("id", "mobileb_no_" + index);
  
//       $(e.target)
//         .closest(".form_field_outer")
//         .find(".form_field_outer_row")
//         .last()
//         .find("select")
//         .attr("id", "no_type_" + index);
  
//       console.log(cloned_el);
//       //count++;
//     });
//   });
  
//   $(document).ready(function(){ $("body").on("click",".add_new_frm_field_btn", function (){ console.log("clicked"); var index = $(".form_field_outer").find(".form_field_outer_row").length + 1; $(".form_field_outer").append(`
//   <div class="row form_field_outer_row">
//     <div class="form-group col-md-6">
//       <input type="text" class="form-control w_90" name="stepNameTitle[]" id="mobileb_no_${index}" placeholder="Enter title." />
//     </div>
//     <div class="form-group col-md-4">
//       <select name="no_type[]" id="no_type_${index}" class="form-control">
//         <option>--Select type--</option>
//         <option>Personal No.</option>
//         <option>Company No.</option>
//         <option>Parents No.</option>
//       </select>
//     </div>
//     <div class="form-group col-md-2 add_del_btn_outer">
//       <button class="btn_round add_node_btn_frm_field" title="Copy or clone this row">
//         <i class="fas fa-copy"></i>
//       </button>
  
//       <button class="btn_round remove_node_btn_frm_field" disabled>
//         <i class="fas fa-trash-alt"></i>
//       </button>
//     </div>
//   </div>
//   `); $(".form_field_outer").find(".remove_node_btn_frm_field:not(:first)").prop("disabled", false); $(".form_field_outer").find(".remove_node_btn_frm_field").first().prop("disabled", true); }); });
  
  
  
//   $(document).ready(function () {
//     //===== delete the form fieed row
//     $("body").on("click", ".remove_node_btn_frm_field", function () {
//       $(this).closest(".form_field_outer_row").remove();
//       console.log("success");
//     });
//   });
  
  
  
  
  
//   // TEST ---------------------------------------------------------------------------- 
  
  
  