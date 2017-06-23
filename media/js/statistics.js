$(function(){
	//Funciones principales para rellenar las tablas de cada web
	//Cada vez que cambiamos de página se encarga de coger los valores
	//del JSON declarado en los HTML tags de cada web

	var datos = null;
	var page = window.location.href.split("/")[3];  //Coge el nombre de la web
	var url = null;
	checkPage();

	$.ajaxSetup({
		beforeSend:function(){
			openModal();
		}

	});


	$.ajax({
		url: url,
		dataType: "json",
		success: function(data){
			datos = data.results[0].members;

			runFunction();
			calcStats();
			crearGrafico();
			ordenarTablas();
		},
		complete:function(){
			closeModal();
		}
	});



	function calcStats(){

		var statistics = {
			"numRepublicans": calcRebuplicans(),
			"numDemocrats": calDemocrats(),
			"numIndependents": calcInd(),
			"averageVotesRepublicans": calcAverageVotesRepublican(),
			"averageVotesDemocrats": calcAverageVotesDemocrats(),
			"averageVotesIndependents": calcAverageVotesIndependent(),
			"masVotan": nameOfMaxVotes(),
			"menosVotan": nameOfMinVotes(),
			"masVotosPerdidos": maxVotesMissed(),
			"menosVotosPerdidos": minVotesMissed()
		};
		return statistics;
	}



	//Las siguientes 4 funciones se llaman desde el elemento "body onload" de cada web
	// <body onload="myFunction()">


	//Fill all tables of Senate party loyalty
	function SetAllTables(){
		SetValuesToTable1();
		SetValuesToTable2();
		SetValuesToTable3();
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
	function SetAllTablesHousePartyLoyal(){
		SetValuesToTable1();
		SetValuesLeastLoyalH();
		SetValuesMostLoyalH();
	}


	function checkPage(){

		switch(page) {
			case "senate-att-stats.html":
				url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
				break;
			case "senate-party-loyalty-stats.html":
				url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
				break;
			case "house-att-stats.html":
				url = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
				break;
			case "house-party-loyalty-stats.html":
				url = "media/js/NYT-congress-113-house.json";
				break;
		}
	}

	function runFunction(){

		switch(page) {
			case "senate-att-stats.html":
				SetAllTablesSenateAttendance();
				break;
			case "senate-party-loyalty-stats.html":
				SetAllTables();
				break;
			case "house-att-stats.html":
				SetAllTablesHouseAttendance();
				break;
			case "house-party-loyalty-stats.html":
				SetAllTablesHousePartyLoyal();
				break;
		}
	}



	//La variable que controla los objetos JSON
	//Cada vez que se recarga una web se refrescan los datos según el
	//JSON declarado en dicha página
	//var datos = data.results[0].members;


	// El objeto JSON requerido por el ejercicio



	//calcula los republicanos filtrando la array inicial del JSON original
	function calcRebuplicans () {
		var repInSenate = datos.filter(function(members){
			return members.party == "R";
		});
		return repInSenate.length; //Al poner .length devuelve un número
	}


	//calcula los democratas filtrando la array inicial del JSON original
	function calDemocrats () {
		var demInSenate = datos.filter(function(members) {
			return members.party == "D";
		});
		return demInSenate.length;
	}


	//calcula los independientes filtrando la array inicial del JSON original
	function calcInd () {
		var indInSenate = datos.filter(function(members){
			return members.party == "I";
		});
		return indInSenate.length;
	}


	//CAlcula la media de votos de los Republicanos
	function calcAverageVotesRepublican() {

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
	function calcAverageVotesDemocrats() {

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
	function calcAverageVotesIndependent() {
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
	function SetValuesToTable1() {

		//Republicans
		$("#numR").html(calcStats().numRepublicans);
		$("#avgR").html(calcStats().averageVotesRepublicans);

		//Democrats
		$("#numD").html(calcStats().numDemocrats);
		$("#avgD").html(calcStats().averageVotesDemocrats);

		//Independents
		$("#numI").html(calcStats().numIndependents);
		$("#avgI").html(calcStats().averageVotesIndependents);
	}



	//Conseguir una Array con los valores mínimos para llegar al 10%
	function nameOfMinVotes(){

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

			$("#maxVotesTable").append(tr+td1+td2+td3);
		}
	}



	//Conseguir una Array con los valores máximos que sumen el 10% o más
	//Usamos el mismo procedimiento que en la de votos mínimos pero a la inversa
	function nameOfMaxVotes(){

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

			$("#minVotesTable").append(tr+td1+td2+td3);
		}
	}







	//Here starts the Senate Attendance Stats


	//Encontramos los menos votados.
	function minVotesMissed(){

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
	function maxVotesMissed(){

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

	function minVotesMissedH() {

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
	function maxVotesMissedH() {

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


	function minVotesH (){

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
	function SetValuesLeastLoyalH(){

		var table = minVotesH();

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
	function maxVotesH (){

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
	function SetValuesMostLoyalH(){

		var table = maxVotesH();

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
	function crearGrafico(){

		var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'polarArea',
			data: {
				labels: ["R", "D", "I"],
				datasets: [{
					label: '# of Reps',
					data: [calcStats().numRepublicans, calcStats().numDemocrats, calcStats().numIndependents],
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

		$('#tabla1').DataTable({
			paging: false,
			scrollY: 465,
			searching: false,
			order: [[ 2, "desc" ]]
		});

		$('#tabla2').DataTable({
			paging: false,
			scrollY: 465,
			searching: false,
			order: [[ 2, "desc" ]]

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