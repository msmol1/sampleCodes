import { Template} from "meteor/templating";
import Collections from "/imports/api/collections/index.js";
import GLOBALS from "/imports/api/globals";

import "./step-1.html";
import "./additional-services/additional-services.js";
import "../../../common/products/products.js";

Template.Pages_Cart_Step1.onCreated(function () {
    let self = this;
    this.autorun(()=> {
        if (!Meteor.userId()) {
            self.subscribe("cart.productsForNotLogged", CartManager.getProductsId());
        }
    });
});

Template.Pages_Cart_Step1.onRendered(function () {
});

Template.Pages_Cart_Step1.onDestroyed(function () {
});

Template.Pages_Cart_Step1.helpers({
    additionalServices: function () {
        return Collections.Products.find({type: "whiteGoods"}).count() > 0;
    },
    anyProductInCart: function () {
        return CartManager.anyProductInCart(true);
    }
});

Template.Pages_Cart_Step1.events({
    "click #go-to-login": ()=> {
        Router.go("Main_Login");
    },
    "click #go-to-payment-form": ()=> {
        $("#additionalServices_submit_hidden").click();
    }
});
