console.log("hotel.js")





frappe.ui.form.on('Booking Hotel', {
	
	qty_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	price_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	qty_extra_bed(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	price_extra_bed(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	rate_extra_bed(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	cost_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	cost_extra_bed(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	sr_purchase(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	sr_sales(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn);
	},
	
	check_in(frm, cdt, cdn){
		calc_nights(frm, cdt, cdn);

		set_hotel_price(frm, cdt, cdn);
		set_hotel_cost(frm, cdt, cdn);
	},
	check_out(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.check_in < d.check_out){	
			calc_nights(frm, cdt, cdn);
			set_hotel_price(frm, cdt, cdn);
		set_hotel_cost(frm, cdt, cdn);
			hotel_costing(frm, cdt, cdn);
		}
		else{
			msgprint('Check out date can not be less than Check in date.')
		}
	},
	hotels_remove(frm){
		set_hotel_totals(frm);
	},
	hotels_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);
		frappe.model.set_value(d.doctype, d.name, 'sr_sales', frm.doc.ers);
		frappe.model.set_value(d.doctype, d.name, 'sr_purchase', frm.doc.erp);
	
	},
	no_of_days(frm, cdt, cdn){
		var d = locals[cdt][cdn];
	},
	hotel(frm, cdt, cdn){
		set_curr(frm, cdt, cdn)
	},
	hotel_agent(frm, cdt, cdn){
		set_curr(frm, cdt, cdn)
		set_hotel_cost(frm, cdt, cdn);
		
	},
	room_type(frm, cdt, cdn){
		set_hotel_cost(frm, cdt, cdn);
		set_hotel_price(frm, cdt, cdn);
	},
	is_sharing(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	no_of_beds(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	no_of_days_weekday(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	no_of_days_weekend(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	rate_weekdays_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	rate_weekends_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	cost_weekdays_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	cost_weekends_room(frm, cdt, cdn){
		hotel_costing(frm, cdt, cdn)
	},
	total_purchase_amount_pkr(frm, cdt, cdn){
		set_hotel_totals(frm)
	},
	total_sales_amount_pkr(frm, cdt, cdn){
		set_hotel_totals(frm)
	},





})



function set_curr(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.hotel_agent){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Hotel Agent',
				filters:{
					//hotel: d.hotel,
					name:d.hotel_agent
				},
				fieldname:['currency']
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'currency_purchase', r.message['currency']);
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'currency_purchase', '');

				}
			}
		})
	}
	else if(d.hotel){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Hotel',
				filters:{
					//hotel: d.hotel,
					name:d.hotel
				},
				fieldname:['currency']
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'currency_purchase', r.message['currency']);
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'currency_purchase', '');

				}
			}
		})

	}

}



function reset_hotel_rates(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'rate_weekdays_room', 0);
	frappe.model.set_value(d.doctype, d.name, 'rate_weekends_room', 0);
	frappe.model.set_value(d.doctype, d.name, 'rate_extra_bed', 0);
	frappe.model.set_value(d.doctype, d.name, 'meal', '');
	frappe.model.set_value(d.doctype, d.name, 'vat', 0);
}

function reset_hotel_cost(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'cost_weekdays_room', 0);
	frappe.model.set_value(d.doctype, d.name, 'cost_weekends_room', 0);
	frappe.model.set_value(d.doctype, d.name, 'cost_extra_bed', 0);
}




function set_hotel_price(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.room_type && d.check_in){
		
			frappe.call({
				method: 'get_hotel_price',
				doc: frm.doc,
				args:{room_type:d.room_type, hotel:d.hotel, chin:d.check_in},
				callback: function(r){
					if(r.message){
						frappe.model.set_value(d.doctype, d.name, 'rate_weekdays_room', r.message[0]);
						frappe.model.set_value(d.doctype, d.name, 'rate_weekends_room', r.message[1]);
						frappe.model.set_value(d.doctype, d.name, 'rate_extra_bed', r.message[2]);
						frappe.model.set_value(d.doctype, d.name, 'meal', r.message[3]);
						frappe.model.set_value(d.doctype, d.name, 'vat', r.message[4]);
						
						
					}
					else{
						msgprint('No valid rates found for this hotel selling price list.')
					}
				}
			})
		
	}
	else{
		reset_hotel_rates(frm, cdt, cdn);
	}
	hotel_costing(frm, cdt, cdn);
}








