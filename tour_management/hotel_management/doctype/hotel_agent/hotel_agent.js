// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hotel Agent', {
	// refresh: function(frm) {

	// }
});


// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hotel Agent Purchasing Price List', {
	vat(frm, cdt, cdn) {
		set_vat(frm, cdt, cdn)
	},
	wrent_weekend(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	},
	wrent_weekdays(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	},
	wextra_bed_charges(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	}
});



function set_vat(frm, cdt, cdn){
	var d = locals[cdt][cdn];

	frappe.model.set_value(d.doctype, d.name, 'rent_weekend', (d.wrent_weekend *d.vat / 100)+d.wrent_weekend);
	frappe.model.set_value(d.doctype, d.name, 'rent_weekdays', (d.wrent_weekdays *d.vat / 100)+d.wrent_weekdays);
	frappe.model.set_value(d.doctype, d.name, 'extra_bed_charges', (d.wextra_bed_charges *d.vat / 100)+d.wextra_bed_charges);
}