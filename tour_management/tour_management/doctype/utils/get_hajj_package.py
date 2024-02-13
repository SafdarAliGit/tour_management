import frappe


@frappe.whitelist()
def get_hajj_package(**args):
    hajj_package_id = args.get('hajj_package_id')
    hp = frappe.qb.DocType("Hajj Package")
    parent_query = (
        frappe.qb.from_(hp)
        .select(
            hp.package_name,
            hp.package_description,
            hp.islamic_year,
            hp.maktab,
            hp.term,
            hp.days,
            hp.package_price,
            hp.exchange_rate,
            hp.amount,
            hp.name
        ).where((hp.name == hajj_package_id))
    )
    hajj_package = parent_query.run(as_dict=True)

    phd = frappe.qb.DocType("Package Hotel Detail")
    phd_query = (
        frappe.qb.from_(phd)
        .select(
            phd.city,
            phd.hotel,
            phd.nights,
            phd.room_type,
            phd.meal
        ).where((phd.parent == hajj_package_id))
    )
    hotel_detail = phd_query.run(as_dict=True)

    pfd = frappe.qb.DocType("Package Flight Detail")
    pfd_query = (
        frappe.qb.from_(pfd)
        .select(
            pfd.type,
            pfd.cls,
            pfd.airline
        ).where((pfd.parent == hajj_package_id))
    )
    flight_detail = pfd_query.run(as_dict=True)

    return {
        "hajj_package": hajj_package,
        "hotel_detail": hotel_detail,
        "flight_detail": flight_detail
    }
