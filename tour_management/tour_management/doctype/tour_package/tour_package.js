// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tour Package', {
	
	before_save(frm){
		set_totals(frm);
	},
	refresh(frm){
		frm.add_custom_button('Create Booking', function(){
			frappe.model.open_mapped_doc({
				method: "tour_management.tour_management.doctype.tour_package.tour_package.create_booking",
				frm: frm
			})
		})
	},
	
	qty_adult(frm){
		set_qty(frm);
		visa_costing(frm);
		ticket_costing(frm);
	},
	qty_child(frm){
		set_qty(frm);
		visa_costing(frm);
	},
	qty_infant(frm){
		set_qty(frm);
		visa_costing(frm);	
	},
	price_adult(frm){
		visa_costing(frm);
	},
	price_child(frm){
		visa_costing(frm);
	},
	price_infant(frm){
		visa_costing(frm);
	},
	cost_adult(frm){
		visa_costing(frm);
	},
	cost_child(frm){
		visa_costing(frm);
	},
	cost_infant(frm){
		visa_costing(frm);
	},
	
	destination_country(frm){
		set_visa_selling_price_list(frm);
		set_visa_agent_price_list(frm);
	},
	visa_type(frm){
		set_visa_selling_price_list(frm);
		set_visa_agent_price_list(frm);
	},
	visa_agent(frm){		
		set_visa_agent_price_list(frm);
	},
	booking_of(frm){
		if(frm.doc.booking_of == 'Umrah' || frm.doc.booking_of == 'Hajj'){
			frm.set_value('destination_country', 'Saudi Arabia')	
		}
		else{
			frm.set_value('destination_country', '')
		}
		
	},
	
	visa_agent_price_list(frm){
		set_visa_cost(frm);

	},
	visa_selling_price_list(frm){
		set_visa_price(frm);
		//frappe.call({method:'get_docs', doc:frm.doc, callback:function(r){frm.refresh_field('documents')}})
		//frm.refresh_field('documents')
	},
	erp(frm){
		exchange(frm);
	},
	ers(frm){
		exchange(frm);
	}

});


function exchange(frm){
	var f = frm.doc;
	frm.set_value('total_visa_cost_pkr', f.total_visa_cost * f.erp)
	frm.set_value('total_visa_amount_pkr', f.total_visa_amount * f.ers)

	for(var t in f.transports){
		f.transports[t].sale_pkr = f.transports[t].sale * f.ers
		f.transports[t].purchase_pkr = f.transports[t].purchase * f.erp 	
	}
	frm.refresh_field('transports')

	for(var h in f.hotels){
		f.hotels[h].total_sales_amount_pkr = f.hotels[h].total_sales * f.ers
		f.hotels[h].total_purchase_amount_pkr = f.hotels[h].total_purchase * f.erp

	}
	frm.refresh_field('hotels');

	for(var s in f.services){
		f.services[s].sale_pkr = f.services[s].sale * f.ers
		f.services[s].purchase_pkr = f.services[s].purchase * f.erp 	
	}
	frm.refresh_field('services')

}



function set_visa_cost(frm){
	frappe.call({
		method: 'get_visa_cost',
		doc: frm.doc,
		callback: function(r){
			if(r.message){
				frm.set_value('cost_adult', r.message[0])
				frm.set_value('cost_child', r.message[1])
				frm.set_value('cost_infant', r.message[2])
				
			}
			else{

				frm.set_value('cost_adult', 0)
				frm.set_value('cost_child', 0)
				frm.set_value('cost_infant', 0)
				msgprint('No valid rates found for the visa agent price list.')
			
			}
		}
	})
}


function set_visa_price(frm){
	frappe.call({
		method: 'get_visa_price',
		doc: frm.doc,
		callback: function(r){
			if(r.message){
				frm.set_value('price_adult', r.message[0])
				frm.set_value('price_child', r.message[1])
				frm.set_value('price_infant', r.message[2])
			}
			else{

				frm.set_value('price_adult', 0)
				frm.set_value('price_child', 0)
				frm.set_value('price_infant', 0)
				msgprint('No valid rates found for the visa price list.')
			
			}
		}
	})
}




