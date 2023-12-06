console.log("addon.js")





frappe.ui.form.on('Booking Add On Service', {
	qty_adult(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	qty_child(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	qty_infant(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	ex_s(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	ex_p(frm, cdt, cdn){
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
	price_adult(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	price_child(frm, cdt, cdn){
		addons_costing(frm, cdt, cdn);
	},
	price_infant(frm, cdt, cdn){
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
		frappe.model.set_value(d.doctype, d.name, 'ex_s', frm.doc.ers);
		frappe.model.set_value(d.doctype, d.name, 'ex_p', frm.doc.erp);
	
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
	frappe.model.set_value(d.doctype, d.name, 'purchase_pkr', d.ex_p * d.purchase);
	frappe.model.set_value(d.doctype, d.name, 'sale_pkr', d.ex_s * d.sale);
	set_addons_totals(frm);
}