/**
 * Copyright (C) OneBi Sp. z o.o. All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Created by Lukasz Pazgan, 2016-10-24
 */

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import Collections from "/imports/api/collections";
import DefaultValues from "/imports/api/form-schemas/default-values";

const Schema = new SimpleSchema({
    amount: {
        type: Number,
        min:1,
        decimal: false,
        optional: false
    },
    productId: {
        type: String,
        optional:false,
        custom: function() {
            if (Meteor.isServer && this.isSet) {
                let product = Collections.Products.findOne({_id: this.value});
                if(!product)
                    return "required";
                if(!product.isValid)
                    return "notAvailable";

            }
        }
    }
});
export default Schema;