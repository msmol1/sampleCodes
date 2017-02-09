import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { TAPi18n } from "meteor/tap:i18n";
import Collections from "/imports/api/collections";
import AdditionalServices from "/imports/api/collections/additional-services/additional-services";
import Products from "/imports/api/form-schemas/main/order-products";

const Schema = new SimpleSchema({
    content: {
        type: [String],
        autoform: {
            type: "select-checkbox-inline"
        },
        optional: true,
        custom: function () {
            if(Meteor.isServer && this.isSet) {
                let length = Collections.AdditionalServices.find({_id: {$in: this.value}}).count();
                if (this.value.length != length)
                    return "notExists";
            }
        }
    },
    products: {
        type: [Products],
        optional: false
    }
});

Schema.i18n("forms.main.additionalServices");

export default Schema;