document.getElementById("search-input").addEventListener("input", processSearch);
document.getElementById('compare').addEventListener('click',compare);
document.getElementById("filter_button").addEventListener("click", setFilter);
let characterList = []; // character list container
var inputs = document.querySelectorAll('.filter_input');
var attrs = ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'];
const characterTds = document.querySelectorAll('td[id*="character"]');

// Add the class "refresh content" to each selected <td> element
characterTds.forEach(td => {
   td.classList.add('refresh');
});

inputs.forEach(function(input) {
    input.addEventListener('input', function() {
        var value = parseInt(this.value);
        var min = parseInt(this.min);
        var max = parseInt(this.max);

        if (value < min) {
            this.value = min;
        } else if (value > max) {
            this.value = max;
            
        }
    });
});

function compare(){
    var checkedBoxes = document.querySelectorAll('input[name="selectBox"]:checked');
    if (checkedBoxes.length < 2) {
        alert("Please select at least 2 characters to compare");
        return;
    }
    else if (checkedBoxes.length > 2) {
        alert("Please select only 2 characters to compare");
        return;
    }
    else {
    var selectedCharacters = [];
    checkedBoxes.forEach(function(box) {
        var characterName = box.parentElement.cells[0].innerHTML;
        selectedCharacters.push(characterName);
    });
    post_names(selectedCharacters);
    post_images(selectedCharacters);
    compare_stats(selectedCharacters);
}
}


function post_images(selectedCharacters){
    var name1 = selectedCharacters[0];
    var name2 = selectedCharacters[1];
    var img1_path = characterList.find(x => x.name === name1).image_url;
    var img2_path = characterList.find(x => x.name === name2).image_url;
    // console.log(img1_path);
    // console.log(img2_path);
    var img1 = document.getElementById('img1');
    var img2 = document.getElementById('img2');
    var img1_label = document.getElementById('img_label1');
    var img2_label = document.getElementById('img_label2');
    img1_label.innerHTML = name1;
    img2_label.innerHTML = name2;
    img1.src = img1_path;
    img2.src = img2_path;
}
function compare_stats(selectedCharacters){
    var name1 = selectedCharacters[0];
    var name2 = selectedCharacters[1];
    var character1 = characterList.find(x => x.name === name1);
    var character2 = characterList.find(x => x.name === name2);
    var winner=[]
    for (attr_index in attrs){
        var attr=attrs[attr_index];
        var value1 = character1[attr];
        var value2 = character2[attr];
        if (value1 > value2){
            winner.push(0)
        }
        else if (value1 < value2){
            winner.push(1)
        }
        else{
            winner.push(2)
        }
    }
    console.log(winner);
set_winner(winner);    
}   


function set_winner(winner){
var compare_table = document.getElementById('comparison_table');
var tbody = compare_table.getElementsByTagName('tbody')[0];
var refresh = document.querySelectorAll('.refresh');
refresh.forEach(function(td) {
    td.style.backgroundColor = "white";
    td.innerHTML = "";
});

for (i=0;i<winner.length;i++){
    if(winner[i]==0){
        var cell=tbody.rows[i].cells[0];
        cell.style.backgroundColor = "green";
        cell.innerHTML = "<img src='images/tick.png' width='20' height='20'>";

}
    else if(winner[i]==1){
        var cell=tbody.rows[i].cells[2];
        cell.style.backgroundColor = "green";
        cell.innerHTML = "<img src='images/tick.png' width='20' height='20'>";
    }
    else{
        var cell1=tbody.rows[i].cells[0];
        var cell2=tbody.rows[i].cells[2];
        cell1.style.backgroundColor = "gray";
        cell2.style.backgroundColor = "gray";
        cell1.innerHTML = "Draw";
        cell2.innerHTML = "Draw";
    }
}}




function post_names(selectedCharacters){
    var name1 = selectedCharacters[0];
    var name2 = selectedCharacters[1];
    var table=document.getElementById('history');
    var tbody=table.getElementsByTagName('tbody')[0];
    var row=tbody.insertRow(-1);
    var cell1=row.insertCell(0);
    var cell2=row.insertCell(1);
    cell1.innerHTML = name1;
    cell2.innerHTML = name2;
}

function processSearch(event) {
  var searchValue = event.target.value;
  search(searchValue);
}
function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function setFilter(){
    var filterValues = {};

    attrs.forEach(function(filter) {
        var minInput = document.getElementById('min' + filter);
        var maxInput = document.getElementById('max' + filter);
        filterValues[filter] = {
            min: minInput.value ? parseInt(minInput.value) : null,
            max: maxInput.value ? parseInt(maxInput.value) : null
        };
    });
    var filteredList = filterCharacters(filterValues);
    updateTable(filteredList);
}

function filterCharacters(filterValues){
    // check(filterValues);
    var pass_list = [];
    for (i=0; i<characterList.length; i++){
        var character = characterList[i];
        var pass = true;
        for (var filter in filterValues){
            var filterValue = filterValues[filter];
            if (filterValue.min && character[filter] < filterValue.min){
                pass = false;
            }
            if (filterValue.max && character[filter] > filterValue.max){
                pass = false;
            }
        }
        if (pass){
            pass_list.push(character);
        }
    }
    return pass_list;

}
function check(filterValues){
    for (var key in filterValues){
        if (filterValues[key].min || filterValues[key].max){
            console.log(key + " min: " + filterValues[key].min + " max: " + filterValues[key].max);
        }
    }}

function search(searchValue){
    var searchResult = [];
    for (var i = 0; i < characterList.length; i++) {
        var character = characterList[i];
        
        if (character.name.toLowerCase().includes(searchValue.toLowerCase())) {
            searchResult.push(character);
        }
    }
    updateTable(searchResult);
}
function updateTable(characterList){
    var table = document.getElementById("character-table");
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    // output no match result if no character is found
    if (characterList.length === 0) {
        var row = tbody.insertRow(-1);
        var cell = row.insertCell(0);
        cell.colSpan = 8;
        cell.innerHTML = "No match found";
    }
    for (var i = 0; i < characterList.length; i++) {
        var character = characterList[i];
        var row = tbody.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        // add a select box
        var selectBox = document.createElement("input");
        selectBox.type = "checkbox";
        selectBox.name = "selectBox";
        selectBox.className = "ch_selectBox";
        selectBox.onclick = function() {
            var checkedBoxes = document.querySelectorAll('input[name="selectBox"]:checked');
            if (checkedBoxes.length >= 2) {
                var uncheckedBoxes = document.querySelectorAll('input[name="selectBox"]:not(:checked)');
                uncheckedBoxes.forEach(function(box) {
                    box.disabled = true;
                });
            } else {
                var allBoxes = document.querySelectorAll('input[name="selectBox"]');
                allBoxes.forEach(function(box) {
                    box.disabled = false;
                });
            }
        };
        row.appendChild(selectBox);

        cell1.innerHTML = character.name;
        cell2.innerHTML = character.strength;
        cell3.innerHTML = character.speed;
        cell4.innerHTML = character.skill;
        cell5.innerHTML = character.fear_factor;
        cell6.innerHTML = character.power;
        cell7.innerHTML = character.intelligence;
        cell8.innerHTML = character.wealth;

    }
}
window.onload = function() {
    getJsonObject('data.json',
        function(data) {
            characterList = data["Characters"]; // store the character list into characterList
            console.log(characterList); // print it into console (developer tools)
            console.log(characterList[0]); // print the first character object to the console 
            // here you can call methods to load or refresh the page 
            // loadCharacters() or refreshPage()
            updateTable(characterList);
        },
        function(xhr) { console.error(xhr); }
    );
}


