// Copyright (c) 2021, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ticket Return Voucher', {
	ticket_no(frm){
		if(frm.doc.ticket_no){
			frappe.call({method: "get_booking_no", doc:frm.doc, callback:function(r){if(r.message){frm.set_value('tour_booking', r.message)} else{msgprint("No Booking found against this ticket no.")}}})	
		}
		
	},
	tour_booking(frm) {

		frappe.call({
			method:'get_tickets',
			doc:frm.doc,
			callback: function(r){
				frm.refresh_field("tickets");
				//frm.save()
			}
			
		})			
	}
});


cur_frm.set_query('tour_booking', function(){
	return{
		filters:{
			'docstatus':1,
			'total_ticket_sales_amount':['>', 0]
		}
	}
})

frappe.ui.form.on('Return Voucher Ticket', {
	customer_refund_charges(frm, cdt, cdn){
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'customer_return_charges', d.ticket_price - d.customer_refund_charges)
	}
})