$(function(){
    
//Variables necesarias que recibirásn su valor en sucesivas funciones
var datos = null;       //recibirá el valor del Json 1
var datos2 = null;      //recibirá el valor del Json 2
var mainObject = null;

//Las url de los Json. El primero es local y el segundo es remoto
var url = "media/js/NYT-congress-113-senate.json";
var url2 = "http://congress.api.sunlightfoundation.com/legislators?chamber=senate&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b";
var url3 = "media/js/sunlight-senate.json";

addListeners();
getFirstJSON();

function getFirstJSON(){
    //Valores por defecto de todas las llamadas Ajax
    $.ajaxSetup({
        beforeSend:function(){
        }
    });

    //Efectuamos la llamada a cada uno de los Json
    $.ajax({
        url: url,
        dataType: "json",
        success: function(data){    //Dentro de esta funcion deben ejecutarse las funciones que necesitemos que usen los datos del API

            datos = data.results[0].members;

            goToNextJson();

        }}); 
}

function goToNextJson(){

    $.ajax({
        url: url3,
        dataType: "json",
        complete:function(){

        },
        success: function(data){            //Al requerir un tiempo de procesado deben llamarse dentro de esta función

            datos2 = data.results;

            buildTable(setObject());
            $('#modal').hide();
            $('#fade').hide();

        },
        error: function(){
            console.log("error to get first ajax");
            $.ajax({
                url: url3,
                dataType: "json",
                success: function(data){            //Al requerir un tiempo de procesado deben llamarse dentro de esta función

                    datos2 = data.results;
                    buildTable(setObject());
                    $('#modal').hide();
                    $('#fade').hide();
                },
                complete:function(){
                }
            });
        }
    });
}

function setObject(){

    var cleanArray = [];

    var array = datos.concat(datos2);

    fillStates(array);

    $.each(array, function(key, value){

        var person = {};

        var fullName = (value.middle_name === null)? value.first_name + ", " + value.last_name : value.first_name + " " + value.middle_name + ", " + value.last_name;
        var seniority = (value.seniority === undefined)? '--' : value.seniority;
        var votes = (value.votes_with_party_pct === undefined)? '--' : value.votes_with_party_pct;
        var birthday = (value.birthday === undefined) ? '--' : value.birthday;
        var api = (value.birthday === undefined)? 'NYT' : 'SL';

        person.name = fullName;
        person.party = value.party;
        person.state = value.state;
        person.seniority = seniority;
        person.votes = votes;
        person.birthday = birthday;
        person.api = api;

        cleanArray.push(person);

    });

    mainObject = cleanArray;

    return cleanArray;
}

function buildTable(){

    var array = mainObject;

    $("#tablebody").empty();

    $.each(array, function(key, value){

        if(isVisible(value)){

            var row = document.createElement("tr");

            for ( key in value){
                row.insertCell().innerHTML = value[key];
            }

            $("#tablebody").append(row);
        }
    });

    checkColumns();
}

function checboxArray(){

    var filterArray = [];
    var rep = $("#party1").prop("checked");
    var dem = $("#party2").prop("checked");
    var ind = $("#party3").prop("checked");

    if(rep){
        filterArray.push("R");
    }

    if(dem){
        filterArray.push("D");
    }

    if(ind){
        filterArray.push("I");
    }

    if(!rep && !ind && !dem){
        filterArray.push("R");
        filterArray.push("D");
        filterArray.push("I");
    }
    return filterArray;
}

function apiArray(){
    var filterArray = [];
    var api1 = $("#api1").prop("checked");
    var api2 = $("#api2").prop("checked");

    if(api1) {
        filterArray.push("NYT");
    }
    if(api2){
        filterArray.push("SL");
    }

    if(!api1 && !api2){
        filterArray.push("NYT");
        filterArray.push("SL");
    }

    return filterArray;
}

function checkColumns(){

    var api1 = $("#api1").prop("checked");
    var api2 = $("#api2").prop("checked");
    
    $('td:nth-child(7),th:nth-child(7)').hide();

    if(api1){
        $('td:nth-child(6),th:nth-child(6)').hide();
        $('td:nth-child(5),th:nth-child(5)').show(); 
        $('td:nth-child(4),th:nth-child(4)').show();
    }

    if(api2){
        $('td:nth-child(6),th:nth-child(6)').show(); 
        $('td:nth-child(5),th:nth-child(5)').hide(); 
        $('td:nth-child(4),th:nth-child(4)').hide(); 
    }

    if(api1 && api2 || !api1 && !api2){
        $('td:nth-child(5),th:nth-child(5)').show();
        $('td:nth-child(6),th:nth-child(6)').show(); 
        $('td:nth-child(4),th:nth-child(4)').show();
    }
}

function isVisible(person){

    var state = $("#dropdown_states").val();

    var filterParty = (checboxArray().indexOf(person.party) != -1)? true : false;

    var apiFilter = (apiArray().indexOf(person.api) != -1)?true : false;

    var filterState = (person.state == state || state == "All")?true : false;

    return filterParty && apiFilter && filterState;
}

function fillStates(array){

    var allStates = [];

    $.each(array,function(key,value){
        if(allStates.indexOf(value.state) == -1){
            allStates.push(value.state);
        }
    });

    allStates.sort();

    $.each(allStates, function(key, value){
        var option = $("<option />").val(value).text(value);
        $("#dropdown_states").append(option);
    })
}

function addListeners(){

    $("#party1").click(function(){
        buildTable(setObject());
    });

    $("#party2").click(function(){
        buildTable(setObject());
    });

    $("#party3").click(function(){
        buildTable(setObject());
    });

    $("#api1").click(function(){
        buildTable(setObject());
    });

    $("#api2").click(function(){
        buildTable(setObject());
    });

    $("#dropdown_states").change(function(){
        buildTable(setObject());
    })
}
    
});