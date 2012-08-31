/**
 *  Copyright 2012, Entwine GmbH, Switzerland
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 *
 */
    
define(["order!jquery",
        "order!models/scalevalue",
        "order!underscore",
        "order!backbone",
        "order!localstorage"],
    

    function($,ScaleValue){
    
        /**
        * @class Scale values collection
        */
        var ScaleValues = Backbone.Collection.extend({
            model: ScaleValue,
            localStorage: new Backbone.LocalStorage("ScaleValue"),
            
            initialize: function(models, scale){
                _.bindAll(this, "setUrl");
                
                this.setUrl(scale);
            },
            
            parse: function(resp, xhr) {
              return resp.scaleValues;
            },
            
            /**
             * Define the url from the collection with the given video and scale
             *
             * @param {Scale} scale containing the scale value
             */
            setUrl: function(scale){
                if(!scale)
                    throw "The parent scale of the scale value must be given!";
                else if(scale.collection)
                    this.url = scale.url() + "/scalevalues";
            }
        });
        
        return ScaleValues;

});
    
    