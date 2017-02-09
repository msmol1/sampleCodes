/**
 * Copyright (C) OneBi Sp. z o.o. All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Created by Marzena Smolen, 2016-11-24
 */

import { Template } from "meteor/templating";

import "./steps-container.html";
import "./steps/step-1/step-1";
import "./steps/step-2/step-2";
import "./steps/step-3/step-3";
import "./steps/step-4/step-4";
import "./steps/step-5/step-5";
import "./steps/step-6/step-6";

import GLOBALS from "/imports/api/globals";

Template.Pages_Main_Steps_Container.onCreated(function () {
});

Template.Pages_Main_Steps_Container.onRendered(function () {

    let self = this;

    this.autorun(()=> {

        $(self.find("li[selected]")).attr("selected", null);
        $(self.find("#"+ GLOBALS.ORDER.get("steps.stepNumber"))).attr("selected", true);


        if(!GLOBALS.ORDER.get("steps.stepNumber")) {
            Router.go("/");

            if(!GLOBALS.ORDER.get("steps.step0"))
                GLOBALS.ORDER.reset();
        }
    });
});

Template.Pages_Main_Steps_Container.onDestroyed(function () {});

Template.Pages_Main_Steps_Container.helpers({
    getCurrentStep:()=> {
        return  "Pages_Main_Steps_Container_"+ GLOBALS.ORDER.get("steps.stepNumber");
    },
    lastStep: ()=> {
        return GLOBALS.ORDER.get("steps.stepNumber") === "Step5";
    }
});

Template.Pages_Main_Steps_Container.events({
});