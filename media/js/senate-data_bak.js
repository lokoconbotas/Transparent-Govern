// Las variables que controlan los JSON
var datos = data.results[0].members;
var datos2 = sundata.results;

//Los 2 JSON sumados
var supertabla = datos.concat(datos2);


//Variables que contienen los valores del filtro de Array para PARTY. Se inicializan en 0
var republicans = 0;
var democrats = 0;
var independents = 0;
var rep_dem = 0;
var dem_ind = 0;
var rep_ind = 0;
var all = 0;


//Se dibuja la tabla inicial. Por defecto se cogen los datos de NYTimes
if(document.getElementById("api1").checked) {
    creartabla();
}


//Dibuja la tabla con los valores por defecto del archivo JSON de NYTimes
function creartabla(){

    //Se crea una tabla por cada uno de los miembros del JSON
    datos.forEach(function(member){

        var valorlimpio = (member.middle_name === null)? '' : member.middle_name;
        $("#tablebody")
            .append($('<tr>')
                    .append($('<td>')
                            .append($('<a>')
                                    .attr('href', member.url)
                                    .html(member.last_name + " " + valorlimpio + "," + member.first_name)))
                    .append($("<td>")
                            .append(member.party))
                    .append($("<td>")
                            .append(member.state))
                    .append($("<td>")
                            .append(member.seniority))
                    .append($("<td>")
                            .append(member.votes_with_party_pct))
                   );
    });

    //Se limpia el contenido de los tbody que no son este
    limpiartabla2();

    //Se rellena el elemento Select con los valores de la nueva tabla
    rellenarSelect1();

    //Reiniciamos el valor de datos a la matriz original del JSON para evitar los filtrados
    datos = data.results[0].members;


    //Se filtran los valores para cada caso
    //Se tienene en cuenta varios Checkboxex activos
    republicans = datos.filter(function(member){
        return member.party == "R";
    });

    democrats = datos.filter(function(member){
        return member.party == "D";
    });

    independents = datos.filter(function(member){
        return member.party == "I";
    });

    rep_dem = datos.filter(function(member){
        return member.party != ("I");
    });

    rep_ind = datos.filter(function(member){
        return member.party != ("D");
    });

    dem_ind = datos.filter(function(member){
        return member.party != ("R");
    });

}


//Crear la tabla con los datos de la API/JSON de Sunlight
function creartablaSun() {

    for(var i=0;i < datos2.length;i++)
    {
        var cleandata = (datos2[i]["middle_name"] === null)? '' : datos2[i]["middle_name"];

        var tr="<tr>";
        var td1="<td>"+datos2[i]["last_name"]+ ", "+datos2[i]["first_name"]+" "+cleandata+"</td>";
        var td2="<td class='party'>"+datos2[i]["party"]+"</td>";
        var td3="<td class='state'>"+datos2[i]["state"]+"</td>";
        var td4="<td>"+datos2[i].birthday+"</td></tr>";

        $("#tablebody2").append(tr+td1+td2+td3+td4);
    }
    limpiartabla();
    rellenarSelect2();

    //Se vuelve a reiniciar el valor de datos2 para evitar los filtrados
    datos2 = sundata.results;

    //Valor de los elementos filtrados
    republicans = datos2.filter(function(member){
        return member.party == "R";
    });

    democrats = datos2.filter(function(member){
        return member.party == "D";
    });

    independents = datos2.filter(function(member){
        return member.party == "I";
    });

    rep_dem = datos2.filter(function(member){
        return member.party != ("I");
    });

    rep_ind = datos2.filter(function(member){
        return member.party != ("D");
    });

    dem_ind = datos2.filter(function(member){
        return member.party != ("R");
    });
}


