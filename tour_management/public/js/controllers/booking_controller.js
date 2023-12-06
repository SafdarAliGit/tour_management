{% include 'tour_management/public/js/controllers/visa.js' %};
{% include 'tour_management/public/js/controllers/hotel.js' %};
{% include 'tour_management/public/js/controllers/transport.js' %};
{% include 'tour_management/public/js/controllers/ticket.js' %};
{% include 'tour_management/public/js/controllers/addon.js' %};





/*

// for parent visa costing

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

*/

// for child table visa costing



/*
cur_frm.set_query("hotel_agent", "hotels", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	if(d.hotel){
		return {
			query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.hotel_agent_query',
			"filters": {
				hotel: d.hotel
			}
		}
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'hotel_agent', '')
		msgprint('Select Hotel First')
	}
})

cur_frm.set_query("room_type", "hotels", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	if(d.hotel){
		return {
			query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.room_type_query',
			"filters": {
				hotel: d.hotel
			}
		}
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'room_type', '')
		msgprint('Select Hotel First')
	}
})


cur_frm.set_query("visa_agent", "visas", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	if(d.destination_country && d.visa_type){
		return {
			query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.visa_agent_query',
			"filters": {
				visa_type: d.visa_type,
				destination_country: d.destination_country
			}
		}
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'visa_agent', '')
		msgprint('Select Destination Country and Visa Type First')
	}
})

cur_frm.set_query("visa_type", "visas", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	if(d.destination_country){
		return {
			query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.visa_type_query',
			"filters": {
				destination_country: d.destination_country
			}
		}
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'visa_type', '')
		msgprint('Select Destination Country and Visa Type First')
	}
})
*/


/*
cur_frm.set_query("vehicle", "transports", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn]
	if(d.route){
		return {
			query: 'tour_management.tour_management.doctype.tour_booking.tour_booking.vehicle_query',
			"filters": {
				transporter: d.transporter
			}
		}
	}
	else{
		frappe.model.set_value(d.doctype, d.name, 'car', '')
		msgprint('Select Transporter First')
	}
})

*/

/*
	for(var v in frm.doc.visas){
		if(frm.doc.visas[v].visa_qty_adult > 0){
			adult += frm.doc.visas[v].price_adult 	
		}
		if(frm.doc.visas[v].visa_qty_adult > 0){
			child += frm.doc.visas[v].price_child 	
		}
		if(frm.doc.visas[v].visa_qty_infant > 0){
			infant += frm.doc.visas[v].price_infant 	
		}
		
	}

	var trate = f.transport_total_sales_amount / f.qty_total
	adult +=  trate
	child += trate
	infant += trate

	for(var i in f.addons){
		adult += f.addons[i].price_adult
		child += f.addons[i].price_child
		infant += f.addons[i].price_infant

	}
	*/