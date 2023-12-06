// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.pages['account-statement'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Account Statement (Ticket Wise)',
		single_column: true
	});
	wrapper.account_statement = new erpnext.AccountStatement(wrapper);

	frappe.breadcrumbs.add("Tour Management");
}

erpnext.AccountStatement = class AccountStatement {
	constructor(wrapper) {
		var me = this;
		// 0 setTimeout hack - this gives time for canvas to get width and height
		setTimeout(function() {
			me.setup(wrapper);
			//me.get_data();
		}, 0);
	}

	setup(wrapper) {
		var me = this;

		this.company_field = wrapper.page.add_field({"fieldtype": "Link", "fieldname": "customer", "options": "Customer",
			"label": __("Customer"), "reqd": 1, "default": "SAJID KATH",
			change: function() {
				me.customer = this.value
				me.get_data();
			}
		}),

		this.elements = {
			layout: $(wrapper).find(".layout-main-section"),
			from_date: wrapper.page.add_date(__("From Date")),
			to_date: wrapper.page.add_date(__("To Date")),
			refresh_btn: wrapper.page.set_primary_action(__("Refresh"),
				function() { me.get_data(); }, "fa fa-refresh"),
		};

		this.elements.no_data = $('<div class="alert alert-warning">' + __("No Data") + '</div>')
			.toggle(false)
			.appendTo(this.elements.layout);


		this.company = frappe.defaults.get_user_default('company');
		this.options = {
			from_date: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			to_date: frappe.datetime.get_today()
		};
		this.elements.funnel_wrapper = $('<br><div class="page-form row data-show"></div>')
			.appendTo(this.elements.layout);
		// set defaults and bind on change
		$.each(this.options, function(k, v) {
			if (['from_date', 'to_date'].includes(k)) {
				me.elements[k].val(frappe.datetime.str_to_user(v));
			} else {
				//me.elements[k].val(v);
			}

			
		});

		// bind refresh
		this.elements.refresh_btn.on("click", function() {
			me.get_data(this);
		});

		// bind resize
		$(window).resize(function() {
			me.render();
		});
		me.get_data(this);
	}
	get_data(btn) {
			var me = this;
			
		frappe.call({
			method:"tour_management.tour_management.page.account_statement.account_statement.get_tickets",
			args:{
				customer:this.company_field.value,
				from_date: this.options.from_date,
				to_date: this.options.to_date
			},
			callback: function(r) {
				if(r.message){
					console.log(r.message[0])
					add_row(r.message[0])
				}
			}
		})
		
		function add_row(data) {
			console.log("Hello")
			const $parent = this.elements.funnel_wrapper
			var table_data = frappe.render_template("account_statement",{"data":data});	
			$parent.html(table_data)
		}		
	}
	
		 		   		

};


