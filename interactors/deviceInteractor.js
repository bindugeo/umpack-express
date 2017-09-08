var Promise = require('bluebird');
var config = require('../config');
var API_ERRORS = require('../exceptions/apiErrorsEnum');
var UserDevice = require('../models/userDevice');

exports.checkDevice = function(userName, deviceToken) {
  return UserDevice.findOrCreateNew(userName)
    .then(function(userDevice) {
      if (!userDevice.deviceExists(deviceToken)) userDevice.addNewDevice({
        deviceToken: deviceToken,
        canAccess: false
      });

      return userDevice.save();
    })
    .then(function(userDevice) {
      if (!userDevice.canAccess(deviceToken)) throw API_ERRORS.DEVICE_ACCESS_DENIED;
    });
};

exports.grantDeviceAccess = function(userName, deviceToken) {
  if (!config.deviceControl) return Promise.reject(API_ERRORS.DEVICE_CONTROL_NOT_SUPPORTED);

  return UserDevice.findOrCreateNew(userName)
    .then(function(userDevice) {
      userDevice.grantDeviceAccess(deviceToken);




      return userDevice.save();
    });
};

exports.restrictDeviceAccess = function(userName, deviceToken) {
  return Promise.try(function() {
      if (!config.deviceControl) throw API_ERRORS.DEVICE_CONTROL_NOT_SUPPORTED;

      return UserDevice.findOrCreateNew(userName);
    })
    .then(function(userDevice) {
      userDevice.restrictDeviceAccess(deviceToken);

      return userDevice.save();
    });
};
