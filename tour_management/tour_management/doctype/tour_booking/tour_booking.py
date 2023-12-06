# -*- coding: utf-8 -*-
# Copyright (c) 2020, Unilink Enterprise and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

class TourBooking(Document):
	@frappe.whitelist()
	def get_docs(self):
		if self.visa_selling_price_list and not self.documents:
			vs = frappe.get_doc('Visa Selling Price List', self.visa_selling_price_list)
			for row in vs.documents:
				docs = self.append('documents')
				docs.document_name = row.document_name
				docs.description = row.description
				docs.required = row.qty * self.qty_total
				docs.remaining = row.qty * self.qty_total

	def before_submit(self):
		self.validate_inv()
		self.create_invs()
		self.sales_inv()
		self.submit_tickets()


	@frappe.whitelist()
	def make_payment_entry(self):
		si = frappe.get_doc("Sales Invoice", {"booking_reference": self.name, "docstatus":1, "outstanding_amount":[">", 0]})
		pe = frappe.new_doc("Payment Entry")
		pe.posting_date = frappe.utils.nowdate()
		pe.payment_type = "Receive"
		pe.paid_to = frappe.db.get_single_value("Booking Settings", "default_payment_receipt_account")
		pe.party_type = "Customer"
		pe.party = si.customer
		pe.source_exchange_rate = 1
		pe.target_exchange_rate = 1
		pe.paid_amount = si.outstanding_amount
		pe.received_amount = si.outstanding_amount
		pe.append("references", {
			"reference_doctype": "Sales Invoice",
			"reference_name": si.name,
			"allocated_amount":si.outstanding_amount
		})
		pe.save()
		return pe.name


	@frappe.whitelist()
	def submit_tickets(self):
		for ticket in self.tickets:
			tick = frappe.get_doc("Ticket", ticket.ticket)
			if tick.docstatus == 0:
				tick.submit()

	@frappe.whitelist()
	def validate_inv(self):
		for visa in self.visas:
			if visa.visa_status != 'Approved':
				frappe.throw('Booking can not be submitted untill visa status in row #'+ str(visa.idx) +' is not Approved.')
		for ticket in self.tickets:
			if not ticket.ticket_no:
				frappe.throw('Booking can not be submitted untill ticket no in row #'+ str(ticket.idx) +' is not Confirmed.')

		for h in self.hotels:
			if h.status != 'Confirmed':
				frappe.throw('Booking can not be submitted untill hotel status in row #'+ str(h.idx) +' is not Confirmed.')

		for h in self.transports:
			if h.status != 'Confirmed':
				frappe.throw('Booking can not be submitted untill transport status in row #'+ str(h.idx) +' is not Confirmed.')

		for h in self.addons:
			if h.status != 'Confirmed':
				frappe.throw('Booking can not be submitted untill add on service status in row #'+ str(h.idx) +' is not Confirmed.')

		if self.status != 'Invoiced':
			frappe.throw('Booking can not be submitted untill the booking status is not Invoiced.')
	
	@frappe.whitelist()
	def get_visa_cost(self, pl):
		valid_date = frappe.db.get_value('Visa Purchasing Price List', {'parent':pl, 'rates_valid_till': ['>', frappe.utils.nowdate()]}, 'min(rates_valid_till)')
		return frappe.db.get_value('Visa Purchasing Price List', {'parent':pl, 'rates_valid_till': valid_date}, ['rate_adult', 'rate_child', 'rate_infant'])


	@frappe.whitelist()
	def get_visa_price(self, pl):
		valid_date = frappe.db.get_value('Visa Price List', {'parent':pl, 'rates_valid_till': ['>', frappe.utils.nowdate()]}, 'min(rates_valid_till)')
		return frappe.db.get_value('Visa Price List', {'parent':pl, 'rates_valid_till': valid_date}, ['rate_adult', 'rate_child', 'rate_infant'])

	@frappe.whitelist()
	def get_hotel_price(self, room_type, chin, hotel):
		valid_date = frappe.db.get_value('Hotel Room Selling Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': ['>', chin]}, 'min(rates_valid_till)')
		return frappe.db.get_value('Hotel Room Selling Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges', 'meal', 'vat'])

	@frappe.whitelist()
	def get_hotel_cost(self, hotel, room_type, chin):
		valid_date = frappe.db.get_value('Hotel Room Purchasing Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': ['>', chin]}, 'min(rates_valid_till)')
		return frappe.db.get_value('Hotel Room Purchasing Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges'])

	@frappe.whitelist()
	def get_hotel_agent_cost(self, agent, room_type, chin, hotel):
		valid_date = frappe.db.get_value('Hotel Agent Purchasing Price List', {'parent':agent, 'room_type': room_type, 'hotel':hotel, 'rates_valid_till': ['>', chin]}, 'min(rates_valid_till)')
		return frappe.db.get_value('Hotel Agent Purchasing Price List', {'parent':agent, 'room_type': room_type, 'hotel':hotel, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges'])

	@frappe.whitelist()
	def vehicle_cost(self, transporter, vehicle):
		return frappe.db.get_value('Transporter Transport', {'parent':transporter, 'vehicle':vehicle}, ['fare', 'fare_per_seat', 'fare_per_day'])

	@frappe.whitelist()
	def create_invs(self):
			self.hotel_inv()
			self.visa_inv()
			self.transport_inv()
			self.aos_inv()
			self.ticket_inovice()

	@frappe.whitelist()
	def hotel_inv(self):
		for line in self.hotels:
			inv = frappe.new_doc('Purchase Invoice')
			inv.booking_reference = self.name
			if line.hotel_agent:
				inv.supplier = frappe.db.get_value('Hotel Agent', line.hotel_agent, 'supplier')
			else:
				inv.supplier = frappe.db.get_value('Hotel', line.hotel, 'supplier')
			item = inv.append('items')
			if not frappe.db.get_single_value('Booking Settings', 'default_hotel_item'):
				frappe.throw('Please set default item for hotel in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
			item.item_code = frappe.db.get_single_value('Booking Settings', 'default_hotel_item')
			item.qty = 1
			item.rate = line.total_purchase
			item.reference_dt = 'Tour Booking'
			item.reference_dn = self.name
			inv.save()
			inv.submit()

	@frappe.whitelist()
	def visa_inv(self):
		for visa in self.visas:
			inv = frappe.new_doc('Purchase Invoice')
			inv.supplier = frappe.db.get_value('Visa Agent', visa.visa_agent, 'supplier')
			inv.booking_reference = self.name
			inv.currency = visa.visa_currency_purchase
			item = inv.append('items')
			if not frappe.db.get_single_value('Booking Settings', 'default_visa_item'):
				frappe.throw('Please set default item for visa in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
			item.item_code = frappe.db.get_single_value('Booking Settings', 'default_visa_item')
			item.qty = 1
			item.rate = visa.total_visa_cost
			item.reference_dt = 'Tour Booking'
			item.reference_dn = self.name
			item.line_reference = visa.name
			inv.save()
			inv.submit()

	@frappe.whitelist()
	def transport_inv(self):
		for line in self.transports:
			inv = frappe.new_doc('Purchase Invoice')
			inv.supplier = frappe.db.get_value('Transporter', line.transporter, 'supplier')
			inv.booking_reference = self.name
			item = inv.append('items')
			if not frappe.db.get_single_value('Booking Settings', 'default_transport_item'):
				frappe.throw('Please set default item for transport in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
			item.item_code = frappe.db.get_single_value('Booking Settings', 'default_transport_item')
			item.line_reference = line.name
			item.description = line.vehicle
			item.qty = 1
			item.rate = line.purchase
			item.reference_dt = 'Tour Booking'
			item.reference_dn = self.name
			inv.save()
			inv.submit()

	@frappe.whitelist()
	def aos_inv(self):
		for line in self.addons:
			inv = frappe.new_doc('Purchase Invoice')
			inv.supplier = line.vendor_ref
			inv.booking_reference = self.name
			#inv.currency = line.currency
			item = inv.append('items')
			if not frappe.db.get_single_value('Booking Settings', 'default_add_on_service_item'):
				frappe.throw('Please set default item for add on service in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
			item.item_code = frappe.db.get_single_value('Booking Settings', 'default_add_on_service_item')
			item.qty = 1
			item.line_reference = line.name
			item.rate = line.purchase
			item.reference_dt = 'Tour Booking'
			item.reference_dn = self.name
			inv.save()
			inv.submit()

	@frappe.whitelist()
	def ticket_inovice(self):
		for line in self.tickets:
			inv = frappe.new_doc('Purchase Invoice')
			inv.supplier = frappe.db.get_value('XO Agent', line.xo_agent, 'supplier') or frappe.db.get_value('Airline', line.airline, 'supplier')
			#inv.currency = self.visa_currency
			inv.booking_reference = self.name
			item = inv.append('items')
			if not frappe.db.get_single_value('Booking Settings', 'default_ticket_item'):
				frappe.throw('Please set default item for tickets in the <strong><a href="/desk#Form/Booking%20Settings">Booking Settings</a></strong>.')
			item.item_code = frappe.db.get_single_value('Booking Settings', 'default_ticket_item')
			item.description = line.ticket_no
			item.qty = 1
			item.line_reference = line.name
			item.rate = line.ticket_cost
			item.reference_dt = 'Tour Booking'
			item.reference_dn = self.name
			inv.save()
			inv.submit()

	@frappe.whitelist()
	def sales_inv(self):
		description = 'Against Booking#:'+self.name+".\n"
		if self.status == 'Invoiced':
			inv = frappe.new_doc('Sales Invoice')
			inv.customer = self.client_name
			inv.booking_reference = self.name
			inv.due_date = frappe.utils.add_days(frappe.utils.nowdate(), days=10)
			if self.visas:
				for v in self.visas:
					item = inv.append('items')
					item.item_code = frappe.db.get_single_value('Booking Settings', 'default_visa_item')
					item.qty = 1
					item.description = description + str(v.visa_qty_adult)+" Adults, "+str(v.visa_qty_child)+" Child and "+str(v.visa_qty_infant)+" Infant Visa(s) for "+v.destination_country
					item.rate = v.total_visa_amount_pkr
					item.reference_dt = 'Tour Booking'
					item.reference_dn = self.name
					item.line_reference = v.name

			if self.hotel_total_sales_amount > 0:
				item1 = inv.append('items')
				item1.item_code = frappe.db.get_single_value('Booking Settings', 'default_hotel_item')
				item1.qty = 1
				item1.rate = self.hotel_total_sales_amount
				item1.reference_dt = 'Tour Booking'
				item1.reference_dn = self.name


			if self.transport_total_sales_amount > 0:
				item2 = inv.append('items')
				item2.item_code = frappe.db.get_single_value('Booking Settings', 'default_transport_item')
				item2.qty = 1
				item2.rate = self.transport_total_sales_amount
				item2.reference_dt = 'Tour Booking'
				item2.reference_dn = self.name

			if self.add_on_total_sales_amount > 0:
				item2 = inv.append('items')
				item2.item_code = frappe.db.get_single_value('Booking Settings', 'default_add_on_service_item')
				item2.qty = 1
				item2.rate = self.add_on_total_sales_amount
				item2.reference_dt = 'Tour Booking'
				item2.reference_dn = self.name

			for t in self.tickets:
				item2 = inv.append('items')
				item2.item_code = frappe.db.get_single_value('Booking Settings', 'default_ticket_item')
				item2.line_reference = t.name
				item2.description = t.ticket_no 
				item2.qty = 1
				item2.rate = t.ticket_price
				item2.reference_dt = 'Tour Booking'
				item2.reference_dn = self.name

			inv.save()
			inv.submit()



@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def route_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct route from `tabTransporter Transport` where parent=%s""", filters['transporter'])

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def vehicle_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct vehicle from `tabTransporter Transport` where parent=%s""", (filters['transporter']))

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def hotel_agent_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct parent from `tabHotel Agent Purchasing Price List` where hotel=%s""", (filters['hotel']))

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def room_type_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct room_type from `tabHotel Room Selling Price List` where parent=%s""", (filters['hotel']))


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def visa_agent_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct visa_agent from `tabVisa Agent Price List` where visa_for_country=%s and visa_type=%s""", (filters['destination_country'], filters['visa_type']))

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def visa_type_query(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select distinct visa_type from `tabVisa Selling Price List` where country=%s""", (filters['destination_country']))


@frappe.whitelist()
def create_package(source_name, target_doc=None):
	doclist = get_mapped_doc("Tour Booking", source_name, {
		"Tour Booking": {
			"doctype": "Tour Package"				
		},
		"Booking Ticket Detail": {
			"doctype": "Package Ticket",
		},
		"Booking Hotel": {
			"doctype": "Package Hotel",
		},
		"Booking Transport": {
			"doctype": "Package Transport",
		},
		"Booking Add On Service": {
			"doctype": "Package Add on Service",
		}

	}, target_doc, ignore_permissions=True)
	return doclist