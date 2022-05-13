$(document).ready(function() {

// var dailyCal = 2000;
// var dailyPro = 125;
// var dailyFat = 56;
// var dailyCar = 250;

// $("#calGoal").text("Calories: " + dailyCal);
// $("#proGoal").text("Protein: " + dailyPro + "g");
// $("#fatGoal").text("Fat: " + dailyFat + "g");
// $("#carGoal").text("Carbs: " + dailyCar + "g");

// On Submit
// var count = 1;
// $("#submit").on("click", function(event) {

//   event.preventDefault();

//   var $header = $("<h5 class='text-left' style='font-weight: bold;'>Meal " + count++ + "</h5>");
//   $("#meals").append($header);

//   $(".food").each(function() {

//     // Assigns all values from all inputs on all dynamic rows to variables
//     var food = $(this).find(".col1").val().trim();
//     console.log('food');
//     // Appends all variables to the ID 'meals'
//     $("#meals").append("<tr class='row text-center'><td class='col-sm-3'>" + food + "</td><br>");

// console.log('#meals')
//   });

//   $("#foodName").val("");
//   $("#calories").val("");
//   $("#protein").val("");
//   $("#fat").val("");
//   $("#carbs").val("");

//   $(".dynamic").val("");
//   $(".dynamicRow").remove();

// });

// Add Row Button
var counter = 1;
$("#addRow").on("click", function() {
  var newRow = $("<tr>");
  newRow.addClass("row dynamicRow food");

  var cols = "";
  cols += '<td class="col-3"><input type="text" class="form-control dynamic" id="foodName' + counter + '"/></td>';
  cols += '<td class="col-1 dynamic"><span><input type="button" class="ibtnDel btn btn-danger" value="Delete"></span></td>';
  newRow.append(cols);
  $("#inputTable").append(newRow);
  counter++;
});

$("table.order-list").on("click", ".ibtnDel", function (event) {
  $(this).closest("tr").remove();
  counter -= 1
  $('#addrow').attr('disabled', false).prop('value', "Add Row");
});



});