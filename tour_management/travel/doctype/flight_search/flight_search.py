# -*- coding: utf-8 -*-
# Copyright (c) 2021, Unilink Enterprise and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from amadeus import Client, ResponseError

class FlightSearch(Document):
	def flight_search(self):
		amadeus = Client(
		    client_id=frappe.db.get_single_value("Amadeus Settings", "api_key"),
		    client_secret=frappe.db.get_single_value("Amadeus Settings", "api_secret")
		)
		try:
		    response = amadeus.shopping.flight_offers_search.get(
		        originLocationCode=frappe.db.get_value("City", self.source, "iata_code"),
		        destinationLocationCode=frappe.db.get_value("City", self.destination, "iata_code"),
		        departureDate=self.departure_date,
		        max=10,
		        adults=self.adults,
		        currencyCode=self.currency)
		    return response.data
		except ResponseError as error:
		    frappe.msgprint(error)

	def book_ticket(self):
		amadeus = Client(
		    client_id=frappe.db.get_single_value("Amadeus Settings", "api_key"),
		    client_secret=frappe.db.get_single_value("Amadeus Settings", "api_secret")
		)
		traveler = [
			{
				  'id': '1',
				  'dateOfBirth': '1997-10-30',
				  'name': {
				    'firstName': 'Nasir',
				    'lastName': 'Khan'
				  },
				  'gender': 'MALE',
				  'contact': {
				    'emailAddress': 'khan@gmail.com',
				    'phones': [{
				      'deviceType': 'MOBILE',
				      'countryCallingCode': '92',
				      'number': '3122665508'
				    }]
				  },
				'documents': [{
				    'documentType': 'PASSPORT',
				    'birthPlace': 'Karachi',
				    'issuanceLocation': 'Karachi',
				    'issuanceDate': '2015-04-14',
				    'number': '111111',
				    'expiryDate': '2025-04-14',
				    'issuanceCountry': 'PK',
				    'validityCountry': 'PK',
				    'nationality': 'PK',
				    'holder': True
				}]
			}
		]

		try:
		    # Flight Offers Search to search for flights from MAD to ATH
		    flight_search = amadeus.shopping.flight_offers_search.get(originLocationCode='MAD',
		                                                              destinationLocationCode='ATH',
		                                                              departureDate='2021-12-01',
		                                                              adults=1).data

		    # Flight Offers Price to confirm the price of the chosen flight
		    price_confirm = amadeus.shopping.flight_offers.pricing.post(flight_search[0]).data

		    # Flight Create Orders to book the flight
		    booked_flight = amadeus.booking.flight_orders.post(flight_search[0], traveler).data
		    foi = frappe.new_doc("Flight Order")
		    foi.flight_order_id = booked_flight.id
		    foi.save()
		    return booked_flight
		except ResponseError as error:
			raise error

	def get_booking(self, ref):
		amadeus = Client(
		    client_id=frappe.db.get_single_value("Amadeus Settings", "api_key"),
		    client_secret=frappe.db.get_single_value("Amadeus Settings", "api_secret")
		)
		return amadeus.booking.flight_orders(ref).get()