// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt


{% include 'tour_management/public/js/controllers/booking_controller.js' %};



frappe.ui.form.on('Tour Booking', {
	onload(frm){
	},
	validate(frm){
		set_ticket_totals(frm);
		set_totals(frm);
	},
	refresh(frm){
		frm.add_custom_button('Create Package', function(){
			frappe.model.open_mapped_doc({
				method: "tour_management.tour_management.doctype.tour_booking.tour_booking.create_package",
				frm: frm
			})
		})
		if(frm.doc.docstatus===1){
			frm.add_custom_button('Make Payment Entry', function(){
				frappe.call({
					method: "make_payment_entry",
					doc: frm.doc,
					callback(r){
						frappe.set_route("Form", "Payment Entry", r.message)
					}
				})
			})
		}
		
	},
	tour_days(frm){
		set_end(frm)
	},
	travel_date(frm){
		set_end(frm)
	},
	
	qty_adult(frm){
		set_qty(frm);
	},
	qty_child(frm){
		set_qty(frm);
	},
	qty_infant(frm){
		set_qty(frm);
	},
	
	booking_of(frm){
		if(frm.doc.booking_of == 'Umrah' || frm.doc.booking_of == 'Hajj'){
			frm.set_value('destination_country', 'Saudi Arabia')	
		}
		else{
			frm.set_value('destination_country', '')
		}
		
	},
	erp(frm){
	},
	ers(frm){
	}

});







function set_end(frm){
	if(frm.doc.travel_date && frm.doc.tour_days){
		frm.set_value('tour_end_date', frappe.datetime.add_days(frm.doc.travel_date, frm.doc.tour_days))	
	}
	
}












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








function set_visa_totals(frm){
	var visas = frm.doc.visas;
	var cost = 0;
	var price = 0;
	for(var i in visas){
		price += visas[i].total_visa_amount_pkr
		cost += visas[i].total_visa_cost_pkr
	}
	frm.set_value('visa_total_sales_amount', price);
	frm.set_value('visa_total_purchase_amount', cost);

}














function set_qty(frm){
	frm.set_value('qty_total', frm.doc.qty_adult + frm.doc.qty_child + frm.doc.qty_infant)
	set_tables_qty(frm);

}


function set_tables_qty(frm){

	validate_visas_cost(frm);

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


function validate_visas_cost(frm){
	var visas = frm.doc.visas;
	for(var i in visas){
		var f = visas[i];
		visas[i].visa_qty_adult = frm.doc.qty_adult
		visas[i].visa_qty_child = frm.doc.qty_child
		visas[i].visa_qty_infant = frm.doc.qty_infant
		visas[i].visa_total_adult= f.visa_qty_adult * f.price_adult
		visas[i].visa_total_child= f.visa_qty_child * f.price_child
		visas[i].visa_total_infant= f.visa_qty_infant * f.price_infant
		visas[i].total_visa_amount= f.visa_total_adult + f.visa_total_child + f.visa_total_infant
		visas[i].total_visa_cost= (f.visa_qty_adult * f.cost_adult) + (f.visa_qty_child * f.cost_child) + (f.visa_qty_infant * f.cost_infant)

	}
	frm.refresh_field('visas')
}



function calculate_pkg_rate(frm){


	var f = frm.doc; 
	var adult = 0;
	var child = 0;
	var infant = 0;
	var tadult = 0;
	var tchild = 0;
	var tinfant = 0;
	
	for(var t in f.tickets){
		if (f.tickets[t].ticket_for == 'Adult'){
			tadult += f.tickets[t].ticket_price
		}
		else if (f.tickets[t].ticket_for == 'Child'){
			tchild += f.tickets[t].ticket_price
		}
		else{
			tinfant += f.tickets[t].ticket_price
		}
		

	}


	if(frm.doc.qty_adult){
		frm.set_value('package_rate_adult', (frm.doc.gross_sales_total - tadult) / frm.doc.qty_total)	
		frm.set_value('ticket_rate_adult', tadult/frm.doc.qty_adult)
	}
	else{
		frm.set_value('package_rate_adult', 0)
		frm.set_value('ticket_rate_adult', 0)
	}
	if(frm.doc.qty_child){
		frm.set_value('package_rate_child', (frm.doc.gross_sales_total -tchild)/ frm.doc.qty_total)	
		frm.set_value('ticket_rate_child', tchild/frm.doc.qty_child)
	}
	else{
		frm.set_value('package_rate_child', 0)
		frm.set_value('ticket_rate_child', 0)
	}
	if(frm.doc.qty_infant){
		frm.set_value('package_rate_infant', (frm.doc.gross_sales_total -tinfant)/ frm.doc.qty_total)	
		frm.set_value('ticket_rate_infant', tinfant/frm.doc.qty_infant)
	}
	else{
		frm.set_value('package_rate_infant', 0)
		frm.set_value('ticket_rate_infant', 0)
	}

	
	
	
	
	

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
	set_ticket_totals(frm);

	var f = frm.doc;
	
	frm.set_value('visa_purchase_total', f.visa_total_purchase_amount)
	frm.set_value('visa_sales_total', f.visa_total_sales_amount)
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
	calculate_pkg_rate(frm);

}




frappe.ui.form.on('Booking Document', {
	received(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.received > d.required){
			frappe.model.set_value(d.doctype, d.name, 'received', 0);
			msgprint('Received quantity can not be greater than required quantity.');
		}
		else{
			frappe.model.set_value(d.doctype, d.name, 'remaining', d.required - d.received);	
		}		
	}

})