function set_visa_selling_price_list(frm){
	if(frm.doc.visa_type && frm.doc.destination_country){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Visa Selling Price List',
				filters:{
					visa_type: frm.doc.visa_type,
					country: frm.doc.destination_country
				},
				fieldname:['name']
			},
			callback: function(r){
				if(r.message){
					frm.set_value('visa_selling_price_list', r.message['name'])
				}
				else{
					frm.set_value('visa_selling_price_list', '')
				}
			}
		})
	}
}


function set_visa_agent_price_list(frm){
	if(frm.doc.visa_type && frm.doc.destination_country && frm.doc.visa_agent){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Visa Agent Price List',
				filters:{
					visa_type: frm.doc.visa_type,
					visa_for_country: frm.doc.destination_country,
					visa_agent: frm.doc.visa_agent
				},
				fieldname:['name']
			},
			callback: function(r){
				if(r.message){
					frm.set_value('visa_agent_price_list', r.message['name'])
				}
				else{
					frm.set_value('visa_agent_price_list', '')
				}
			}
		})
	}
}


cur_frm.set_query("visa_selling_price_list", function() {
	return {
		"filters": {
			
			visa_type: cur_frm.doc.visa_type,
			country: cur_frm.doc.destination_country
		}
	}
})

cur_frm.set_query("visa_agent_price_list", function() {
	return {
		"filters": {
			
			visa_type: cur_frm.doc.visa_type,
			visa_for_country: cur_frm.doc.destination_country,
			visa_agent: cur_frm.doc.visa_agent
		}
	}
})



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











function set_qty(frm){
	frm.set_value('qty_total', frm.doc.qty_adult + frm.doc.qty_child + frm.doc.qty_infant)
	frm.set_value('visa_qty_adult', frm.doc.qty_adult)
	frm.set_value('visa_qty_child', frm.doc.qty_child)
	frm.set_value('visa_qty_infant', frm.doc.qty_infant)
	set_tables_qty(frm);

}


function set_tables_qty(frm){
	var hotels = frm.doc.hotels;
	for(var i in hotels){
		hotels[i].qty_adult = frm.doc.qty_adult
		hotels[i].qty_child = frm.doc.qty_child
		hotels[i].qty_infant = frm.doc.qty_infant
	}
	frm.refresh_field('hotels')

	var transports = frm.doc.transports;
	for(var i in transports){
		transports[i].qty_adult = frm.doc.qty_adult
		transports[i].qty_child = frm.doc.qty_child
		transports[i].qty_infant = frm.doc.qty_infant
	}
	frm.refresh_field('transports')

	var addons = frm.doc.addons;
	for(var i in addons){
		addons[i].qty_adult = frm.doc.qty_adult
		addons[i].qty_child = frm.doc.qty_child
		addons[i].qty_infant = frm.doc.qty_infant
	}
	frm.refresh_field('addons')

}

function visa_costing(frm){
	var f = frm.doc;
	frm.set_value('visa_total_adult', f.qty_adult * f.price_adult)
	frm.set_value('visa_total_child', f.qty_child * f.price_child)
	frm.set_value('visa_total_infant', f.qty_infant * f.price_infant)
	frm.set_value('total_visa_amount', f.visa_total_adult + f.visa_total_child + f.visa_total_infant)
	frm.set_value('total_visa_cost', (f.qty_adult * f.cost_adult) + (f.qty_child * f.cost_child) + (f.qty_infant * f.cost_infant))
	frm.set_value('total_visa_amount_pkr', f.total_visa_amount * f.ers)
	frm.set_value('total_visa_cost_pkr', f.total_visa_cost * f.erp)
}




