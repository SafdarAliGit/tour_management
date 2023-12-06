# -*- coding: utf-8 -*-
# Copyright (c) 2021, Unilink Enterprise and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class TicketReturnVoucher(Document):
	@frappe.whitelist()
	def get_tickets(self):
		self.tickets = []
		if self.tour_booking:
			tb = frappe.get_doc('Tour Booking', self.tour_booking)
			for tt in tb.tickets:
				t = frappe.get_doc('Ticket', tt.ticket)
				if not tt.returned:
					d = self.append('tickets')
					d.line_reference = tt.name
					d.ticket = t.name
					d.market_fare = t.market_fare
					d.oad = t.oad
					d.oas = t.oas
					d.or_amount = t.or_amount
					d.pax_name = t.pax_name
					d.pax_no = t.pax_no
					d.pnr_no = t.pnr_no
					d.pq = t.pq
					d.ptt = t.ptt
					d.purchase_invoice_reference = frappe.db.get_value('Purchase Invoice Item', {"line_reference":tt.name}, "parent")
					d.rarrival = t.rarrival
					d.rdeparture = t.rdeparture
					d.rflight_code = t.rflight_code
					d.rsector = t.rsector
					d.sector = t.sector
					d.sp_amount = t.sp_amount
					d.srb_amount = t.srb_amount
					d.svc_amount = t.svc_amount
					d.ticket_cost = t.ticket_cost
					d.ticket_no = t.ticket_no
					d.ticket_price = t.ticket_price
					d.ticket_status = t.ticket_status
					d.ticket_type = t.ticket_type
					d.wht_amount = t.wht_amount
					d.xo_agent = t.xo_agent
					d.yq = t.yq
					d.yr = t.yr
					d.airline = t.airline
					d.apt = t.apt
					d.arrival = t.arrival
					d.carrival = t.carrival
					d.cdeparture = t.cdeparture
					d.ced = t.ced
					d.cflight_code = t.cflight_code
					d.cis_return = t.cis_return
					d.city_tax_amount = t.city_tax_amount
					d.com_amount = t.com_amount
					d.crarrival = t.crarrival
					d.crdeparture = t.crdeparture
					d.crflight_code = t.crflight_code
					d.crsector = t.crsector
					d.csector = t.csector
					d.departure = t.departure
					d.discount_amount = t.discount_amount
					d.dof = t.dof
					d.fare_type = t.fare_type
					d.fed = t.fed
					d.flight_code = t.flight_code
					d.flight_name = t.flight_name
					d.ftt = t.ftt
					d.ins = t.ins
					d.is_return = t.is_return
					d.kbp = t.kbp
					d.kbr = t.kbr


	def before_submit(self):
		self.validate_return()
		self.return_pinv()
		self.return_sinv()
		self.sc_pinv()
		self.sc_sinv()
		self.update_booking()

	def before_save(self):
		if not self.tickets:
			self.get_tickets()
		self.sales_invoice_reference = frappe.db.get_value("Sales Invoice", {"booking_reference":self.tour_booking, "docstatus":1}, "min(name)")
	@frappe.whitelist()
	def get_booking_no(self):
		tb = frappe.db.get_value("Booking Ticket", {"ticket_no": self.ticket_no, "returned":0}, 'parent')
		if tb:
			tbval = frappe.db.get_value("Tour Booking", tb, ['docstatus', 'total_ticket_sales_amount'])
			if tbval[0]==1 and tbval[1]>0:
				return tb


	@frappe.whitelist()
	def validate_return(self):
		count = 0
		for t in self.tickets:
			if t.return_this_ticket:
				count+=1
		if count == 0:
			frappe.throw('At least one ticket must be marked as returned before submitting the voucher.')


	def return_pinv(self):
		for t in self.tickets:
			if t.return_this_ticket:
				sinv = frappe.get_doc('Purchase Invoice', t.purchase_invoice_reference)
				rsinv = frappe.new_doc('Purchase Invoice')
				rsinv.return_against = sinv.name
				rsinv.ticket_return_voucher = self.name
				rsinv.supplier = sinv.supplier
				rsinv.booking_reference = sinv.booking_reference
				rsinv.is_return = True
				for item in sinv.items:
					ri = rsinv.append('items')
					ri.line_reference = item.line_reference
					ri.item_code = item.item_code
					ri.description = item.description
					ri.qty = 0 - item.qty
					ri.rate = item.rate
				rsinv.save()
				rsinv.submit()
				t.return_purchase_invoice_reference = rsinv.name

	def return_sinv(self):
		sinv = frappe.get_doc('Sales Invoice', self.sales_invoice_reference)
		rsinv = frappe.new_doc('Sales Invoice')
		rsinv.return_against = sinv.name
		rsinv.customer = sinv.customer
		rsinv.booking_reference = sinv.booking_reference
		rsinv.ticket_return_voucher = self.name
		rsinv.is_return = True
		for item in self.tickets:
			if item.return_this_ticket:
				ri = rsinv.append('items')
				ri.line_reference = item.line_reference
				ri.item_code = frappe.db.get_single_value('Booking Settings', 'default_ticket_item')
				ri.description = item.ticket_no
				ri.qty = -1
				ri.rate = item.ticket_price
		rsinv.save()
		rsinv.submit()
		self.return_sales_invoice_reference = rsinv.name

	def before_cancel(self):
		for t in self.tickets:
			if t.return_this_ticket:
				tbt = frappe.get_doc('Ticket', t.ticket)
				tbt.returned = 0
				tbt.purchase_service_charges = 0
				tbt.sales_service_charges = 0
				tbt.save()
				frappe.db.set_value("Booking Ticket", {"ticket": t.ticket, "parent":self.tour_booking}, "returned", 0)

	def update_booking(self):
		for t in self.tickets:
			if t.return_this_ticket:
				tbt = frappe.get_doc('Ticket', t.ticket)
				tbt.returned = 1
				tbt.purchase_service_charges = t.vendor_return_charges
				tbt.sales_service_charges = t.customer_return_charges
				tbt.save()
				frappe.db.set_value("Booking Ticket", {"ticket": t.ticket, "parent":self.tour_booking}, "returned", 1)

	def sc_pinv(self):
		for t in self.tickets:
			if t.return_this_ticket and t.vendor_return_charges > 0:
				sinv = frappe.get_doc('Purchase Invoice', t.purchase_invoice_reference)
				rsinv = frappe.new_doc('Purchase Invoice')
				rsinv.return_against = sinv.name
				rsinv.supplier = sinv.supplier
				rsinv.booking_reference = sinv.booking_reference
				rsinv.ticket_return_voucher = self.name
				ri = rsinv.append('items')
				ri.line_reference = t.line_reference
				if not frappe.db.get_single_value('Booking Settings', 'default_ticket_return_item'):
					frappe.throw('Please set default item for ticket return in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
				ri.item_code = frappe.db.get_single_value('Booking Settings', 'default_ticket_return_item')
				ri.description = t.ticket_no
				ri.qty = 1
				ri.rate = t.vendor_return_charges
				rsinv.save()
				rsinv.submit()
				t.return_charges_purchase_invoice_reference = rsinv.name

	def sc_sinv(self):
		for item in self.tickets:
			if item.return_this_ticket and item.customer_return_charges > 0:
				sinv = frappe.get_doc('Sales Invoice', self.sales_invoice_reference)
				rsinv = frappe.new_doc('Sales Invoice')
				rsinv.return_against = sinv.name
				rsinv.customer = sinv.customer
				rsinv.ticket_return_voucher = self.name
				rsinv.booking_reference = sinv.booking_reference
				
				ri = rsinv.append('items')
				ri.line_reference = item.line_reference
				if not frappe.db.get_single_value('Booking Settings', 'default_ticket_return_item'):
					frappe.throw('Please set default item for ticket return in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
				ri.item_code = frappe.db.get_single_value('Booking Settings', 'default_ticket_return_item')
				ri.description = item.ticket_no
				ri.qty = 1
				ri.rate = item.customer_return_charges
				rsinv.save()
				rsinv.submit()
				self.return_charges_sales_invoice_reference = rsinv.name