console.log("transport.js")




frappe.ui.form.on('Booking Transport', {
	qty(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	
	ex_p(frm, cdt, cdn){
		transport_costing(frm, cdt, cdn);
	},
	ex_s(frm, cdt, cdn){
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
		frappe.model.set_value(d.doctype, d.name, 'ex_p', frm.doc.erp);
		frappe.model.set_value(d.doctype, d.name, 'ex_s', frm.doc.ers);	
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
		if(d.capacity > 0 && d.capacity < d.qty){
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
	frappe.model.set_value(d.doctype, d.name, 'purchase_pkr', d.ex_p * d.purchase);
	frappe.model.set_value(d.doctype, d.name, 'sale_pkr', d.ex_s * d.sale);
	set_transport_totals(frm);
	
}