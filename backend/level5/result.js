jQuery(document).ready(function(){
	jQuery.ajax({
		url:'http://localhost/JavaScript/jobs/backend/level5/data.json',
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
				if(myarr[m][0] == "car_id"){
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
				}
				if(myarr[m][0] == "end_date"){
					d2 = new Date(myarr[m][1]);
					timeDiff = new Date(d2).getTime() - new Date(d1).getTime();
					no_of_days = Math.round(timeDiff / (1000 * 3600 * 24)) + 1;
					arr_no_of_days.push(no_of_days);
				}
				if(myarr[m][0] == "distance"){
					arr_distance.push(myarr[m][1]);
				}
				if(myarr[m][0] == "deductible_reduction"){
					arr_deductible_reduction.push(myarr[m][1]);
				}
			}

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

console.log(rentals);
document.write('<pre>' + JSON.stringify(rentals, 0, 4) + '</pre>');
			  
		}// end complete
	});
})