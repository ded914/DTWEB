(function () {
    'use strict';

    angular.module('dtApp').controller('DtAllFramesController', function ($scope) {
        $scope.treeOptions = {
            dropped: function(e) {
                alert(e.source.nodeScope.$modelValue);     
            }
        };

        $scope.dataAllFrames = [
            {
                "nodetype": "nothingtodisplay",
                "title": "Possible error. Nothing to dilsplay."
            }
        ];
    });
})();