function calculate_pkg_rate(frm){
	var f = frm.doc; 
	var adult = 0;
	var child = 0;
	var infant = 0;

	adult +=  f.price_adult
	child += f.price_child
	infant += f.price_infant

	var trate = f.transport_total_sales_amount / f.qty_total
	adult +=  trate
	child += trate
	infant += trate

	for(var i in f.addons){
		adult += f.addons[i].price_adult
		child += f.addons[i].price_child
		infant += f.addons[i].price_infant

	}

	for(var t in f.tickets){
		if (f.tickets[t].ticket_for == 'Adult'){
			adult += f.tickets[t].ticket_price
		}
		else if (f.tickets[t].ticket_for == 'Child'){
			child += f.tickets[t].ticket_price
		}
		else{
			infant += f.tickets[t].ticket_price
		}
		

	}

	frm.set_value('package_rate_adult', adult)
	frm.set_value('package_rate_child', child)
	frm.set_value('package_rate_infant', infant)

}



frappe.ui.form.on('Package Ticket', {

	tickets_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		//frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		//frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		//frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);	
	},
	market_fare(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	apt(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	dof(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	ins(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	yq(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	fed(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	ced(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	yr(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	ftt(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	ptt(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	oas(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	pq(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	oad(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	svc(frm, cdt, cdn){
		set_ticket_price(frm, cdt, cdn);
	},
	qty(frm, cdt, cdn){
		ticket_costing(frm, cdt, cdn);
	},
	com_rate(frm, cdt, cdn){
		set_taxes(frm, cdt, cdn);
		
	},
	wht_rate(frm, cdt, cdn){
		set_taxes(frm, cdt, cdn);
	},
	city_tax_rate(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
	},
	city_tax_amount(frm, cdt, cdn){	
		set_ticket_cost(frm, cdt, cdn);
	},
	com_amount(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn);
		set_ticket_price(frm, cdt, cdn);

	},
	ticket_cost(frm, cdt, cdn){
		ticket_costing(frm, cdt, cdn);
	},
	ticket_price(frm, cdt, cdn){
		ticket_costing(frm, cdt, cdn);
	},
	tickets_remove(frm, cdt, cdn){
		set_ticket_totals(frm);
	},
	discount_rate(frm, cdt, cdn){
		set_disc(frm, cdt, cdn);
	},
	discount_amount(frm, cdt, cdn){
		set_disc(frm, cdt, cdn)
	}

});


function set_disc(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.discount_based_on == 'Percentage'){
		
		frappe.model.set_value(d.doctype, d.name, 'discount_amount',  Math.round(d.market_fare * d.discount_rate / 100));
	}
	else if(d.discount_based_on == 'Amount'){
		frappe.model.set_value(d.doctype, d.name, 'discount_rate',  d.discount_amount / d.market_fare * 100);
	}
	set_ticket_cost(frm, cdt, cdn)
}

function set_taxes(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'com_amount',  Math.round(d.market_fare * d.com_rate / 100));
	frappe.model.set_value(d.doctype, d.name, 'wht_amount',  Math.round(d.com_amount * d.wht_rate / 100));
}

function set_ticket_cost(frm, cdt, cdn){

	
	var d = locals[cdt][cdn];
	var cost = d.market_fare + d.apt + d.dof + d.ins + d.yq + d.fed + d.ced + d.yr + d.ftt + d.ptt + d.oas + d.pq + d.oad;
	
	frappe.model.set_value(d.doctype, d.name, 'ticket_cost', cost + d.city_tax_amount + d.wht_amount - d.com_amount)
	set_ticket_price(frm, cdt, cdn);
}

function set_ticket_price(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	var price = d.ticket_cost + d.svc + d.com_amount
	frappe.model.set_value(d.doctype, d.name, 'ticket_price', price - d.discount_amount)
}



function ticket_costing(frm, cdt, cdn){
	var f = locals[cdt][cdn];
	set_ticket_totals(frm);
}


function set_ticket_totals(frm){
	var tickets = frm.doc.tickets;	
	var price = 0;
	var cost = 0;
	for(var i in tickets){
		price += tickets[i].ticket_price
		cost += tickets[i].ticket_cost
	}	
	frm.set_value('total_ticket_sales_amount', price)
	frm.set_value('total_ticket_purchase_amount', cost)
}



frappe.ui.form.on('Package Hotel', {
	
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
	
	hotels_remove(frm){
		set_hotel_totals(frm);
	},
	before_hotels_remove(frm){
		set_hotel_totals(frm);
	},
	hotels_add(frm, cdt, cdn){
		//var d = locals[cdt][cdn];
		//frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		//frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		//frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);
	
	},
	no_of_days(frm, cdt, cdn){
		var d = locals[cdt][cdn];
	},
	hotel(frm, cdt, cdn){
		set_curr(frm, cdt, cdn)
		set_hotel_cost(frm, cdt, cdn);
		set_hotel_price(frm, cdt, cdn);
	},
	hotel_agent(frm, cdt, cdn){
		set_curr(frm, cdt, cdn)
		set_hotel_cost(frm, cdt, cdn);
		set_hotel_price(frm, cdt, cdn);
		
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
	}


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
					frappe.model.set_value(d.doctype, d.name, 'currency', r.message['currency']);
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'currency', '');

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
					frappe.model.set_value(d.doctype, d.name, 'currency', r.message['currency']);
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'currency', '');

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
				args:{room_type:d.room_type, hotel:d.hotel},
				callback: function(r){
					if(r.message){
						frappe.model.set_value(d.doctype, d.name, 'rate_weekdays_room', r.message[0]);
						frappe.model.set_value(d.doctype, d.name, 'rate_weekends_room', r.message[1]);
						frappe.model.set_value(d.doctype, d.name, 'rate_extra_bed', r.message[2]);
						hotel_costing(frm, cdt, cdn);
						
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
	if(d.room_type){
		if(d.hotel_agent && d.hotel){
			frappe.call({
				method: 'get_hotel_agent_cost',
				doc: frm.doc,
				args:{room_type:d.room_type, agent:d.hotel_agent, hotel:d.hotel},
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
					args:{room_type:d.room_type, hotel:d.hotel},
					callback: function(r){
						if(r.message){
							frappe.model.set_value(d.doctype, d.name, 'cost_weekdays_room', r.message[0]);
							frappe.model.set_value(d.doctype, d.name, 'cost_weekends_room', r.message[1]);
							frappe.model.set_value(d.doctype, d.name, 'cost_extra_bed', r.message[2]);	
							hotel_costing(frm, cdt, cdn);			
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
		//reset_hotel_cost(frm, cdt, cdn)
	}

	hotel_costing(frm, cdt, cdn);
}












function hotel_costing(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	
	var week = 0;
	var weeke = 0;
	var pur = 0
	if(d.is_sharing == 1){
		week = ((d.rate_weekdays_room) * (d.no_of_beds)) * d.no_of_days_weekday;
		weeke = ((d.rate_weekends_room) * (d.no_of_beds)) * d.no_of_days_weekend;
		pur = (d.no_of_beds * ((d.no_of_days_weekday * d.cost_weekdays_room)+(d.no_of_days_weekend * d.cost_weekends_room)))
	}
	else{
		//frappe.model.set_value(d.doctype, d.name, 'qty_extra_bed', 0);
		week = d.qty_room * (d.rate_weekdays_room * d.no_of_days_weekday)
		weeke = d.qty_room * (d.rate_weekends_room * d.no_of_days_weekend)
		pur = (d.qty_room * ((d.no_of_days_weekday * d.cost_weekdays_room)+(d.no_of_days_weekend * d.cost_weekends_room)))+(d.qty_extra_bed * d.cost_extra_bed)
	}

	frappe.model.set_value(d.doctype, d.name, 'price_weekdays_room', week);
	frappe.model.set_value(d.doctype, d.name, 'price_weekends_room', weeke);
	frappe.model.set_value(d.doctype, d.name, 'price_extra_bed', d.qty_extra_bed * d.rate_extra_bed);

	frappe.model.set_value(d.doctype, d.name, 'total_sales', (d.price_weekdays_room + d.price_weekends_room + d.price_extra_bed));
	frappe.model.set_value(d.doctype, d.name, 'total_purchase', pur);
	
	frappe.model.set_value(d.doctype, d.name, 'total_sales_amount_pkr', d.total_sales * frm.doc.ers);
	frappe.model.set_value(d.doctype, d.name, 'total_purchase_amount_pkr', d.total_purchase * frm.doc.erp);
	set_hotel_totals(frm)
	
}
function set_hotel_totals(frm){
	var hotels = frm.doc.hotels;
	var cost = 0;
	var price = 0;
	for(var i in hotels){
		cost += hotels[i].total_purchase_amount_pkr
		price += hotels[i].total_sales_amount_pkr
	}
	frm.set_value('hotel_total_sales_amount', price)
	frm.set_value('hotel_total_purchase_amount', cost)
}

function getSundayCountBetweenDates(startDate, endDate){
   var totalSundays = 0;
   for (var i = startDate; i <= endDate; i.setDate(i.getDate()+1)){
       if (i.getDay() == 0) totalSundays++;
       if (i.getDay() == 6) totalSundays++;
   }
   return totalSundays;
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
		hotel_costing(frm, cdt, cdn);
	//}
	
}



frappe.ui.form.on('Package Transport', {
	qty(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	
	ex_c(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	ex_v(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	capacity(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	price_per_seat(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	price_vehicle(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	price_per_day(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	transports_remove(frm){
		set_transport_totals(frm);
	},
	before_transports_remove(frm){
		set_transport_totals(frm);
	},
	transports_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);
	
	},
	vehicle(frm, cdt, cdn){
		set_vehicle_cost(frm, cdt, cdn)
		transport_costing(frm, cdt, cdn)
	},
	route(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		
	},
	transporter(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'route', '')
		frappe.model.set_value(d.doctype, d.name, 'car', '')

	},
	price_based_on(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn)
	}

})



	






cur_frm.set_query("vehicle", "transports", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	return {
		query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.vehicle_query',
		"filters": {
			transporter: d.transporter
		}
	}
})



function set_vehicle_cost(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.transporter &&  d.vehicle){
		frappe.call({
			method: 'vehicle_cost',
			doc: frm.doc,
			args:{
				transporter: d.transporter,
				vehicle: d.vehicle
			},
			callback: function(r){
				frappe.model.set_value(d.doctype, d.name, 'cost_vehicle', r.message[0])
				frappe.model.set_value(d.doctype, d.name, 'cost_per_seat', r.message[1])
				frappe.model.set_value(d.doctype, d.name, 'cost_per_day', r.message[2])

			}

		})
	}
}


function transport_costing(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	var cost = 0;
	var price = 0;


	if(d.price_based_on=='Per Day'){
		cost = d.qty * d.cost_per_day
		price = d.qty * d.price_per_day
	}
	else if(d.price_based_on == 'Vehicle'){
		cost = d.qty * d.cost_vehicle
		price = d.qty * d.price_vehicle
	}
	else{
		if(d.capacity < d.qty){
		frappe.model.set_value(d.doctype, d.name, 'qty', '');
		msgprint('Invalid qty')
	}	
	else{
		cost = d.qty * d.cost_per_seat
		price = d.qty * d.price_per_seat
	}

	}



	

	frappe.model.set_value(d.doctype, d.name, 'purchase', cost);
	frappe.model.set_value(d.doctype, d.name, 'sale', price);
	frappe.model.set_value(d.doctype, d.name, 'purchase_pkr', frm.doc.erp * d.purchase);
	frappe.model.set_value(d.doctype, d.name, 'sale_pkr', frm.doc.ers * d.sale);
	set_transport_totals(frm);
	
}



function set_transport_totals(frm){
	var transports = frm.doc.transports;
	var cost = 0;
	var price = 0;
	for(var i in transports){
		cost += transports[i].purchase_pkr
		price += transports[i].sale_pkr
	}
	frm.set_value('transport_total_sales_amount', price)
	frm.set_value('transport_total_purchase_amount', cost)
	
}



frappe.ui.form.on('Package Add on Service', {
	qty_adult(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	qty_child(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	qty_infant(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	ex_c(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	ex_v(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	cost_adult(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	cost_child(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	cost_infant(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	addons_remove(frm){
		set_addons_totals(frm);
	},
	before_addons_remove(frm){
		set_addons_totals(frm);
	},
	addons_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);
	
	},
	foc(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	}

})


function addons_costing(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'total_adult', d.qty_adult * d.price_adult);
	frappe.model.set_value(d.doctype, d.name, 'total_child', d.qty_child * d.price_child);
	
	if(d.foc){
		frappe.model.set_value(d.doctype, d.name, 'total_infant', 0);
		frappe.model.set_value(d.doctype, d.name, 'purchase', (d.qty_adult * d.cost_adult) + (d.qty_child * d.cost_child));
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'total_infant', d.qty_infant * d.price_infant);
		frappe.model.set_value(d.doctype, d.name, 'purchase', (d.qty_adult * d.cost_adult) + (d.qty_child * d.cost_child) + (d.qty_infant * d.cost_infant));
	}
	
	frappe.model.set_value(d.doctype, d.name, 'sale', d.total_adult + d.total_child + d.total_infant);
	frappe.model.set_value(d.doctype, d.name, 'purchase_pkr', frm.doc.erp * d.purchase);
	frappe.model.set_value(d.doctype, d.name, 'sale_pkr', frm.doc.ers * d.sale);
	set_addons_totals(frm);
}

function set_addons_totals(frm){
	var addons = frm.doc.addons;
	var cost = 0;
	var price = 0;
	for(var i in addons){
		cost += addons[i].purchase_pkr
		price += addons[i].sale_pkr
	}
	frm.set_value('add_on_total_sales_amount', price)
	frm.set_value('add_on_total_purchase_amount', cost)
	
}

function set_totals(frm){
	set_transport_totals(frm);
	set_hotel_totals(frm);
	set_addons_totals(frm);
	visa_costing(frm);
	calculate_pkg_rate(frm)

	var f = frm.doc;
	calculate_pkg_rate(frm);
	frm.set_value('visa_purchase_total', f.total_visa_cost_pkr)
	frm.set_value('visa_sales_total', f.total_visa_amount_pkr)
	frm.set_value('hotel_purchase_total', f.hotel_total_purchase_amount)
	frm.set_value('hotel_sales_total', f.hotel_total_sales_amount)
	frm.set_value('transport_purchase_total', f.transport_total_purchase_amount)
	frm.set_value('transport_sales_total', f.transport_total_sales_amount)
	frm.set_value('add_ons_purchase_total', f.add_on_total_purchase_amount)
	frm.set_value('add_ons_sales_total', f.add_on_total_sales_amount)
	frm.set_value('ticket_purchase_total', f.total_ticket_purchase_amount)
	frm.set_value('ticket_sales_total', f.total_ticket_sales_amount)
	frm.set_value('gross_purchase_total', f.visa_purchase_total + f.hotel_purchase_total + f.add_ons_purchase_total + f.transport_purchase_total + f.ticket_purchase_total)
	frm.set_value('gross_sales_total', f.visa_sales_total + f.hotel_sales_total + f.add_ons_sales_total + f.transport_sales_total + f.ticket_sales_total)
	//frm.set_value('', )

}




frappe.ui.form.on('Package Document', {
	received(frm, cdt, cdn){
		//msgprint('asd')
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'remaining', d.required - d.received);
	}

})