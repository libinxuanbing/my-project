'use strict';

define(function(require, exports, module) {
    require('lib/plugins/cookie/cookie');

    var $ = require('jquery'),
        path = require('module/common/config/path'),
        cookie = $.cookie,
        removeCookie = $.removeCookie,
        stringify = JSON.stringify,
        parse = JSON.parse,

        defaults = {
            expires: 7,
            domain: path.domain,
            path: '/'
        },

        cookieKeys = ['authToken', 'customerId'];

        return {

            set: function(key, value, opts) {
                opts = $.extend({}, defaults, opts || {});

                if (typeof value !== 'string') {
                    try {
                        value = stringify(value);
                    } catch(e) {
                        throw new Error('Data type error!');
                    }
                }
                return cookie(key, value, opts);
            },

            get: function(key) {
                var value = cookie(key);
                try {
                    return parse(value);
                } catch(e) {
                    return value;
                }
            },

            remove: function(key, options) {
                return removeCookie(key, options);
            },

            isLogin: function() {
                return this.getUser() != null;
            },

            getUser: function() {
                return this.getCurrentUser();
            },

            setUser: function(value) {
                return this.setCurrentUser(value);
            },

            setCurrentUser: function(user) {
                var self = this,
                    currentUser = {},
                   userKeys = ['userId', 'username', 'password', 'userRealname', 'customerId','authToken'];

                if (user && user.userId != null) {

                    $.each(userKeys, function(i, key) {
                        currentUser[key] = user[key];
                        self.set('bwc_user', currentUser);
                    });

                    $.each(cookieKeys, function(i, key) {
                        self.set(key, user[key]);
                    });

                }
            },

            getCurrentUser: function() {
                var self = this,
                    currentUser = this.get('bwc_user');

                if (typeof currentUser !== 'undefined') {
                    $.each(cookieKeys, function(i, key) {
                        if(!currentUser[key]){
                             currentUser[key] = self.get(key);
                        }
                    });
                    return currentUser;
                }

            },

            removeCurrentUser: function() {
                var self = this;

                $.each(cookieKeys, function(i, key) {
                    self.remove(key,defaults);
                });
                self.remove('bwc_user',defaults);
            },

            removeUser: function() {
                // return this.remove('user');
                return this.removeCurrentUser();
            },

            getAuthToken: function() {
                var user = this.getUser();
                if (user) {
                    return user.authToken;
                }
            },

            setOperationByUserId: function(userId, value) {
                return this.set(userId, value);
            },

            getOperationByUserId: function(userId) {
                return this.get(userId);
            },

            destroy: function() {
                this.removeUser();
            }

        };
});