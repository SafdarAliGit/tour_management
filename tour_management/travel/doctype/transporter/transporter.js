// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Transporter', {
	// refresh: function(frm) {

	// }
});




frappe.ui.form.on('Transporter Transport', {
	fare(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'fare_per_seat', d.fare/d.vehicle_capacity)
	}
});

