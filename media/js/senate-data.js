//Se incorpora todo el documento dentro de una funcion de Jquery para conseguir que se ejecute al cargar todo el documento
$(function(){


	//Variables necesarias que recibirásn su valor en sucesivas funciones
	var datos = null;       //recibirá el valor del Json 1
	var datos2 = null;      //recibirá el valor del Json 2
	var supertabla = null;  //los dos Json concatenados


	//Las url de los Json. El primero es local y el segundo es remoto
	var url = "media/js/NYT-congress-113-senate.json";
	var url2 = "http://congress.api.sunlightfoundation.com/legislators?chamber=senate&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b";
	var url3 = "media/js/sunlight-senate.json";


	//Valores por defecto de todas las llamadas Ajax
	$.ajaxSetup({
		beforeSend:function(){
			openModal();
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

	function goToNextJson(){

		$.ajax({
			url: url2,
			dataType: "json",
			complete:function(){
				closeModal();
			},
			success: function(data){            //Al requerir un tiempo de procesado deben llamarse dentro de esta función

				datos2 = data.results;

				supertabla = datos.concat(datos2);

				creartabla(supertabla);         //Se dibuja la tabla inicial. Se le pasa el parámetro de la matriz fusionada
				rellenarSelect(supertabla);     //Se rellena el selector de estados
				ordenarTabla();

			},
			error: function(){
				console.log("error to get first ajax");
				$.ajax({
					url: url3,
					dataType: "json",
					success: function(data){            //Al requerir un tiempo de procesado deben llamarse dentro de esta función

						datos2 = data.results;

						supertabla = datos.concat(datos2);

						creartabla(supertabla);         //Se dibuja la tabla inicial. Se le pasa el parámetro de la matriz fusionada
						rellenarSelect(supertabla);     //Se rellena el selector de estados
						ordenarTabla();
					},
					complete:function(){
						closeModal();
					}

				})
			}
		});
	}



	//Se enciende el listener de checkboxes
	listenCheckboxes();

	//Dibuja la tabla con los valores por defecto del archivo JSON de NYTimes
	function creartabla(data){

		$("#tablebody").empty();    //Se vacía el tbody de la tabla por defecto

		//Se crea una tabla por cada uno de los miembros de los dos JSON
		//A partir de ahí se irán filtrando los valores
		data.forEach(function(member){


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

			//Se crea la tabla principal con los datos de los dos Json       
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
		//además del valor del desplegable de estado
		filtroPostTabla();
	}



	//Una vez creada la tabla principal se gestionan las rows mostradas según los valores
	//checkados en los checkboxes
	function filtroPostTabla(){


		var valorCheckboxes = getValorCheckboxes();
		filtrarTablasPorCheckboxes(valorCheckboxes);


		var valorApis = getValorApis();
		filtrarTablasPorApis(valorApis);


		var valorStates = getValorDropdown();
		filtrarTablasPorSelect(valorStates);

		//Se eliminan cierts columnas si solamente se ha seleccionado una de las dos APIS/Json
		columnas();
		preparaPopup();


	}


	//Esta funcion activa los listeners de clicks en los checkboxes y crea una tabla nueva en cada click
	function listenCheckboxes(){

		$("#dropdown_states").on("change", function() {
			creartabla(supertabla);
		});

		$('input[type=checkbox]').on('click', function() {

			creartabla(supertabla);  
		});
	}



	function getValorCheckboxes() {


		//Guardamos en una array la cantidad de checboxes checkados
		var checked = $('input[name=party]:checked');
		var result;

		result = checked.map( function() {
			return this.value; 
		});

		//Devolvemos el valor "value" de cada un de estos checkboxes
		return result;
	}



	function getValorApis() {

		//Hacemos lo mismo par los checkboxes de las APIS
		var checked = $('input[name=api]:checked');
		var result;

		result = checked.map( function() {
			return this.value; 
		});
		return result;
	}

	function getValorDropdown(){

		//Igualmente para el valor del selector de estado
		var selectedState = $("select option:selected");
		var result;

		result = selectedState.map( function() {
			return this.value; 
		});
		return result;
	}




	//Con estos 3 filtros se van ocultando mostrando/ocultando las filas/rows que no nos interesa mostrar
	function filtrarTablasPorCheckboxes(valores){

		var ningunoSeleccionado = valores.length === 0;

		var allRows = $('tbody tr'); // Coge todos los elementos tr de la tabla

		if (ningunoSeleccionado) {

			allRows.show(); //Si no hay checkbox marcado muestra todas las rows

		} else {

			//Se ocultan todas las filas para mostrar luego las que necesitamos
			allRows.hide();


			$.each (valores, function(index, value) {

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




	//Muestra u oculta las COLUMNAS según las APIs seleccionadas
	function columnas(){

		//True si está checkada
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

	// Rellenar el dropdown de los estados según las tablas dibujadas
	function rellenarSelect(data){ 

		$.each(data,function(key,value){
			var option = $("<option />").val(value.state).text(value.state);
			$("#dropdown_states").append(option);
		});


		// Eliminamos los valores de ESTADOS duplicados
		var usedstates = {};
		$("select[name='state'] > option").each(function () {
			if(usedstates[this.text]) {
				$(this).remove();
			} else {
				usedstates[this.text] = this.value;
			}
		});

		// Ordenamos el dropdown
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

	function preparaPopup(){

		// Popup que contiene el la web de destino de cada nombre
		$(".iframe").colorbox({
			iframe:true,
			width:"80%",
			height:"80%"
		});
	}

	function ordenarTabla(){

		// Se ordena la tabla y se le añade la search bar. (Libreria DataTable de Jquery)
		$('#senate-data').DataTable({
			paging: false,
			scrollY: 800
		});
	}

	//Muestra u oculta la imagen loading
	function openModal() {
		$('#modal').show();
		$('#fade').show();
	}

	function closeModal() {
		$('#modal').hide();
		$('#fade').hide();
	}





}); 
