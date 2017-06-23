//Funciones principales para rellenar las tablas de cada web
//Cada vez que cambiamos de página se encarga de coger los valores
//del JSON declarado en los HTML tags de cada web
//La variable que controla los objetos JSON
//Cada vez que se recarga una web se refrescan los datos según el
//JSON declarado en dicha página

$(function() {
    
    //getMembers();
    start(data.results[0].members);
    
});

function start(datos) {
    var page = window.location.href.split("/")[3];


    // El objeto JSON requerido por el ejercicio
    var statistics = {
        "numRepublicans": calcRebuplicans(datos),
        "numDemocrats": calDemocrats(datos),
        "numIndependents": calcInd(datos),
        "averageVotesRepublicans": calcAverageVotesRepublican(datos),
        "averageVotesDemocrats": calcAverageVotesDemocrats(datos),
        "averageVotesIndependents": calcAverageVotesIndependent(datos),
        "masVotan": nameOfMaxVotes(datos),
        "menosVotan": nameOfMinVotes(datos),
        "masVotosPerdidos": maxVotesMissed(datos),
        "menosVotosPerdidos": minVotesMissed(datos)

    }
    
    loadChart(statistics);
    
    if (page == 'house-party-loyalty-stats.html') {
        SetAllTablesHousePartyLoyal(statistics, datos);
    }
    
    if (page == 'senate-party-loyalty-stats.html') {
        SetAllTables(statistics, datos);
    }
    
    ordenarTablas();

}

function getMembers() {
    var url = "http://congress.api.sunlightfoundation.com/legislators?chamber=house&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b";
    
    $.ajax({url: url, success: function(result){
        //start(result.results);
    }});
}


//Las siguientes 4 funciones se llaman desde el elemento "body onload" de cada web
// <body onload="myFunction()">

//Fill all tables of Senate party loyalty
function SetAllTables(statistics, datos){
    SetValuesToTable1(statistics);
    SetValuesToTable2(datos);
    SetValuesToTable3(datos);
}


//Fill the tables of Senate Attendance
function SetAllTablesSenateAttendance() {
    SetValuesToTable1();
    SetTableLeastEngadged();
    SetTableMostEngadged();
}


//Fill the tables of House Attendance
function SetAllTablesHouseAttendance() {
    SetValuesToTable1();
    SetTableLeastEngadgedH();
    SetTableMostEngadgedH();
}


//Fill all tables of Senate party loyalty
function SetAllTablesHousePartyLoyal(statistics, datos){
    SetValuesToTable1(statistics);
    SetValuesLeastLoyalH(datos);
    SetValuesMostLoyalH(datos);
}







//calcula los republicanos filtrando la array inicial del JSON original
function calcRebuplicans (datos) {
    var repInSenate = datos.filter(function(members){
        return members.party == "R";
    });
    return repInSenate.length; //Al poner .length devuelve un número
}


//calcula los democratas filtrando la array inicial del JSON original
function calDemocrats (datos) {
    var demInSenate = datos.filter(function(members) {
        return members.party == "D";
    });
    return demInSenate.length;
}


//calcula los independientes filtrando la array inicial del JSON original
function calcInd (datos) {
    var indInSenate = datos.filter(function(members){
        return members.party == "I";
    });
    return indInSenate.length;
}


//CAlcula la media de votos de los Republicanos
function calcAverageVotesRepublican(datos) {

    var repInSenate = datos.filter(function(members){
        return members.party == "R";
    });
    
    var suma = 0;
    for (var i = 0; i < repInSenate.length; i++) {
        
        //Son todos los porcentajes de votos sumados
        suma += Number(repInSenate[i].votes_with_party_pct); 
    }
    //Se divide el total entre el número de republicanos y se fija a 2 el número de decimales
    return (suma / repInSenate.length).toFixed(2);
}


//Calcula la media de votos de los Democratas
function calcAverageVotesDemocrats(datos) {

    var demInSenate = datos.filter(function(members){
        return members.party == "D";
    });
    var suma = 0;
    for (var i = 0; i < demInSenate.length; i++) {
        suma += Number(demInSenate[i].votes_with_party_pct);
    }

    return (suma / demInSenate.length).toFixed(2);
}


//Calcula la media de votos de los Independientes
function calcAverageVotesIndependent(datos) {
    var indInSenate = datos.filter(function(memebers){
        return memebers.party == "I";
    });
    var suma = 0;
    for (var i = 0; i < indInSenate.length; i++) {
        suma += Number(indInSenate[i].votes_with_party_pct);
    }
    return (suma / indInSenate.length).toFixed(2);
}



//Coloca los valores en las celdas de la Tabla pequeña
function SetValuesToTable1(statistics) {

    //Republicans
    $("#numR").html(statistics.numRepublicans);
    $("#avgR").html(statistics.averageVotesRepublicans);

    //Democrats
    $("#numD").html(statistics.numDemocrats);
    $("#avgD").html(statistics.averageVotesDemocrats);

    //Independents
    $("#numI").html(statistics.numIndependents);
    $("#avgI").html(statistics.averageVotesIndependents);
}