// Se crea la tabla con los elementos de ambos JSON
function crearDobleTabla(){

    for(var i=0;i < supertabla.length;i++)
    {
        var cleandata = (supertabla[i]["middle_name"] === null)? '' : supertabla[i]["middle_name"];
        var cleandata2 = (supertabla[i].birthday === undefined)? '--' : supertabla[i].birthday;
        var cleandata3 = (supertabla[i].seniority === undefined)? '--' : supertabla[i].seniority;
        var cleandata4 = (supertabla[i].votes_with_party_pct === undefined)? '--' : supertabla[i].votes_with_party_pct;

        var tr="<tr>";
        var td1="<td>"+supertabla[i]["last_name"]+ ", "+supertabla[i]["first_name"]+" "+cleandata+"</td>";
        var td2="<td class='party'>"+supertabla[i]["party"]+"</td>";
        var td3="<td class='state'>"+supertabla[i]["state"]+"</td>";
        var td4="<td class='state'>"+cleandata3+"</td>";
        var td5="<td class='state'>"+cleandata4+"%"+"</td>";
        var td6="<td>"+cleandata2+"</td></tr>";

        $("#tablebody3").append(tr+td1+td2+td3+td4+td5+td6);
    }

    limpiartablas1y2();

    rellenarSelect3();

    //De nuevo se reinician los valores iniciales de las matrices concatenadas
    supertabla = datos.concat(datos2);


    //El valor de cada elemento de filtrado
    republicans = supertabla.filter(function(member){
        return member.party == "R";
    });

    democrats = supertabla.filter(function(member){
        return member.party == "D";
    });

    independents = supertabla.filter(function(member){
        return member.party == "I";
    });

    rep_dem = supertabla.filter(function(member){
        return member.party != ("I");
    });

    rep_ind = supertabla.filter(function(member){
        return member.party != ("D");
    });

    dem_ind = supertabla.filter(function(member){
        return member.party != ("R");
    });



}


//Oculta las tablas que no interesan y deja solo la solicitada
function limpiartabla() {
    $("#senate-data").hide();
    $("#sunlight-data").show();
    $("#bigtable-data").hide();
}

function limpiartabla2() {
    $("#sunlight-data").hide();
    $("#senate-data").show();
    $("#bigtable-data").hide();
}

function limpiartablas1y2() {
    $("#sunlight-data").hide();
    $("#senate-data").hide();
    $("#bigtable-data").show();
}



//Funcion que filtra la tabla segun los valores que eljamos en el checkbox
function showMembers(members) {	
    datos = members;
    datos2 = members;
    supertabla = members;

    //A parte de filtrar vacía el contenido de las tablas para dibujar las nuevas
    if($("#senate-data").is(":visible")){
        $("#tablebody").empty();
        creartabla();
    } else if ($("#sunlight-data").is(":visible")) {
        $("#tablebody2").empty();
        creartablaSun();
    } else {
        $("#tablebody3").empty();
        crearDobleTabla();
    }
}



// retorna los members que NO incluyen la M como party. O sea todos
var all = datos.filter(function(member){
    return member.party !== "M";
})


//Detectamos si los checkbox estan true para filtrar, o false para mostrar toda la tabla
//Se tienen en cuenta varios elementos checked a la vez
$("input[name='party']").on("change" , function() {

    var R = document.getElementById("party1").checked;
    var D = document.getElementById("party2").checked;
    var I = document.getElementById("party3").checked;

    if(R && !D && !I) {
        showMembers(republicans);
    } else if (R && !D && I) {
        showMembers(rep_ind);
    } else if (R && D && !I) {
        showMembers(rep_dem);
    } else if (!R && D && !I) {
        showMembers(democrats);
    } else if (!R && D && I) {
        showMembers(dem_ind);
    } else if (!R && !D && I) {
        showMembers(independents);
    } else {
        showMembers(all);
    }
});

//Cada vez que se hace un cambio en el checkbox de las API/JSON se dibuja la tabla necesaria
$("input[name='api']").on("change", function() {

    var apiNYTchecked = document.getElementById("api1").checked;
    var apiSunchecked = document.getElementById("api2").checked;

    if(apiNYTchecked && !apiSunchecked){
        creartabla();
    } else if(!apiNYTchecked && apiSunchecked) {
        creartablaSun();
    } else if(apiNYTchecked && apiSunchecked){
        crearDobleTabla();
    }

});


