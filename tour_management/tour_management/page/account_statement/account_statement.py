import frappe

@frappe.whitelist()
def get_tickets(customer, from_date, to_date):
	return frappe.db.sql("""select 
		ticket_no,
		name
		from `tabTicket` where docstatus = 1""", as_dict=1)