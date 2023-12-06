// Copyright (c) 2021, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ticket', {
	before_save(frm){
		set_ticket_cost(frm)
	},
	market_fare(frm){
		frm.trigger("sb_rate");
		frm.trigger("svc_rate");
		frm.trigger("srb_rate");
		frm.trigger("com_rate");
		set_ticket_cost(frm);
	},
	apt(frm){
		set_ticket_cost(frm);
	},
	dof(frm){
		set_ticket_cost(frm);
	},
	ins(frm){
		set_ticket_cost(frm);
	},
	yq(frm){
		set_ticket_cost(frm);
	},
	fed(frm){
		set_ticket_cost(frm);
	},
	ced(frm){
		set_ticket_cost(frm);
	},
	yr(frm){
		set_ticket_cost(frm);
	},
	ftt(frm){
		set_ticket_cost(frm);
	},
	ptt(frm){
		set_ticket_cost(frm);
	},
	oas(frm){
		set_ticket_cost(frm);
	},
	pq(frm){
		set_ticket_cost(frm);
	},
	oad(frm){
		set_ticket_cost(frm);
	},
	svc_rate: function(frm){
		frm.doc.svc_amount = Math.round(frm.doc.market_fare * frm.doc.svc_rate /100);
		frm.refresh_field("svc_amount");
		frm.trigger("srb_rate")
		set_ticket_cost(frm);
	},
	svc_amount: function(frm){
		frm.doc.svc_rate = (frm.doc.svc_amount / frm.doc.market_fare) * 100;
		frm.refresh_field("svc_amount");
		frm.refresh_field("svc_rate");
		frm.trigger("srb_rate")
		set_ticket_price(frm);
	},
	srb_rate: function(frm){
		frm.doc.srb_amount = Math.round(frm.doc.svc_amount * frm.doc.srb_rate /100);
		frm.refresh_field("srb_amount");
		set_ticket_cost(frm);
	},
	srb_amount: function(frm){
		frm.doc.srb_rate = (frm.doc.srb_amount / frm.doc.svc_amount) * 100;
		frm.refresh_field("srb_amount");
		frm.refresh_field("srb_rate");
		set_ticket_price(frm);
	},
	sp_rate: function(frm){
		frm.doc.sp_amount = Math.round(frm.doc.market_fare * frm.doc.sp_rate /100);
		frm.refresh_field("sp_amount");
		set_ticket_cost(frm);
	},
	sp_amount: function(frm){
		frm.doc.sp_rate = (frm.doc.sp_amount / frm.doc.market_fare) * 100;
		frm.refresh_field("sp_amount");
		frm.refresh_field("sp_rate");
		set_ticket_price(frm);
	},
		
	city_tax_rate(frm){
		set_ticket_cost(frm);
	},
	city_tax_amount(frm){	
		set_ticket_cost(frm);
	},
	tickets_remove(frm){
		set_ticket_totals(frm);
	},
	discount_amount: function(frm) {
		frm.doc.discount_rate =	(frm.doc.discount_amount / frm.doc.market_fare) * 100;
		frm.refresh_field("discount_amount");
		frm.refresh_field("discount_rate");
		set_ticket_cost(frm);
	},

	discount_rate: function(frm) {
		frm.doc.discount_amount = Math.round((frm.doc.market_fare * frm.doc.discount_rate) / 100);
		frm.refresh_field("discount_amount");
		set_ticket_cost(frm);
	},
	departure_time(frm){
		var d = frm.doc;
		if(d.departure_time!='' && d.departure_time.split('')[3]!=':'){
			frm.set_value('departure_time', times(d.departure_time))
		}
	},
	arrival_time(frm){
		var d = frm.doc;
		if(d.arrival_time!='' && d.arrival_time.split('')[3]!=':'){
			frm.set_value('arrival_time', times(d.arrival_time))
		}
	},
	rdeparture_time(frm){
		var d = frm.doc;
		if(d.rdeparture_time!='' && d.rdeparture_time.split('')[3]!=':'){
			frm.set_value('rdeparture_time', times(d.rdeparture_time))
		}
	},
	rarrival_time(frm){
		var d = frm.doc;
		if(d.rarrival_time!='' && d.rarrival_time.split('')[3]!=':'){
			frm.set_value('rarrival_time', times(d.rarrival_time))
		}
	},
	crdeparture_time(frm){
		var d = frm.doc;
		if(d.crdeparture_time!='' && d.crdeparture_time.split('')[3]!=':'){
			frm.set_value('crdeparture_time', times(d.crdeparture_time))
		}
	},
	crarrival_time(frm){
		var d = frm.doc;
		if(d.crarrival_time!='' && d.crarrival_time.split('')[3]!=':'){
			frm.set_value('crarrival_time', times(d.crarrival_time))
		}
	},
	cdeparture_time(frm){
		var d = frm.doc;
		if(d.cdeparture_time!='' && d.cdeparture_time.split('')[3]!=':'){
			frm.set_value('cdeparture_time', times(d.cdeparture_time))
		}
	},
	carrival_time(frm){
		var d = frm.doc;
		if(d.carrival_time!='' && d.carrival_time.split('')[3]!=':'){
			frm.set_value('carrival_time', times(d.carrival_time))
		}
	},
	com_rate: function(frm) {
		frm.doc.com_amount = Math.round((frm.doc.market_fare * frm.doc.com_rate) / 100);
		frm.refresh_field("com_amount");
		frm.trigger("wht_rate");
		set_ticket_cost(frm);
	},
	com_amount: function(frm){
		frm.doc.com_rate =	(frm.doc.com_amount / frm.doc.market_fare) * 100;
		frm.refresh_field("com_amount");
		frm.refresh_field("com_rate");
		frm.trigger("wht_rate");
		set_ticket_cost(frm);
	},	
	wht_rate: function(frm) {
		frm.doc.wht_amount = Math.round((frm.doc.com_amount * frm.doc.wht_rate) / 100);
		frm.refresh_field("wht_amount");
		set_ticket_cost(frm);
	},
	wht_amount: function(frm){
		frm.doc.wht_rate =	(frm.doc.wht_amount / frm.doc.com_amount) * 100;
		frm.refresh_field("wht_amount");
		frm.refresh_field("wht_rate");
		set_ticket_cost(frm);
	},
	is_return(frm){
		var d = frm.doc;
		if(d.is_return){
			frm.set_value('rsector', d.sector)
			frm.set_value('rflight_code', d.flight_code)
			frm.set_value('rdeparture', d.arrival)
			frm.set_value('rarrival', d.departure)
			frm.set_value('rdeparture_class', d.departure_class)
			frm.set_value('rarrival_class', d.arrival_class)
			frm.set_value('rdeparture_date', d.departure_date)
			frm.set_value('rdeparture_time', d.departure_time)
			frm.set_value('rarrival_date', d.arrival_date)
			frm.set_value('rarrival_time', d.arrival_time)
		}
		else{
			frm.set_value('rsector', '')
			frm.set_value('rflight_code', '')
			frm.set_value('rdeparture', '')
			frm.set_value('rarrival', '')
			frm.set_value('rdeparture_class', '')
			frm.set_value('rarrival_class', '')
			frm.set_value('rdeparture_date', '')
			frm.set_value('rdeparture_time', '')
			frm.set_value('rarrival_date', '')
			frm.set_value('rarrival_time', '')
		}
	},
	cis_return(frm){
		var d = frm.doc;
		if(d.cis_return){
			frm.set_value('crsector', d.csector)
			frm.set_value('crflight_code', d.cflight_code)
			frm.set_value('crdeparture', d.carrival)
			frm.set_value('crarrival', d.cdeparture)
			frm.set_value('crdeparture_class', d.cdeparture_class)
			frm.set_value('crarrival_class', d.carrival_class)
			frm.set_value('crdeparture_date', d.cdeparture_date)
			frm.set_value('crdeparture_time', d.cdeparture_time)
			frm.set_value('crarrival_date', d.carrival_date)
			frm.set_value('crarrival_time', d.carrival_time)
		}
		else{
			frm.set_value('crsector', '')
			frm.set_value('crflight_code', '')
			frm.set_value('crdeparture', '')
			frm.set_value('crarrival', '')
			frm.set_value('crdeparture_class', '')
			frm.set_value('crarrival_class', '')
			frm.set_value('crdeparture_date', '')
			frm.set_value('crdeparture_time', '')
			frm.set_value('crarrival_date', '')
			frm.set_value('crarrival_time', '')
		}
	},
	include_wht_in_price(frm){
		console.log("stptrig")
		set_ticket_price(frm);
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



function set_ticket_cost(frm){

	
	var d = frm.doc;
	var cost = d.market_fare + d.apt + d.dof + d.ins + d.yq + d.fed + d.ced + d.yr + d.ftt + d.ptt + d.oas + d.pq + d.oad;
	
	frm.set_value('ticket_cost', cost + d.city_tax_amount + d.wht_amount - d.com_amount)
	set_ticket_price(frm);
}

function set_ticket_price(frm){
	console.log("stpinit")
	var d = frm.doc;
	var price = 0;
	if(d.include_wht_in_price){
		console.log("stpincwht")
		price = d.ticket_cost + d.svc_amount + d.com_amount
	}
	else{
		console.log("stpexcwht")
		price = d.ticket_cost + d.svc_amount + d.com_amount - d.wht_amount	
	}
	
	frm.set_value('ticket_price', d.srb_amount + price - d.discount_amount)
	console.log("stpset")
}

	