//rellenar el dropdown de los estados según las tablas dibujadas
function rellenarSelect1(){
    $.each(datos,function(key,value){
        var option = $("<option />").val(value.state).text(value.state);
        $("#dropdown_states").append(option);
    });

    //eliminamos los estados duplicados
    var usedstates = {};
    $("select[name='state'] > option").each(function () {
        if(usedstates[this.text]) {
            $(this).remove();
        } else {
            usedstates[this.text] = this.value;
        }
    });

    //ordenamos el dropdown
    var sortSelect = function (select, attr, order) {
        if(attr === 'text'){

            //Se define el orden ascendente
            if(order === 'asc'){
                $(select).html($(select).children('option').sort(function (x, y) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }
            // fin asc

            //Se define el orden descendente
            if(order === 'desc'){
                $(select).html($(select).children('option').sort(function (y, x) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }// fin desc
        }
    }; 
    // Se ordenan los valores del desplegable en orden ascendente
    sortSelect('#dropdown_states', 'text', 'asc');
}


function rellenarSelect2(){
    $.each(datos2,function(key,value){

        var option = $("<option />").val(value.state).text(value.state);
        $("#dropdown_states").append(option);

    });

    //eliminamos los estados duplicados
    var usedstates = {};
    $("select[name='state'] > option").each(function () {
        if(usedstates[this.text]) {
            $(this).remove();
        } else {
            usedstates[this.text] = this.value;
        }
    });

    //ordenamos el dropdown
    var sortSelect = function (select, attr, order) {
        if(attr === 'text'){
            if(order === 'asc'){
                $(select).html($(select).children('option').sort(function (x, y) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }
            // end asc

            if(order === 'desc'){
                $(select).html($(select).children('option').sort(function (y, x) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }// end desc
        }

    }; 
    sortSelect('#dropdown_states', 'text', 'asc');
}

function rellenarSelect3(){
    $.each(supertabla,function(key,value){

        var option = $("<option />").val(value.state).text(value.state);
        $("#dropdown_states").append(option);

    });

    //eliminamos los estados duplicados
    var usedstates = {};
    $("select[name='state'] > option").each(function () {
        if(usedstates[this.text]) {
            $(this).remove();
        } else {
            usedstates[this.text] = this.value;
        }
    });

    //ordenamos el dropdown
    var sortSelect = function (select, attr, order) {
        if(attr === 'text'){
            if(order === 'asc'){
                $(select).html($(select).children('option').sort(function (x, y) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }
            // end asc

            if(order === 'desc'){
                $(select).html($(select).children('option').sort(function (y, x) {
                    return $(x).text().toUpperCase() < $(y).text().toUpperCase() ? -1 : 1;
                }));
                $(select).get(0).selectedIndex = 0;
            }// end desc
        }

    }; 
    sortSelect('#dropdown_states', 'text', 'asc');
}




//Refrescamos la tabla segun el valor elegido en el dropdown state

function refrescarTabla2() {

    datos = data.results[0].members;
    //datos = dataSunlight.results;

    var e = document.getElementById("dropdown_states");
    var selectedState = e.options[e.selectedIndex].text;

    //filtros para los STATES desde el dropdown
    var statefilter = datos.filter(function(member){
        if(selectedState.length >3){
            return member.state !== "X";
        }else{
            return member.state == selectedState;
        }
    });

    showMembers(statefilter);
}

$("#dropdown_states").on("change", refrescarTabla2);

//Detectamos si más de un checkbox está checked

//function combrobarChecked() {
//    var one = document.getElementById("party1").checked;
//    var two = document.getElementById("party2").checked;
//    var three = document.getElementById("party3").checked;
//
//    if(one && two)
//    {
//        showAlert();
//        $('#party1').prop('checked', false);
//        $('#party2').prop('checked', false);
//        return false;
//
//    } else if (one && three)
//    {
//        showAlert();
//        $('#party1').prop('checked', false);
//        $('#party3').prop('checked', false);
//
//        return false;
//
//    }else if (two && three)
//    {
//
//        showAlert();
//        $('#party2').prop('checked', false);
//        $('#party3').prop('checked', false);
//
//        return false;
//
//    }else {
//        //$("#alertbox").hide();
//        return true;
//
//    }
//}


//Muestra el alert box y el sonido
function showAlert() {

    var a = new Audio();
    a.src = "sounds/Glass.aiff";
    a.play();

    $("#alertbox").alert();
    $("#alertbox").fadeTo(1500, 500).slideUp(500, function(){
        $("#alertbox").slideUp(500);
    });   
}