frappe.ui.form.on('Shipment', {

    setup: function (frm) {
        // TODO: this must be running from core frappe code. Some glitch make us hardcoded the realtime handler here.
        frappe.realtime.on('doc_update', () => { // See: https://github.com/frappe/frappe/pull/11137
            frm.reload_doc(); // Reload form UI data from db.
        });
    },

    onload: function(frm) {

        frm.set_query('shipment_lines', () => {
            return {
                'filters': [
                    ['Warehouse Receipt', 'status', '=', 'Open']
                ]
            }
        });

    },

    refresh: function(frm) {
        if (frm.is_new()) {
            return;
        }

        if (frm.doc.status === 'Open') {
            frm.page.add_action_item(__('Confirm Transit'), () => {
                frappe.utils.play_sound('click');  // Really Necessary?
                frappe.call({
                    method: 'parcel_management.shipment_management.doctype.shipment.actions.mark_shipment_in_transit',
                    args: {source_name: frm.doc.name}
                });
            });
        } else {
            frm.page.clear_actions_menu();
        }

        // TODO: Add intro message for helper!
    }

});
