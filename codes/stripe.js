var Future = Npm.require('fibers/future');

Meteor.methods({
    stripeCreateCustomer: function (token, isHSA) {

        if (!this.userId || !checkIfVerifiedUser(this.userId))
            throw new Meteor.Error(403, 'Unauthorized access');


        var secret = Meteor.settings.private.stripe.testSecretKey;
        var Stripe = StripeAPI(secret);

        var stripeCustomer = new Future();

        let me = Meteor.users.findOne({_id: this.userId, 'profile.stripeClient': {$exists: true}});

        //check if there is already stripe customer  for current user.If he is not there, then create him
        if (!me) {
            Stripe.customers.create({
                source: token
            }, function (error, customer) {
                if (error) {
                    stripeCustomer.throw(new Meteor.Error(403, error.type));
                } else {
                    stripeCustomer.return(customer);
                }
            });
        } else {//otherwise add to existing one customer next card
            let customerStripeId = me.profile.stripeClient;


            Stripe.customers.createSource(
                customerStripeId,
                {
                    source: token
                },
                function (error, customer) {
                    if (error) {
                        stripeCustomer.throw(new Meteor.Error(403, error.type));
                    } else {
                        stripeCustomer.return(customer);
                    }
                }
            );
        }

        return stripeCustomer.wait();
    },
    getPatientStripeCards: function () {
        if (!this.userId || !checkIfVerifiedUser(this.userId))
            throw new Meteor.Error(403, 'Unauthorized access');

        var patient = Meteor.users.findOne({_id: this.userId, 'profile.userType': USER_TYPE.PATIENT});

        if (!patient.profile.stripeClient)
            return null;

        var secret = Meteor.settings.private.stripe.testSecretKey;
        var Stripe = StripeAPI(secret);

        var customerCards = new Future();

        Stripe.customers.listCards(patient.profile.stripeClient, function (error, cards) {
            // asynchronously called

            if (error) {
                customerCards.throw(new Meteor.Error(403, error.type));
            } else {

                let data = cards.data.map((card)=> {
                    return {
                        id: card.id,
                        name: card.name,
                        country: card.country,
                        expMonth: card.exp_month,
                        expYear: card.exp_year
                    }
                });
                customerCards.return(data);
            }
        });

        return customerCards.wait();
    }
});

let getStripeClient = function (id) {

    var patient = Meteor.users.findOne({_id: id, 'profile.userType': USER_TYPE.PATIENT});

    var secret = Meteor.settings.private.stripe.testSecretKey;
    var Stripe = StripeAPI(secret);

    var stripeCustomer = new Future();

    Stripe.customers.retrieve(
        patient.profile.stripeClient,
        function (error, customer) {

            if (error) {
                stripeCustomer.return(error);
            } else {
                stripeCustomer.return(customer);
            }
        }
    );
    return stripeCustomer.wait();
};
let stripeRefundPayment = function (idCharge) {

    var secret = Meteor.settings.private.stripe.testSecretKey;
    var Stripe = StripeAPI(secret);

    var result = new Future();

    Stripe.refunds.create({
        charge: idCharge
    }, function (error, refund) {
        if (error) {
            result.return({error: error.message});
        } else {
            result.return(refund);
        }
    });

    return result.wait();
};