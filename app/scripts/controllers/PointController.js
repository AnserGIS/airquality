'use strict';

CMAQ.controller('PointController', function ($stateParams, $scope, data, viewport, state, api, leaflet) {
  var pointId = $stateParams.pointId;

  state.setTitle('Point');

  if (_.isEmpty(data.points)) {
    api.getPoints().finally(function () {
      getPoint();
    });
  } else {
    getPoint();
  }

  function getPoint() {
    var point = _.find(data.points, function (currentPoint) {
      return currentPoint.id === pointId;
    });

    if (point) {
      var center, panning;

      leaflet.init(point);
      data.point = point;

      leaflet.map.on('movestart', function () {
        if (!panning) {
          center = leaflet.map.getCenter();
        } else {
          panning = false;
          center = undefined;
        }
      });

      leaflet.map.on('moveend', function () {
        if (center) {
          panning = true;
          leaflet.map.panTo(center);
        }
      });
    } else {
      viewport.message = 'It looks like the data point can\'t be found. Please choose an existing point from the list.';
      state.redirect('points');
    }
  }
});
