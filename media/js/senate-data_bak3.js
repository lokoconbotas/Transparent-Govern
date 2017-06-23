$(function(){
    
var datos = null;
    
var url = "http://congress.api.sunlightfoundation.com/legislators?chamber=senate&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b";
$.getJSON(url, data, function(result)
{
    datos = result.results;
});
    
    
    
    
    
    
// Las variables que controlan los JSON
//var datos = data.results[0].members;
//var datos2 = sundata.results;
//
////Los 2 JSON sumados
//var supertabla = datos.concat(datos2);

//Se dibuja la tabla inicial. Por defecto se cogen los datos de NYTimes
//porque se ha fijado como checked en el HTML
creartabla();

//Se enciende el listener de checkboxes
listenCheckboxes();
rellenarSelect();

//Dibuja la tabla con los valores por defecto del archivo JSON de NYTimes
function creartabla(){

    $("#tablebody").empty();

    //Se crea una tabla por cada uno de los miembros de los dos JSON
    //A partir de ahí se irán filtrando los valores
    datos.forEach(function(member){

        //Variables que limpian los campos con valores vacios o null y los cambia por "--"
        var middleNameLimpio = (member.middle_name === null)? '' : member.middle_name;
        var textoPorNull1 = (member.seniority === undefined)? '--' : member.seniority;
        var textoPorNull2 = (member.votes_with_party_pct === undefined)? '--' : member.votes_with_party_pct;
        var textoPorNull3 = (member.birthday === undefined)? '--' : member.birthday;

        //Esta variable pone un data-type para saber de que API proviene cada miembro
        var procede = procedencia();
        
        function procedencia() {
            if(member.birthday === undefined){
                return "nyt";
            } else {
                return "sun";
            }
        }

        //Se crea la tabla principal        
        $("#tablebody")
            .append($('<tr>')
                    .attr('data-party', member.party)
                    .attr('data-api', procede)
                    .attr("data-state", member.state)
                    .append($('<td>')
                            .append($('<a>')
                                    .addClass("iframe")
                                    .attr('href', member.url)
                                    .html(member.last_name + " " + middleNameLimpio + ", " + member.first_name)))
                    .append($("<td>")
                            .append(member.party))
                    .append($("<td>")
                            .append(member.state))
                    .append($("<td>")
                            .attr('data-api', procede)
                            .append(textoPorNull1))
                    .append($("<td>")
                            .attr('data-api', procede)
                            .append(textoPorNull2))
                    .append($('<td>')                    
                            .attr('data-api', procede)
                            .append(textoPorNull3))
                   );
    });
    //Aqui se filtra la tabla según los checkboxes que estén seleccionados
    // además del valor del desplegable de estado
    filtroPostTabla();
}



//Una vez creada la tabla principal se gestionan las Rows mostradas según los valores
//checkados en los checkboxes
function filtroPostTabla(){

    var valorCheckboxes = getValorCheckboxes();
    filtrarTablasPorCheckboxes(valorCheckboxes);

    var valorApis = getValorApis();
    filtrarTablasPorApis(valorApis);

    var valorStates = getValorDropdown();
    filtrarTablasPorSelect(valorStates);

    columnas();

    //    var largo = $("#tablebody tr")
    //    $("#numeros").text(largo.length);

}

//Esta funcion activa los listeners de clicks en los checkboxes
function listenCheckboxes(){

    $("#dropdown_states").on("change", function() {
        creartabla();
    });

    $('input[type=checkbox]').on('click', function() {

        creartabla();  
    });
}



function getValorCheckboxes() {

    var checked = $('input[name=party]:checked');
    var result;

    result = checked.map( function() {
        return this.value; 
    });
    return result;
}

function getValorApis() {

    var checked = $('input[name=api]:checked');
    var result;

    result = checked.map( function() {
        return this.value; 
    });
    return result;
}

function getValorDropdown(){

    var selectedState = $("select option:selected");
    var result;

    result = selectedState.map( function() {
        return this.value; 
    });
    return result;
}



function filtrarTablasPorCheckboxes(valores){

    var ningunoSeleccionado = valores.length === 0;

    var allRows = $('tbody tr'); // Get all <tr> (rows) inside the <tbody>

    if (ningunoSeleccionado) {

        allRows.show(); // Just show all rows when no type selected

    } else {

        allRows.hide();
        $.each (valores, function(index, value) {

            // Select the <tr> rows with the given data-type
            var rowsConEseValor = $('tbody tr[data-party=' + value + ']');

            rowsConEseValor.show();
        });
    }
}

function filtrarTablasPorApis(valores){

    var ningunoSeleccionado = valores.length === 0;
    var todosSeleccionados = valores.length === 2;
    var allRows = $('tbody tr'); 

    if (ningunoSeleccionado || todosSeleccionados) {

    } else {

        $.each (valores, function(index, value) {

            var rowsConEseValor = $('tbody tr[data-api=' + value + ']')
            rowsConEseValor.hide();
        });
    }
}

function filtrarTablasPorSelect(valores){

    var ningunoSeleccionado = valores[0].valueOf() === "All";
    var allRows = $('tbody tr'); 

    if (ningunoSeleccionado) {

    } else {

        $.each (valores, function(index, value) {
            var rowsConEseValor = $('tbody tr:not([data-state=' + value + '])')
            rowsConEseValor.hide();
        });
    }
}

//Muestra u oculta las columnas según las APIs seleccionadas
function columnas(){
    var api1 = $("#api1").is(":checked");
    var api2 = $("#api2").is(":checked");

    $('table tr > td:nth-child(1), table tr > th:nth-child(1)').show();
    $('table tr > td:nth-child(2), table tr > th:nth-child(2)').show();
    $('table tr > td:nth-child(3), table tr > th:nth-child(3)').show();
    $('table tr > td:nth-child(4), table tr > th:nth-child(4)').show();
    $('table tr > td:nth-child(5), table tr > th:nth-child(5)').show();
    $('table tr > td:nth-child(6), table tr > th:nth-child(6)').show();

    if(api1 && !api2){
        $('table tr > td:nth-child(6), table tr > th:nth-child(6)').hide();
    } else if(!api1 && api2){
        $('table tr > td:nth-child(4), table tr > th:nth-child(4)').hide();
        $('table tr > td:nth-child(5), table tr > th:nth-child(5)').hide();

    }
}

//rellenar el dropdown de los estados según las tablas dibujadas
function rellenarSelect(){
    // Las variables que controlan los JSON
    var datos = data.results[0].members;
    var datos2 = sundata.results;

    //Los 2 JSON sumados
    var supertabla = datos.concat(datos2); 

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

function ordenarTablas() {
    // $("#tabla1").tablesorter();
    $("#senate-data").tablesorter( {sortList: [[0,0]]} );
}

$(".iframe").colorbox({iframe:true, width:"80%", height:"80%"});

$(document).ready( function () {
    $('#senate-data').DataTable({
        paging: false,
        scrollY: 500
    });
} );

    
});