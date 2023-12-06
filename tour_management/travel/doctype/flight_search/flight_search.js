// Copyright (c) 2021, Unilink Enterprise and contributors
// For license information, please see license.txt





frappe.ui.form.on('Flight Search', {
	books(frm){
		if(frm.doc.books){
			frm.toggle_display("details", false)
			frm.toggle_display("passenger_details", true)	
		}
		else
			{
			frm.toggle_display("details", true)
			frm.toggle_display("passenger_details", false)	
		}
		
	},
	refresh: function(frm) {
		
		



	},
	get_data(frm){
		$(frm.fields_dict["datas"].wrapper).html("");
		 		   		refresh_field("datas");
		frappe.call({
			method:"flight_search",
			doc:frm.doc,
			callback: function(r) {
				var flight_offer = r.message
				frm.set_value("flight", JSON.stringify(r.message[0]))
				console.log(r.message)
				var table_data = frappe.render_template("flight_search",{"data":r.message});
		 		   		$(frm.fields_dict["datas"].wrapper).html(table_data);
		 		   		refresh_field("datas");
			}
		})
	},
	book(frm){
		frappe.call({
			method:"book_ticket",
			doc:frm.doc,
			callback: function(r){
				var dataa = r.message;
				console.log(r.message)

				msgprint("Flight Order ID is <strong>"+dataa.id+"</strong>. PNR No is <strong>"+dataa.associatedRecords[0].reference+"</strong>. Origin System Code is <strong>"+dataa.associatedRecords[0].originSystemCode+"<strong>.")
			}
		})
	},
	get_details(frm){
		frappe.call({
			method:"get_booking",
			doc:frm.doc,
			args:{
				ref:frm.doc.reference_number
			},
			callback: function(r){
				console.log(r.message)
			}
		})
	}
});
