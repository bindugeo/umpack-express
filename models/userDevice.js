var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;

var UserDeviceSchema = new mongoose.Schema({
  userName: String,
  devices: []
});

UserDeviceSchema.methods.canAccess = function(deviceToken) {
  for (var i = 0; i < this.devices.length; i++) {
    if (this.devices[i].deviceToken === deviceToken) return this.devices[i].canAccess;
  }

  return false;
};

UserDeviceSchema.methods.addNewDevice = function(device) {
  this.devices.push(device);
};

UserDeviceSchema.methods.deviceExists = function(deviceToken) {
  for (var i = 0; i < this.devices.length; i++) {
    if (this.devices[i].deviceToken === deviceToken) return true;
  }

  return false;
};

UserDeviceSchema.methods.getDevice = function(deviceToken) {
  for (var i = 0; i < this.devices.length; i++) {
    if (this.devices[i].deviceToken === deviceToken) return this.devices[i];
  }

  return null;
};

UserDeviceSchema.methods.grantDeviceAccess = function(deviceToken) {
  var device = this.getDevice(deviceToken);

  if (!device) this.devices.push({
    deviceToken: deviceToken,
    canAccess: true
  });

  device.canAccess = true;
};

UserDeviceSchema.statics.findOrCreateNew = function(userName) {
  return this.findOne({
      userName: userName
    }).exec()
    .then(function(userDevice) {
      if (!userDevice) return new this({
        userName: userName,
        devices: []
      });

      return userDevice;
    }.bind(this));
};


module.exports = mongoose.model('userdevices', UserDeviceSchema);
