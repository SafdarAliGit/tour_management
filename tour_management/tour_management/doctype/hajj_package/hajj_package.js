// Copyright (c) 2024, Unilink Enterprise and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hajj Package', {
    refresh: function (frm) {
        frm.set_query('hotel', 'package_hotel_detail', function (doc, cdt, cdn) {
            var d = locals[cdt][cdn];
            return {
                filters: [
                    ["Hotel", "city", "=", d.city]
                ]
            };
        });
    },
    package_price: function (frm) {
        calculate_amount(frm);
    },

    exchange_rate: function (frm) {
        calculate_amount(frm);
    }

});
function calculate_amount(frm) {
    var package_price = frm.doc.package_price;
    var exchange_rate = frm.doc.exchange_rate;
    if (exchange_rate < 1) {
        exchange_rate = 1;
    }
    if (package_price < 1) {
        package_price = 1;
    }
    frm.set_value('amount', package_price * exchange_rate);
}