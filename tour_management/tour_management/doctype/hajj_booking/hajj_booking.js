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
    hajj_package: function (frm) {
        var hajj_package_id = frm.doc.hajj_package;
        get_hajj_package(frm, hajj_package_id);
    }

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
    frm.set_value('balance_pkr', (cint(total_amount_pkr) - (cint(advance_pkr) + cint(discount_pkr))).toFixed(0));

}


function get_hajj_package(frm, hajj_package_id) {
    console.log(hajj_package_id);
    if (hajj_package_id) {
        // Clear existing data before adding new entries
        frm.clear_table("hotels");
        frm.clear_table("hajj_flight_detail");

        frappe.call({
            method: "tour_management.tour_management.doctype.utils.get_hajj_package.get_hajj_package",
            args: {
                hajj_package_id: hajj_package_id
            },
            callback: function (response) {
                if (response.message.hajj_package.length > 0) {
                    var packageData = response.message.hajj_package[0];
                    frm.set_value('package_duration', packageData.term);
                    frm.set_value('days', packageData.days);
                }

                if (response.message.hotel_detail) {
                    response.message.hotel_detail.forEach(function (hotel) {
                        let entry = frm.add_child("hotels");
                        entry.city = hotel.city,
                        entry.hotel = hotel.hotel,
                        entry.nights = hotel.nights,
                        entry.room_type = hotel.room_type,
                        entry.meal = hotel.meal
                    });
                }

                if (response.message.flight_detail) {
                    response.message.flight_detail.forEach(function (flight) {
                        var entry = frm.add_child("hajj_flight_detail");
                        entry.type = flight.type,
                        entry.cls = flight.cls,
                        entry.airline = flight.airline
                    });
                }

                frm.refresh_field('hotels');
                frm.refresh_field('hajj_flight_detail');
            }
        });
    }
}
