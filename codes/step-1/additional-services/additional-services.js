import { Template} from "meteor/templating";
import Collections from "/imports/api/collections/index.js";
import GLOBALS from "/imports/api/globals";

import "./additional-services.html";
import "./additional-services.less";
import CONST from "/imports/api/constants";

Template.Pages_Cart_AdditionalServices.onCreated(function () {
    this.subscribe("cart.additionalServices");
});

Template.Pages_Cart_AdditionalServices.onRendered(function () {
    AutoForm.addHooks("autoform-main-user-cart-additionalServices", {
        onSuccess: (formType, result)=> {
            CartManager.addServices(result.content);
            Router.go("Cart_Step2");
        }
    }, true);
});

Template.Pages_Cart_AdditionalServices.onDestroyed(function () {
});

Template.Pages_Cart_AdditionalServices.helpers({
    options:()=> {
        return (Collections.AdditionalServices.find({ isValid : true }).fetch()).map((item)=>{
            return {label: item.content, value: item._id};
        });
    },
    formDoc: ()=> {
        return {
            products: CartManager.getCart()

        }
    }
});

Template.Pages_Cart_AdditionalServices.events({
});
