# -*- coding: utf-8 -*-
# Copyright (c) 2021, Unilink Enterprise and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
class TourPackage(Document):

	def get_visa_cost(self):
		valid_date = frappe.db.get_value('Visa Purchasing Price List', {'parent':self.visa_agent_price_list}, 'max(rates_valid_till)')
		return frappe.db.get_value('Visa Purchasing Price List', {'parent':self.visa_agent_price_list, 'rates_valid_till': valid_date}, ['rate_adult', 'rate_child', 'rate_infant'])


	def get_visa_price(self):
		valid_date = frappe.db.get_value('Visa Price List', {'parent':self.visa_selling_price_list}, 'max(rates_valid_till)')
		return frappe.db.get_value('Visa Price List', {'parent':self.visa_selling_price_list, 'rates_valid_till': valid_date}, ['rate_adult', 'rate_child', 'rate_infant'])

	def get_hotel_price(self, room_type, hotel):
		valid_date = frappe.db.get_value('Hotel Room Selling Price List', {'parent':hotel, 'room_type': room_type}, 'max(rates_valid_till)')
		return frappe.db.get_value('Hotel Room Selling Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges'])


	def get_hotel_cost(self, hotel, room_type):
		valid_date = frappe.db.get_value('Hotel Room Purchasing Price List', {'parent':hotel, 'room_type': room_type}, 'max(rates_valid_till)')
		return frappe.db.get_value('Hotel Room Purchasing Price List', {'parent':hotel, 'room_type': room_type, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges'])

	def get_hotel_agent_cost(self, agent, room_type, hotel):
		valid_date = frappe.db.get_value('Hotel Agent Purchasing Price List', {'parent':agent, 'room_type': room_type, 'hotel':hotel}, 'max(rates_valid_till)')
		return frappe.db.get_value('Hotel Agent Purchasing Price List', {'parent':agent, 'room_type': room_type, 'hotel':hotel, 'rates_valid_till': valid_date}, ['rent_weekdays', 'rent_weekend', 'extra_bed_charges'])

	def vehicle_cost(self, transporter, vehicle):
		return frappe.db.get_value('Transporter Transport', {'parent':transporter, 'vehicle':vehicle}, ['fare', 'fare_per_seat', 'fare_per_day'])


@frappe.whitelist()
def create_booking(source_name, target_doc=None):
	doclist = get_mapped_doc("Tour Package", source_name, {
		"Tour Package": {
			"doctype": "Tour Booking"				
		},
		"Package Ticket": {
			"doctype": "Booking Ticket Detail",
		},
		"Package Hotel": {
			"doctype": "Booking Hotel",
		},
		"Package Transport": {
			"doctype": "Booking Transport",
		},
		"Package Add on Service": {
			"doctype": "Booking Add On Service",
		}

	}, target_doc, ignore_permissions=True)
	return doclist