// Copyright (c) 2020, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hotel', {
	after_save(frm){
		frm.refresh_field('costs')
		frm.refresh_field('prices')
	}
});




frappe.ui.form.on('Hotel Room Selling Price List', {
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

frappe.ui.form.on('Hotel Room Purchasing Price List', {
	vat(frm, cdt, cdn) {
		set_vat(frm, cdt, cdn)
		set_margin(frm, cdt, cdn);
	},
	wrent_weekend(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	},
	wrent_weekdays(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	},
	wextra_bed_charges(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
	},
	sales_vat(frm, cdt, cdn) {
		set_vat(frm, cdt, cdn)
	},
	sales_rent_weekdays(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
		set_margin(frm, cdt, cdn)
	},
	sales_rent_weekend(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
		set_margin(frm, cdt, cdn)
	},
	sales_extra_bed_charges(frm, cdt, cdn){
		set_vat(frm, cdt, cdn)
		set_margin(frm, cdt, cdn)
	},
	based_on_margin(frm, cdt, cdn){
		set_margin(frm, cdt, cdn);
	},
	margin(frm, cdt, cdn){
		set_margin(frm, cdt, cdn);

	},
	breakfast_rate(frm, cdt, cdn){
		set_meals(frm, cdt, cdn)
	},

	lunch_rate(frm, cdt, cdn){
		set_meals(frm, cdt, cdn)
	},

	dinner_rate(frm, cdt, cdn){
		set_meals(frm, cdt, cdn)
	}
});

function avg(val1, val2){
	return (val2 - val1)/val1*100;
}

function set_margin(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	if(d.based_on_margin == 0){
		//frappe.model.set_value(d.doctype, d.name, 'margin', (avg(d.rent_weekend, d.sales_rent_weekend)+avg(d.rent_weekdays, d.sales_rent_weekdays)+avg(d.extra_bed_charges, d.sales_extra_bed_charges))/3)
	}
	else if(d.margin > 0){
		frappe.model.set_value(d.doctype, d.name, 'sales_rent_weekend', (d.rent_weekend * d.margin / 100)+d.rent_weekend);
		frappe.model.set_value(d.doctype, d.name, 'sales_rent_weekdays', (d.rent_weekdays * d.margin / 100)+d.rent_weekdays);
		frappe.model.set_value(d.doctype, d.name, 'sales_extra_bed_charges', (d.extra_bed_charges * d.margin / 100)+d.extra_bed_charges);
	}
}


function set_vat(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	frappe.model.set_value(d.doctype, d.name, 'rent_weekend', ((d.wrent_weekend + d.breakfast_rate + d.lunch_rate + d.dinner_rate) * d.vat / 100) + (d.wrent_weekend + d.breakfast_rate + d.lunch_rate + d.dinner_rate));
	frappe.model.set_value(d.doctype, d.name, 'rent_weekdays', ((d.wrent_weekdays+d.breakfast_rate + d.lunch_rate + d.dinner_rate) * d.vat / 100) + (d.wrent_weekdays+d.breakfast_rate + d.lunch_rate + d.dinner_rate));
	//frappe.model.set_value(d.doctype, d.name, 'rent_weekend', (d.wrent_weekend *d.vat / 100)+d.wrent_weekend);
	//frappe.model.set_value(d.doctype, d.name, 'rent_weekdays', (d.wrent_weekdays *d.vat / 100)+d.wrent_weekdays);
	frappe.model.set_value(d.doctype, d.name, 'extra_bed_charges', (d.wextra_bed_charges *d.vat / 100)+d.wextra_bed_charges);

	frappe.model.set_value(d.doctype, d.name, 'sales_rent_weekend_inc_vat', (d.sales_rent_weekend *d.sales_vat / 100)+d.sales_rent_weekend);
	frappe.model.set_value(d.doctype, d.name, 'sales_rent_weekdays_inc_vat', (d.sales_rent_weekdays *d.sales_vat / 100)+d.sales_rent_weekdays);
	frappe.model.set_value(d.doctype, d.name, 'sales_extra_bed_charges_inc_vat', (d.sales_extra_bed_charges *d.sales_vat / 100)+d.sales_extra_bed_charges);

}




function set_vat1(frm, cdt, cdn){
	var d = locals[cdt][cdn];

	frappe.model.set_value(d.doctype, d.name, 'rent_weekend', (d.wrent_weekend * d.vat / 100) + d.wrent_weekend);
	frappe.model.set_value(d.doctype, d.name, 'rent_weekdays', (d.wrent_weekdays * d.vat / 100) + d.wrent_weekdays);
	frappe.model.set_value(d.doctype, d.name, 'extra_bed_charges', (d.wextra_bed_charges * d.vat / 100) + d.wextra_bed_charges);
}


function set_meals(frm, cdt, cdn){
	var d = locals[cdt][cdn];
	set_vat(frm, cdt, cdn)
}