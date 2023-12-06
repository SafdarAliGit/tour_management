# -*- coding: utf-8 -*-
# Copyright (c) 2020, Unilink Enterprise and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Hotel(Document):
	def before_save(self):
		self.validate_list()
		self.set_pl()
		self.sorts()
		self.sorts_p()

	def sorts(self):
		for i, item in enumerate(sorted(self.costs, key=lambda item: item.rates_valid_from), start=1):
			item.idx = i

	def sorts_p(self):
		for i, item in enumerate(sorted(self.prices, key=lambda item: item.rates_valid_from), start=1):
			item.idx = i


	def set_pl(self):
		self.prices = []
		for r in self.costs:
			p = self.append('prices')
			p.room_type = r.room_type 
			#p.meal = r.meal
			p.rates_valid_from = r.rates_valid_from
			p.rates_valid_till = r.rates_valid_till
			p.vat = r.sales_vat
			p.wrent_weekend = r.sales_rent_weekend
			p.wrent_weekdays = r.sales_rent_weekdays
			p.wextra_bed_charges = r.sales_extra_bed_charges
			p.rent_weekend = r.sales_rent_weekend_inc_vat
			p.rent_weekdays = r.sales_rent_weekdays_inc_vat
			p.extra_bed_charges = r.sales_extra_bed_charges_inc_vat
			p.meal = r.meal

	def validate_list(self):
		for c in self.costs:
			for cc in self.costs:
				if c.room_type == cc.room_type and c.idx!=cc.idx:
					if c.rates_valid_from == cc.rates_valid_from:
						frappe.throw("Dulicate valid from date for same room type found in <strong>Row#"+str(cc.idx)+" and Row#"+str(c.idx)+".</strong>")
					elif  c.rates_valid_till == cc.rates_valid_till:
						frappe.throw("Dulicate valid till date for same room type found in <strong>Row#"+str(cc.idx)+" and Row#"+str(c.idx)+".</strong>")
					elif c.rates_valid_from <= cc.rates_valid_till and c.rates_valid_from >= cc.rates_valid_from:
						frappe.throw("Valid from date conflicts in <strong>Row#"+str(cc.idx)+" and Row#"+str(c.idx)+".</strong>")


					