//Conseguir una Array con los valores mínimos para llegar al 10%
function nameOfMinVotes(datos){
    
   for (var i = 0; i <= datos.length; i = i+ 0.1) {
       
       //Buscamos en la matriz filtrada por porcentaje de inicio 0%
       var max = datos.filter(function(members){
        return members.votes_with_party_pct <= i;
        });
       //Si el tamaño de la matriz filtrada es igual o superior al 10% de la
       // matriz original, rompemos el FOR
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


// Rellenar la tabla con los que menos han votado
function SetValuesToTable2(){

    var table = nameOfMinVotes();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].total_votes+"</td>";
        var td3="<td>"+table[i].votes_with_party_pct+"</td></tr>";

        $("#minVotesTable").append(tr+td1+td2+td3);
    }
}



//Conseguir una Array con los valores máximos que sumen el 10% o más
//Usamos el mismo procedimiento que en la de votos mínimos pero a la inversa
function nameOfMaxVotes(datos){
    
   for (var i = 100; i <= datos.length; i = i- 0.1) {
       
       var max = datos.filter(function(members){
        return members.votes_with_party_pct >= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


// Crear y rellenar la tabla con los que más han votado
function SetValuesToTable3(){

    var table = nameOfMaxVotes();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].total_votes+"</td>";
        var td3="<td>"+table[i].votes_with_party_pct+"</td></tr>";

        $("#maxVotesTable").append(tr+td1+td2+td3);
    }
}







//Here starts the Senate Attendance Stats


//Encontramos los menos votados.
function minVotesMissed(datos){
    
   for (var i = 0; i <= datos.length; i = i+ 0.1) {
       
       var max = datos.filter(function(members){
        return members.missed_votes_pct <= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}

function SetTableLeastEngadged() {

    var table = minVotesMissed();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].missed_votes+"</td>";
        var td3="<td>"+table[i].missed_votes_pct+"</td></tr>";

        $("#maxvotesmissed").append(tr+td1+td2+td3);
    }

}


// Lo mismo que antes pero para los Max
function maxVotesMissed(datos){
    
   for (var i =100; i <= datos.length; i = i- 0.1) {
       
       var max = datos.filter(function(members){
        return members.missed_votes_pct >= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


function SetTableMostEngadged() {

    var table = maxVotesMissed();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].missed_votes+"</td>";
        var td3="<td>"+table[i].missed_votes_pct+"</td></tr>";

        $("#minvotesmissed").append(tr+td1+td2+td3);
    }
}






//Here starts the House Attendance Stats

function minVotesMissedH(datos) {
    
   for (var i = 0; i <= datos.length; i = i+ 0.1) {
       
       var max = datos.filter(function(members){
        return members.missed_votes_pct <= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}



function SetTableLeastEngadgedH() {

    var table = minVotesMissedH();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].missed_votes+"</td>";
        var td3="<td>"+table[i].missed_votes_pct+"</td></tr>";

        $("#maxvotesmissed").append(tr+td1+td2+td3);
    }

}


// Lo mismo que antes pero para los Max
function maxVotesMissedH(datos) {
    
   for (var i =100; i <= datos.length; i = i- 0.1) {
       
       var max = datos.filter(function(members){
        return members.missed_votes_pct >= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


function SetTableMostEngadgedH() {

    var table = maxVotesMissedH();

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].missed_votes+"</td>";
        var td3="<td>"+table[i].missed_votes_pct+"</td></tr>";

        $("#minvotesmissed").append(tr+td1+td2+td3);
    }
}









//Here Starts the House Party Loyalty Stats


function minVotesH (datos){
    
   for (var i = 0; i <= datos.length; i = i+ 0.1) {
       
       var max = datos.filter(function(members){
        return members.votes_with_party_pct <= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


// Rellenar la tabla con los que menos han votado
function SetValuesLeastLoyalH(datos){

    var table = minVotesH(datos);

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].total_votes+"</td>";
        var td3="<td>"+table[i].votes_with_party_pct+"</td></tr>";

        $("#maxVotesTable").append(tr+td1+td2+td3);
    }
}


//Conseguir una Array con los valores máximos que sumen el 10%
function maxVotesH (datos){
    
   for (var i = 100; i <= datos.length; i = i- 0.1) {
       
       var max = datos.filter(function(members){
        return members.votes_with_party_pct >= i;
    });
       if(max.length >= datos.length*0.1) {
           return max;
           break;
       }
   }  
}


// Rellenar la tabla con los que más han votado
function SetValuesMostLoyalH(datos){

    var table = maxVotesH(datos);

    for(var i=0;i < table.length;i++)
    {
        var cleandata = (table[i].middle_name === null)? '' : table[i].middle_name;

        var tr="<tr>";
        var td1="<td><a href="+table[i].url+">"+table[i].last_name+ ", "+table[i].first_name+" "+cleandata+"</td>";
        var td2="<td>"+table[i].total_votes+"</td>";
        var td3="<td>"+table[i].votes_with_party_pct+"</td></tr>";

        $("#minVotesTable").append(tr+td1+td2+td3);
    }
}








//Grafico Chart
function loadChart(statistics) {
    
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ["Repuplican", "Democrat", "Independent"],
            datasets: [{
                label: '# of Reps',
                data: [statistics.numRepublicans, statistics.numDemocrats, statistics.numIndependents],
                backgroundColor: [
                    'rgba(219, 17, 56, 0.8)',
                    'rgba(219, 17, 56, 0.6)',
                    'rgba(219, 17, 56, 0.3)'
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}




//Sort tables with sorttable
function ordenarTablas() {
    // $("#tabla1").tablesorter();
    $("#tabla1").tablesorter( {sortList: [[2,1]]} );
    $("#tabla2").tablesorter( {sortList: [[2,1]]} );
}




































