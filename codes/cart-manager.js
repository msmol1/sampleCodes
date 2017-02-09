
import Collections from "/imports/api/collections";

CartManager = {

    getCart: function (checkAvailability) {
        let self = this;

        let cart = Meteor.userId() ? Collections.Cart.find({userId: Meteor.userId()}).fetch() : Session.get("cart");

        if (checkAvailability) {
            cart.forEach(function (product) {
                if (!Collections.Products.findOne({_id: product.productId})) {
                    self.removeProduct(product.productId, true);
                }
            });
        }
        return cart;
    },
    importCart: function () {
        if (Meteor.userId()) {
            let self = this;
            let cartSession = Session.get("cart");

            _.each(cartSession, (product)=> {
                self.addProduct(product.productId, product.amount);

                cartSession = _.reject(cartSession, (item)=> {
                    return item.productId == product.productId
                });
                Session.setPersistent("cart", cartSession);
            });
        }
    },

    getProductsId: function () {
        return  _.pluck(this.getCart(), "productId");
    },
    getTotalProductsNumber: function() {
        let total = 0;
        _.each(this.getCart(), (product)=> {
            total += product.amount;
        });
        return total;
    },
    addProduct: function (productId, amount) {

        let self = this;

        if (Meteor.userId()) {
            Meteor.call('shop.cart.addItem', productId, amount, function (err, result) {
                err ?
                    self.alertWarning(err) : self.alertSuccess(result)
            })
        } else {

            var ourCart = Session.get("cart");

            //Initialize cart if was empty
            if (_.isEmpty(ourCart)) {

                Session.setPersistent("cart", [{
                    productId: productId,
                    amount: amount
                }]);
                self.alertSuccess("You added " + amount + " products to your cart");
                return;
            }

            //check if we have this product in basket already
            let product = _.findWhere(ourCart, {productId: productId});
            if (product) {

                ourCart = _.reject(ourCart, (item)=> {
                    return item.productId === productId
                });

                amount += product.amount;
            }

            ourCart.push({
                productId: productId,
                amount: amount
            });

            Session.setPersistent("cart", ourCart);
            self.alertSuccess("You added " + amount + " products to your cart");
        }
    },
    removeProduct: function (productId, hideAlert) {

        let self = this;
        if (!Meteor.userId()) {

            var cart = Session.get("cart");
            cart = _.reject(cart, (item)=> {
                return item.productId == productId
            });
            Session.setPersistent("cart", cart);
        } else {

            Meteor.call("shop.cart.removeItem", productId, function (err, result) {
                if (!hideAlert)
                    err ? self.alertWarning(err) : self.alertSuccess(result)
            });
        }
    },
    anyProductInCart: function (checkAvailability) {
        return !_.isEmpty(this.getCart(checkAvailability))
    },
    getTotalPrice: function () {

        var cart = this.getCart();

        var totalPrice = 0;
        _.each(cart, (e)=> {
            totalPrice += this.getProductPrice(e.productId) * e.amount;
        });
        return formatNumber(totalPrice);
    },
    getProductPrice: function(idProduct) {

        let product = Collections.Products.findOne(idProduct);
        if(product)
            return product.priceWithoutContract;
        return 0;
    },
    getProductName: function(idProduct) {

        let product = Collections.Products.findOne(idProduct);
        if(product)
            return product.articleName;
        return "";
    },
    clearBasket() {
        if(!Meteor.userId())
            Session.clear("cart");
        else {

            Meteor.call("shop.cart.removeAll", function (err, result) {
                if(err)
                    self.alertWarning(err);
            });
        }
    },
    alertWarning: function (text) {
        sAlert.warning(text, {
            timeout: 5000
        });
    },
    alertSuccess: function (text) {
        sAlert.success(text, {
            timeout: 5000
        });
    }
};


export { CartManager};
export default {CartManager};
