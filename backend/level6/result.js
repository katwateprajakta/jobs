jQuery(document).ready(function(){
	jQuery.ajax({
		url:'http://localhost/JavaScript/jobs/backend/level6/data.json',
	    type: 'get',
	    dataType: 'json',
	    async: false,
	    complete: function(data, textStatus, jqXHR)
	    {
	    	var data_store = data['responseJSON'];

			var arr = [];
			var d1,d2,timeDiff;
			var tot_price = 0;
			var car_ids = [];
			var arr_price_per_day = [];
			var arr_price_per_km = [];
			var arr_no_of_days = [];
			var arr_distance = [];
			var arr_deductible_reduction = [];
			var commission,insurance_fee,assistance_fee,drivy_fee,deductible_reduction;
			var driver,owner,insurance,assistance,drivy;
			var rentals = [{'id': 0, 'price':0}];
			var rm = [];
			var arr_start_dt = [];
			var arr_end_dt = [];

	    	for (var j in data_store){	
	    		for (var i = 0; i < data_store[j].length; i++) {
	    			for (var k in data_store[j][i]){
				       arr.push({
				            Key:k,Value:data_store[j][i][k]
				        });
	    			}
	    		}

				var new_arr = jQuery.map(arr, function(arr) {
				    return  arr.Key + ":" + arr.Value;
				});

				var myarr = [];
				for (var i = 0; i < new_arr.length; i++) {
					myarr.push(new_arr[i].split(":"));
				}
	 		}

			for (var m = 0; m < myarr.length; m++) {
 				if(myarr[m][0] == "id"){
					car_ids.push(myarr[m][1]);
				}
				if(myarr[m][0] == "price_per_day"){
					arr_price_per_day.push(myarr[m][1]);
				}
				if(myarr[m][0] == "price_per_km"){
					arr_price_per_km.push(myarr[m][1]);
				}
				if(myarr[m][0] == "start_date"){
					d1 = new Date(myarr[m][1]);
					arr_start_dt.push(d1);
				}
				if(myarr[m][0] == "end_date"){
					d2 = new Date(myarr[m][1]);
					arr_end_dt.push(d2);
				}
				if(myarr[m][0] == "distance"){
					arr_distance.push(myarr[m][1]);
				}
				if(myarr[m][0] == "deductible_reduction"){
					arr_deductible_reduction.push(myarr[m][1]);
				}

				car_ids = $.unique(car_ids).sort(function(a, b){return a-b});
				var car_ids_len = car_ids.length;

				if (myarr[m][0] == "rental_id") {	
					for (var c = 0; c < car_ids.length; c++) {					
						if(myarr[m][1]  ==  car_ids[c]){
							rm.push(myarr[m][1]);
						}
					}
				}
			}

			var array = Object.keys(data_store).map(function(k) { return data_store[k] });

			rental_modify_arr = array[2];
			for (var r = 0; r < rental_modify_arr.length; r++) {
			 	// console.log(rental_modify_arr[r]); 
			 	if(rental_modify_arr[r]['rental_id'] == rm[r]){
			 		
			 		var new_end_date = new Date(rental_modify_arr[r]['end_date']);
			 		// console.log("in if ed ==== "+ new_end_date);
			 		if(new_end_date != "Invalid Date"){
			 			// console.log("not Invalid ==== "+new_end_date);
			 			arr_end_dt[rm[r] - 1] = new_end_date;
			 		}

			 		if(rental_modify_arr[r]['distance'] != undefined){
			 			arr_distance[rm[r] - 1] = rental_modify_arr[r]['distance'];
			 		}

			 		var new_start_date = new Date(rental_modify_arr[r]['start_date']);
			 		// console.log("in if st ==== "+ new_start_date);
			 		if(new_start_date != "Invalid Date"){
			 			// console.log("not Invalid 2 ===== "+new_start_date);
			 			arr_start_dt[rm[r] - 1] = new_start_date;
			 		}
			 	}
			}

			arr_distance.pop();

			/*for rental_modifications*/
			for (var dt = 0; dt < arr_start_dt.length; dt++) {
				d1 = arr_start_dt[dt];
				d2 = arr_end_dt[dt];
				timeDiff = new Date(d2).getTime() - new Date(d1).getTime();
				no_of_days = Math.round(timeDiff / (1000 * 3600 * 24)) + 1;
				arr_no_of_days.push(no_of_days);
			}
			arr_no_of_days.pop();
			/*for rental_modifications end*/

			for (var x = 0; x < car_ids.length; x++) {
				var tot_days_cost = arr_price_per_day[0] * arr_no_of_days[x];
				var tot_dist_cost = arr_price_per_km[0] * arr_distance[x];
				tot_price = tot_days_cost + tot_dist_cost;
				commission = (30/100) * tot_price;
				insurance_fee = (50/100) * commission;
				assistance_fee = arr_no_of_days[x] * 100;
				drivy_fee = commission - (insurance_fee + assistance_fee);

				if(arr_deductible_reduction[x] == 'true')
				{
					deductible_reduction = arr_no_of_days[x] * 400;
				}
				else{
					deductible_reduction = 0
				}
				
				driver = tot_price + deductible_reduction;
				owner = tot_price - commission;				
				insurance = insurance_fee;
				assistance = assistance_fee;				
				drivy = drivy_fee + deductible_reduction;

rentals.push({'id': x+1, 'actions':[{'who':'driver','type':'debit','amount':driver},{'who':'owner','type':'credit','amount':owner},{'who':'insurance','type':'credit','amount':insurance},{'who':'assistance','type':'credit','amount':assistance},{'who':'drivy','type':'credit','amount':drivy}]});		
			}

// 			console.log(rentals);
			document.write('<pre>' + JSON.stringify(rentals, 0, 4) + '</pre>');
			  
		}// end complete
	});
})