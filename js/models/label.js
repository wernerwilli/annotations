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
        "order!models/user",
        "order!access",
        "order!underscore",
        "order!backbone"],
       
    function($,User, ACCESS){
    
        /**
         * Label model
         * @class
         */
        var Label = Backbone.Model.extend({
            
            defaults: {
                access: ACCESS.PUBLIC,
                created_at: null,
                created_by: null,
                updated_at: null,
                updated_by: null,
                deleted_at: null,
                deleted_by: null
            },
            
            initialize: function(attr){
                
                if(!attr || _.isUndefined(attr.value))
                    throw "'value' attribute is required";
                
                if(!attr || _.isUndefined(attr.abbreviation))
                    throw "'abbreviation' attribute is required";
                
                if(!attr || _.isUndefined(attr.category))
                    throw "'category' attribute is required";

                attr.settings = this.parseSettings(attr.settings);

                // Check if the track has been initialized 
                if(!attr.id){
                    // If local storage, we set the cid as id
                    if(window.annotationsTool.localStorage)
                        attr['id'] = this.cid;
                        
                    this.toCreate = true;
                }

                if(attr.category && attr.category.attributes)
                    attr.category = attr.category.toJSON();
                
                this.set('category',attr.category);
                
                this.set(attr);
                
            },
            
            parse: function(data) {                 
                var attr = data.attributes ? data.attributes : data;

                attr.created_at = attr.created_at != null ? Date.parse(attr.created_at): null;
                attr.updated_at = attr.updated_at != null ? Date.parse(attr.updated_at): null;
                attr.deleted_at = attr.deleted_at != null ? Date.parse(attr.deleted_at): null;
                attr.settings = this.parseSettings(attr.settings);

                if(attr.category && attr.category.settings)
                    attr.category.settings = this.parseSettings(attr.category.settings);

                if(data.attributes)
                    data.attributes = attr;
                else
                    data = attr;

                return data;
            },
            
            validate: function(attr){
                
                if(attr.id){
                    if(this.get('id') != attr.id){
                        this.id = attr.id;
                    }
                }
                
                if(attr.value &&  !_.isString(attr.value))
                    return "'value' attribute must be a string!";
                
                if(attr.abbreviation &&  !_.isString(attr.abbreviation))
                    return "'abbreviation' attribute must be a string!";
                
                if(attr.description &&  !_.isString(attr.description))
                    return "'description' attribute must be a string!";
                
                if(attr.settings &&  !_.isString(attr.settings))
                    return "'settings' attribute must be a string!";
                
                if(attr.category &&  !_.isObject(attr.category))
                    return "'category' attribute must be a JSON Object!";

                if(attr.access && !_.include(ACCESS,attr.access))
                    return "'access' attribute is not valid.";
                
                if(!_.isNull(attr.created_by) && !(_.isNumber(attr.created_by) || attr.created_by instanceof User))
                    return "'created_by' attribute must be a number or an instance of 'User'";
            
                if(!_.isNull(attr.updated_by) && !(_.isNumber(attr.updated_by) || attr.updated_by instanceof User))
                    return "'updated_by' attribute must be a number or an instance of 'User'";
                
                if(!_.isNull(attr.deleted_by) && !(_.isNumber(attr.deleted_by) || attr.deleted_by instanceof User))
                    return "'deleted_by' attribute must be a number or an instance of 'User'";
            
                if(!_.isNull(attr.created_at)){
                    if((tmpCreated=this.get('created_at')) && tmpCreated!==attr.created_at)
                        return "'created_at' attribute can not be modified after initialization!";
                    if(!_.isNumber(attr.created_at))
                        return "'created_at' attribute must be a number!";
                }
        
                if(!_.isNull(attr.updated_at)){
                    if(!_.isNumber(attr.updated_at))
                        return "'updated_at' attribute must be a number!";
                }

                if(!_.isNull(attr.deleted_at)){
                    if(!_.isNumber(attr.deleted_at))
                        return "'deleted_at' attribute must be a number!";
                }
                
            },

            /**
             * @override
             * 
             * Override the default toJSON function to ensure complete JSONing.
             *
             * @return {JSON} JSON representation of the instane
             */
            toJSON: function(){
                var json = $.proxy(Backbone.Model.prototype.toJSON,this)();
                if(json.category && json.category.toJSON)
                    json.category = json.category.toJSON();
                return json;
            },

            /**
             * Parse the given settings to JSON if given as String
             * @param  {String} settings the settings as String
             * @return {JSON} settings as JSON object
             */
            parseSettings: function(settings){
                if(settings && _.isString(settings))
                    settings = JSON.parse(settings);

                return settings;
            }        
        });
        
        return Label;
    
}); 