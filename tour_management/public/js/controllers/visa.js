console.log("visa.js")







frappe.ui.form.on('Booking Visa', {

	qty_adult(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	qty_child(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	qty_infant(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);	
	},
	price_adult(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	price_child(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	price_infant(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	cost_adult(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	cost_child(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	cost_infant(frm, cdt, cdn){
		visa_costing(frm, cdt, cdn);
	},
	destination_country(frm, cdt, cdn){
		set_visa_selling_price_list(frm, cdt, cdn);
		set_visa_agent_price_list(frm, cdt, cdn);
	},
	visa_type(frm, cdt, cdn){
		set_visa_selling_price_list(frm, cdt, cdn);
		set_visa_agent_price_list(frm, cdt, cdn);
	},
	visa_agent(frm, cdt, cdn){		
		set_visa_agent_price_list(frm, cdt, cdn);
	},
	visas_add(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'visa_qty_adult', frm.doc.qty_adult);
		frappe.model.set_value(d.doctype, d.name, 'visa_qty_child', frm.doc.qty_child);
		frappe.model.set_value(d.doctype, d.name, 'visa_qty_infant', frm.doc.qty_infant);
		frappe.model.set_value(d.doctype, d.name, 'visa_exr_purchase', frm.doc.erp);
		frappe.model.set_value(d.doctype, d.name, 'visa_exr_sales', frm.doc.ers);
	},
	total_visa_cost_pkr(frm, cdt, cdn){		
		set_visa_totals(frm, cdt, cdn);
	},
	total_visa_amount_pkr(frm, cdt, cdn){		
		set_visa_totals(frm, cdt, cdn);
	},
	visas_remove(frm, cdt, cdn){		
		set_visa_totals(frm, cdt, cdn);
	},
	total_visa_cost(frm, cdt, cdn){		
		visa_ex(frm, cdt, cdn)
	},
	total_visa_amount(frm, cdt, cdn){		
		visa_ex(frm, cdt, cdn)
	},
	visa_exr_sales(frm, cdt, cdn){		
		visa_ex(frm, cdt, cdn)
	},
	visa_exr_purchase(frm, cdt, cdn){		
		visa_ex(frm, cdt, cdn)
	},


})







function visa_costing(frm, cdt, cdn){
	var f = locals[cdt][cdn];
	frappe.model.set_value(f.doctype, f.name, 'visa_total_adult', f.visa_qty_adult * f.price_adult)
	frappe.model.set_value(f.doctype, f.name, 'visa_total_child', f.visa_qty_child * f.price_child)
	frappe.model.set_value(f.doctype, f.name, 'visa_total_infant', f.visa_qty_infant * f.price_infant)
	frappe.model.set_value(f.doctype, f.name, 'total_visa_amount', f.visa_total_adult + f.visa_total_child + f.visa_total_infant)
	frappe.model.set_value(f.doctype, f.name, 'total_visa_cost', (f.visa_qty_adult * f.cost_adult) + (f.visa_qty_child * f.cost_child) + (f.visa_qty_infant * f.cost_infant))
	
}

function visa_ex(frm, cdt, cdn){
	var f = locals[cdt][cdn];
	frappe.model.set_value(f.doctype, f.name, 'total_visa_amount_pkr', f.total_visa_amount * f.visa_exr_sales)
	frappe.model.set_value(f.doctype, f.name, 'total_visa_cost_pkr', f.total_visa_cost * f.visa_exr_purchase)
}



function set_visa_cost(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.visa_agent_price_list){
		frappe.call({
			method: 'get_visa_cost',
			doc: frm.doc,
			args:{
				pl:d.visa_agent_price_list
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'cost_adult', r.message[0])
					frappe.model.set_value(d.doctype, d.name, 'cost_child', r.message[1])
					frappe.model.set_value(d.doctype, d.name, 'cost_infant', r.message[2])
					
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'cost_adult', 0)
					frappe.model.set_value(d.doctype, d.name, 'cost_child', 0)
					frappe.model.set_value(d.doctype, d.name, 'cost_infant', 0)
					msgprint('No valid rates found for the visa agent price list.')
				
				}
			}
		})
	}
	
}



function set_visa_price(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.visa_selling_price_list){
		frappe.call({
			method: 'get_visa_price',
			doc: frm.doc,
			args:{
				pl:d.visa_selling_price_list
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'price_adult', r.message[0])
					frappe.model.set_value(d.doctype, d.name, 'price_child', r.message[1])
					frappe.model.set_value(d.doctype, d.name, 'price_infant', r.message[2])
				}
				else{

					frappe.model.set_value(d.doctype, d.name, 'price_adult', 0)
					frappe.model.set_value(d.doctype, d.name, 'price_child', 0)
					frappe.model.set_value(d.doctype, d.name, 'price_infant', 0)
					frappe.model.set_value(d.doctype, d.name, 'No valid rates found for the visa price list.')
				
				}
			}
		})
	}
	
}



function set_visa_selling_price_list(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.visa_type && d.destination_country){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Visa Selling Price List',
				filters:{
					visa_type: d.visa_type,
					country: d.destination_country
				},
				fieldname:['name', 'currency']
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'visa_selling_price_list', r.message['name'])
					frappe.model.set_value(d.doctype, d.name, 'currency_sales', r.message['currency'])
					set_visa_price(frm, cdt, cdn)
				}
				else{
					frappe.model.set_value(d.doctype, d.name, 'visa_selling_price_list', '')
				}
			}
		})
	}
}





function set_visa_agent_price_list(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.visa_type && d.destination_country && d.visa_agent){
		frappe.call({
			method:'frappe.client.get_value',
			args:{
				doctype:'Visa Agent Price List',
				filters:{
					visa_type: d.visa_type,
					visa_for_country: d.destination_country,
					visa_agent: d.visa_agent
				},
				fieldname:['name', 'currency']
			},
			callback: function(r){
				if(r.message){
					frappe.model.set_value(d.doctype, d.name, 'visa_agent_price_list', r.message['name'])
					frappe.model.set_value(d.doctype, d.name, 'currency_purchase', r.message['currency'])
					set_visa_cost(frm, cdt, cdn)
				}
				else{
					frappe.model.set_value(d.doctype, d.name, 'visa_agent_price_list', '')
				}
			}
		})
	}
}

cur_frm.set_query("visa_selling_price_list", "visas", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
			
			visa_type: d.visa_type,
			country: d.destination_country
		}
	}
})

cur_frm.set_query("visa_agent_price_list", "visas", function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
			
			visa_type: d.visa_type,
			visa_for_country: d.destination_country,
			visa_agent: d.visa_agent
		}
	}
})