function set_hotel_cost(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.room_type && d.check_in){
		if(d.hotel_agent && d.hotel){
			frappe.call({
				method: 'get_hotel_agent_cost',
				doc: frm.doc,
				args:{room_type:d.room_type, agent:d.hotel_agent, chin:d.check_in, hotel:d.hotel},
				callback: function(r){
					if(r.message){
						frappe.model.set_value(d.doctype, d.name, 'cost_weekdays_room', r.message[0]);
						frappe.model.set_value(d.doctype, d.name, 'cost_weekends_room', r.message[1]);
						frappe.model.set_value(d.doctype, d.name, 'cost_extra_bed', r.message[2]);
						
					}
					else{
						reset_hotel_cost(frm, cdt, cdn)
						msgprint('No valid rates found for this agent price list.');				
					}
				}
			})
		}
		else{
			if(d.hotel){
				frappe.call({
					method: 'get_hotel_cost',
					doc: frm.doc,
					args:{room_type:d.room_type, hotel:d.hotel, chin:d.check_in},
					callback: function(r){
						if(r.message){
							frappe.model.set_value(d.doctype, d.name, 'cost_weekdays_room', r.message[0]);
							frappe.model.set_value(d.doctype, d.name, 'cost_weekends_room', r.message[1]);
							frappe.model.set_value(d.doctype, d.name, 'cost_extra_bed', r.message[2]);			
						}
						else{
							reset_hotel_cost(frm, cdt, cdn)
							msgprint('No valid rates found for this hotel price list.')			
						}
					}
				})
			}
		}
	}
	else{
		reset_hotel_cost(frm, cdt, cdn)
	}
	hotel_costing(frm, cdt, cdn);

}


function hotel_costing(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	
	var week = 0;
	var weeke = 0;
	var cweek = 0;
	var cweeke = 0;

	if(d.is_sharing == 0){
		week = d.qty_room * (d.rate_weekdays_room * d.no_of_days_weekday)
		weeke = d.qty_room * (d.rate_weekends_room * d.no_of_days_weekend)
		cweek = d.qty_room * (d.cost_weekdays_room * d.no_of_days_weekday)
		cweeke = d.qty_room * (d.cost_weekends_room * d.no_of_days_weekend)
		frappe.model.set_value(d.doctype, d.name, 'total_cost_extra_bed', d.qty_extra_bed * d.cost_extra_bed);
		frappe.model.set_value(d.doctype, d.name, 'price_extra_bed', d.qty_extra_bed * d.rate_extra_bed);
	}
	else{
		week = ((d.rate_weekdays_room) * (d.no_of_beds)) * d.no_of_days_weekday;
		weeke = ((d.rate_weekends_room) * (d.no_of_beds)) * d.no_of_days_weekend;
		cweek = ((d.cost_weekdays_room) * (d.no_of_beds)) * d.no_of_days_weekday;
		cweeke = ((d.cost_weekends_room) * (d.no_of_beds)) * d.no_of_days_weekend;
		frappe.model.set_value(d.doctype, d.name, 'total_cost_extra_bed', 0);
		frappe.model.set_value(d.doctype, d.name, 'price_extra_bed', 0);
	}
		

	frappe.model.set_value(d.doctype, d.name, 'price_weekdays_room', week);
	frappe.model.set_value(d.doctype, d.name, 'price_weekends_room', weeke);
	frappe.model.set_value(d.doctype, d.name, 'total_cost_weekdays_room', cweek);
	frappe.model.set_value(d.doctype, d.name, 'total_cost_weekends_room', cweeke);
	

	frappe.model.set_value(d.doctype, d.name, 'total_sales', (d.price_weekdays_room + d.price_weekends_room + d.price_extra_bed));
	frappe.model.set_value(d.doctype, d.name, 'total_purchase', d.total_cost_weekdays_room + d.total_cost_weekends_room + d.total_cost_extra_bed);
	
	frappe.model.set_value(d.doctype, d.name, 'total_sales_amount_pkr', d.total_sales * d.sr_sales);
	frappe.model.set_value(d.doctype, d.name, 'total_purchase_amount_pkr', d.total_purchase * d.sr_purchase);
	
	
}

function calc_nights(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	var startDate = new Date(d.check_in);;
	var endDate = new Date(d.check_out);
	var sundayCnt = getSundayCountBetweenDates(startDate, endDate);
	var total_nights = frappe.datetime.get_day_diff(d.check_out, d.check_in);
	/*if(total_nights > frm.doc.visa_days){
		msgprint('No of nights can not be greater than no of visa days.')
		frappe.model.set_value(d.doctype, d.name, 'check_out', '');
	}
	else{*/
		frappe.model.set_value(d.doctype, d.name, 'no_of_days', total_nights);
		frappe.model.set_value(d.doctype, d.name, 'nights', total_nights);
		frappe.model.set_value(d.doctype, d.name, 'no_of_days_weekend', sundayCnt);
		frappe.model.set_value(d.doctype, d.name, 'no_of_days_weekday', total_nights - sundayCnt);
		
	//}
	
}




cur_frm.set_query("hotel", "hotels", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
	
			country: cur_frm.doc.destination_country,
			city: d.city
			
		}
	}
})

cur_frm.set_query("city", "hotels", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
	
			country: cur_frm.doc.destination_country
			
		}
	}
})