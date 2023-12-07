frappe.ui.form.on('Hajj Booking', {
    adult_package_amount_sar: function (frm) {
        calculateTotalPackage(frm);
    },

    child_package_amount_sar: function (frm) {
        calculateTotalPackage(frm);
    },

    child_without_bed_amount_sar: function (frm) {
        calculateTotalPackage(frm);
    },

    infant_package_sar: function (frm) {
        calculateTotalPackage(frm);
    },

    other_service_charges_sar: function (frm) {
        calculateTotalPackage(frm);
    },

    exchange_rate: function (frm) {
        calculateTotalPackage(frm);
    },

    advance_pkr: function (frm) {
       calculateTotalPackage(frm);
    },

    discount_pkr: function (frm) {
       calculateTotalPackage(frm);
    },
});

function calculateTotalPackage(frm) {
    var adult_package_amount_sar = frm.doc.adult_package_amount_sar || 0;
    var child_package_amount_sar = frm.doc.child_package_amount_sar || 0;
    var child_without_bed_amount_sar = frm.doc.child_without_bed_amount_sar || 0;
    var infant_package_sar = frm.doc.infant_package_sar || 0;
    var other_service_charges_sar = frm.doc.other_service_charges_sar || 0;
    var exchange_rate = frm.doc.exchange_rate || 0;
    var advance_pkr = frm.doc.advance_pkr || 0;
    var discount_pkr = frm.doc.discount_pkr || 0;
    var total_amount_pkr = 0;
    var balance = 0;
    var total_package_sar =
        cint(adult_package_amount_sar) +
        cint(child_package_amount_sar) +
        cint(child_without_bed_amount_sar) +
        cint(infant_package_sar) +
        cint(other_service_charges_sar);

    frm.set_value('total_package_sar', total_package_sar);

    if (exchange_rate) {
        total_amount_pkr = cint(total_package_sar) * cint(exchange_rate);
        frm.set_value('total_amount_pkr', total_amount_pkr.toFixed(0));
    }
    frm.set_value('balance_pkr', (cint(total_amount_pkr)-(cint(advance_pkr)+cint(discount_pkr))).toFixed(0));

}


