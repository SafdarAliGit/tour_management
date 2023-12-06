console.log("ticket.js")







frappe.ui.form.on('Booking Ticket Detail', {

	tickets_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		//frappe.model.set_value(d.doctype, d.name, 'qty_adult', frm.doc.qty_adult);
		//frappe.model.set_value(d.doctype, d.name, 'qty_child', frm.doc.qty_child);
		//frappe.model.set_value(d.doctype, d.name, 'qty_infant', frm.doc.qty_infant);	
		set_ticket_totals(frm);
	},
	ticket_no(frm, cdt, cdn){
		set_ticket_totals(frm);
	},
	pax_name(frm, cdt, cdn){
		set_ticket_totals(frm);
	},
	pax_no(frm, cdt, cdn){
		set_ticket_totals(frm);
	},


	market_fare(frm, cdt, cdn){
		frm.trigger("sb_rate");
		frm.trigger("svc_rate");
		frm.trigger("srb_rate");
		frm.trigger("com_rate");
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
	svc_rate(frm, cdt, cdn){
		var d = locals[cdt][cdn];
			frappe.model.set_value(d.doctype, d.name, 'svc_amount', Math.round(d.market_fare * d.svc_rate /100))
	},
	svc_amount(frm, cdt, cdn){
		set_ticket_price(frm, cdt, cdn);
	},
	srb_rate(frm, cdt, cdn){
		var d = locals[cdt][cdn];
			frappe.model.set_value(d.doctype, d.name, 'srb_amount', Math.round(d.svc_amount * d.srb_rate /100))
	},
	sp_rate(frm, cdt, cdn){
		var d = locals[cdt][cdn];
			frappe.model.set_value(d.doctype, d.name, 'sp_amount', Math.round(d.market_fare * d.sp_rate /100))
	},
	srb_amount(frm, cdt, cdn){
		set_ticket_price(frm, cdt, cdn);
	},
	qty(frm, cdt, cdn){
		ticket_costing(frm, cdt, cdn);
	},
	com_rate(frm, cdt, cdn){
		set_taxes(frm, cdt, cdn);
		
	},
	wht_rate(frm, cdt, cdn){
		set_wht(frm, cdt, cdn);
	},
	wht_amount(frm,cdt,cdn){
		set_taxes(frm,cdt,cdn);
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
	},
	departure_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.departure_time!='' && d.departure_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'departure_time', times(d.departure_time))
		}
	},
	arrival_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.arrival_time!='' && d.arrival_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'arrival_time', times(d.arrival_time))
		}
	},
	rdeparture_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.rdeparture_time!='' && d.rdeparture_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_time', times(d.rdeparture_time))
		}
	},
	rarrival_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.rarrival_time!='' && d.rarrival_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'rarrival_time', times(d.rarrival_time))
		}
	},
	crdeparture_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.crdeparture_time!='' && d.crdeparture_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_time', times(d.crdeparture_time))
		}
	},
	crarrival_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.crarrival_time!='' && d.crarrival_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'crarrival_time', times(d.crarrival_time))
		}
	},
	cdeparture_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.cdeparture_time!='' && d.cdeparture_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'cdeparture_time', times(d.cdeparture_time))
		}
	},
	carrival_time(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.carrival_time!='' && d.carrival_time.split('')[3]!=':'){
			frappe.model.set_value(d.doctype, d.name, 'carrival_time', times(d.carrival_time))
		}
	},
	wht_amount(frm, cdt, cdn){
		set_ticket_cost(frm, cdt, cdn)
	},	
	is_return(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.is_return){
			frappe.model.set_value(d.doctype, d.name, 'rsector', d.sector)
			frappe.model.set_value(d.doctype, d.name, 'rflight_code', d.flight_code)
			frappe.model.set_value(d.doctype, d.name, 'rdeparture', d.arrival)
			frappe.model.set_value(d.doctype, d.name, 'rarrival', d.departure)
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_class', d.departure_class)
			frappe.model.set_value(d.doctype, d.name, 'rarrival_class', d.arrival_class)
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_date', d.departure_date)
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_time', d.departure_time)
			frappe.model.set_value(d.doctype, d.name, 'rarrival_date', d.arrival_date)
			frappe.model.set_value(d.doctype, d.name, 'rarrival_time', d.arrival_time)
		}
		else{
			frappe.model.set_value(d.doctype, d.name, 'rsector', '')
			frappe.model.set_value(d.doctype, d.name, 'rflight_code', '')
			frappe.model.set_value(d.doctype, d.name, 'rdeparture', '')
			frappe.model.set_value(d.doctype, d.name, 'rarrival', '')
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_class', '')
			frappe.model.set_value(d.doctype, d.name, 'rarrival_class', '')
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_date', '')
			frappe.model.set_value(d.doctype, d.name, 'rdeparture_time', '')
			frappe.model.set_value(d.doctype, d.name, 'rarrival_date', '')
			frappe.model.set_value(d.doctype, d.name, 'rarrival_time', '')
		}
	},
	cis_return(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.cis_return){
			frappe.model.set_value(d.doctype, d.name, 'crsector', d.csector)
			frappe.model.set_value(d.doctype, d.name, 'crflight_code', d.cflight_code)
			frappe.model.set_value(d.doctype, d.name, 'crdeparture', d.carrival)
			frappe.model.set_value(d.doctype, d.name, 'crarrival', d.cdeparture)
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_class', d.cdeparture_class)
			frappe.model.set_value(d.doctype, d.name, 'crarrival_class', d.carrival_class)
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_date', d.cdeparture_date)
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_time', d.cdeparture_time)
			frappe.model.set_value(d.doctype, d.name, 'crarrival_date', d.carrival_date)
			frappe.model.set_value(d.doctype, d.name, 'crarrival_time', d.carrival_time)
		}
		else{
			frappe.model.set_value(d.doctype, d.name, 'crsector', '')
			frappe.model.set_value(d.doctype, d.name, 'crflight_code', '')
			frappe.model.set_value(d.doctype, d.name, 'crdeparture', '')
			frappe.model.set_value(d.doctype, d.name, 'crarrival', '')
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_class', '')
			frappe.model.set_value(d.doctype, d.name, 'crarrival_class', '')
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_date', '')
			frappe.model.set_value(d.doctype, d.name, 'crdeparture_time', '')
			frappe.model.set_value(d.doctype, d.name, 'crarrival_date', '')
			frappe.model.set_value(d.doctype, d.name, 'crarrival_time', '')
		}
	},
	include_wht_in_price(frm, cdt, cdn){
		console.log("stptrig")
		set_ticket_price(frm, cdt, cdn);
	}

});



function times(time){
	var tt = time.split('');
	if (tt[2] != ':'){
		if(!tt[2]){
			tt[2] = 0
		}
		if(!tt[3]){
			tt[3] = 0
		}
		time = tt[0]+tt[1]+':'+tt[2]+tt[3]
	}
	return time
}


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

function set_wht(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'wht_amount',  Math.round(d.com_amount * d.wht_rate / 100));
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
	console.log("stpinit")
	var d = locals[cdt][cdn];
	var price = 0;
	if(d.include_wht_in_price){
		console.log("stpincwht")
		price = d.ticket_cost + d.svc_amount + d.com_amount
	}
	else{
		console.log("stpexcwht")
		price = d.ticket_cost + d.svc_amount + d.com_amount - d.wht_amount	
	}
	
	frappe.model.set_value(d.doctype, d.name, 'ticket_price', d.srb_amount + price - d.discount_amount)
	console.log("stpset")
}



function ticket_costing(frm, cdt, cdn){
	var f = locals[cdt][cdn];
	set_ticket_totals(frm);
}






cur_frm.set_query("ticket", "tickets", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
			
			docstatus: 0
		}
	}
})