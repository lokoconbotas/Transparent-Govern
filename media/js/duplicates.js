var data1 = data.results[0].members;
var data2 = sundata.results;

console.log("Duplicates");



//Ya que las arrays no tiene dos campos con el mismo nombre que coincida. Renombramos la 'bioguide_id' de SunLigth a 'id'
for (var i = 0; i < data2.length; i++) {
	data2[i].id = data2[i].bioguide_id;
	//delete data2[i].bioguide_id;
}

function mergeDuplicates(array1, array2, targetKey, desiredKeys) {

	//creamos una array y un objeto vacíos
	var array = [];
	var object =  {};

	//Por cada elemento de las arrays ejecutamos la funcion
	array1.forEach(buildObject);
	array2.forEach(buildObject);

	function buildObject(value) {
		//Variabe de "ahorro"
		var thisKey = value[targetKey];

		//Si el objecto no está en el objeto nuevo, se crea.
		if (!object[thisKey]) {
			object[thisKey] = new Object();
			//Opcionalmente se incluye la propiedad con la que buscamos duplicados. En este caso la 'id'.
			//Si no se quisiera incluir solamente se comentaría la suguiente línea.
			object[thisKey][targetKey] = thisKey;

			array.push(object[thisKey]);
		}

		//Se setean las propiedades deseadas, en caso que no estén en la primera array se setearán en la segunda.
		//NO se deben setear con valor '--' o similar ya que de hacerlo se sobreescribirán en la segunda pasada
		desiredKeys.forEach(function (key) {
			if (key in value) {
				object[thisKey][key] = value[key];
			}
		});
	}
	
	return array;
}




var newArray = mergeDuplicates(
	data1, 
	data2, 
	'id', 
	['first_name', 'state', 'party', 'votes_with_party_pct', 'birthday']
	);

console.log(newArray);


