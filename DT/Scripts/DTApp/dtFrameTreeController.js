

(function () {
    'use strict';

    //angular.module('dtApp', ['ui.tree'])
    angular.module('dtApp').controller('DtFrameTreeController', function ($scope) {

        $scope.AddToAction = function (scope, actiontoadd) {
            $scope.AssureActionExists(scope);
            var res = scope.node.action;
            var actions = scope.node.action;
            if (actions.indexOf(actiontoadd) != -1) {
               return res;
            }
            var strarr = actions.split('_');
            strarr.push(actiontoadd);
            res = strarr.join('_');
            scope.node.action = res;
        }

        $scope.RemoveFromAction = function (scope, actiontoremove) {
            $scope.AssureActionExists(scope);
            var res = scope.node.action;
            if (scope.node.action.indexOf(actiontoremove) != -1) {
                var strarr = scope.node.action.split('_');
                for (var i = strarr.length - 1; i >= 0; i--) {
                    if (strarr[i] === actiontoremove) {
                        strarr.splice(i, 1);
                    }
                }
                res = strarr.join('_');
            }
            scope.node.action = res;
        }

        $scope.ActionContains = function (scope, actiontofind) {
            if (!scope.node) return false;
            $scope.AssureActionExists(scope);
            return (scope.node.action.indexOf(actiontofind) != -1);
        }

        $scope.ChangeStyleDependingOnAction = function (scope) {
            $scope.AssureActionExists(scope);
            if ($scope.ActionContains(scope, 'deleted')) {
                scope.node.actionBackground = {
                    'background-color': 'lightgray'
                };
            }
        }

        $scope.AssureActionExists = function (scope) {
            if (scope.node) {
                if (!scope.node.action) scope.node.action = 'unchanged';
            }
        }

        $scope.dtremove = function (scope) {
            scope.remove();
            //We are not going to colorize edit UI for now. May be later
            //$scope.AssureActionExists(scope);
            //if ($scope.ActionContains(scope, 'deleted')) {
            //    $scope.RemoveFromAction(scope, 'deleted');
            //} else {
            //    $scope.AddToAction(scope, 'deleted');
            //}
            //$scope.ChangeStyleDependingOnAction(scope);
        };

        $scope.dtchanging = function (scope) {
            AssureActionExists(scope);
        }


        $scope.toggle = function (scope) {
            scope.toggle();
        };

        var getRootNodesScope = function () {
            return angular.element(document.getElementById("tree-root")).scope();
        };

        //$scope.collapseAll = function () {
        //    var scope = getRootNodesScope();
        //    scope.collapseAll();
        //};

        //$scope.expandAll = function () {
        //    var scope = getRootNodesScope();
        //    scope.expandAll();
        //};

       $scope.collapseAll = function () {
           $scope.$broadcast('angular-ui-tree:collapse-all');
       };

       $scope.expandAll = function () {
           $scope.$broadcast('angular-ui-tree:expand-all');
       };


            //changed this functin, now it only makes terminal nodes , aka "files"
            //hence it should be only called from a parent node, aka "folder"
        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            nodeData.nodes.push({
                    id: nodeData.id * 10 + nodeData.nodes.length,
                    title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                    checkStatus: "unchecked",
            });
        };

            //New Methods start here
            //make a new folder
        var counter = 5;
        $scope.newParentItem = function () {
            $scope.data.push({
                    id: counter,
                    title: "node" + counter++,
                    checkStatus: "unchecked",
                    nodes: [],
            });
        };

            //This is what is called from the ng-click
        $scope.toggleCheck = function (node) {
            console.log(node);
            if (node.checkStatus === "checked") {
                node.checkStatus = "unchecked";
            } else {
                node.checkStatus = "checked";
        }
            if (node.nodes)
                $scope.propagateCheckFromParent(node.nodes, node.checkStatus);
            $scope.verifyAllParentsCheckStatus($scope.data);
        };

            //when a "folder" is click/unclicked, all it's children are click/unclicked
        $scope.propagateCheckFromParent = function (nodes, status) {
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                node.checkStatus = status;
                if (node.nodes)
                    $scope.propagateCheckFromParent(node.nodes, status)
        }
        };

            //starting from the root node, check all folders recursively to see
            //if their children are all click, all unclicked or mixed
        $scope.verifyAllParentsCheckStatus = function (nodes) {
            var retVal = "";
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                console.log(node.title);
                if (node.nodes && node.nodes.length > 0)
                    node.checkStatus = $scope.verifyAllParentsCheckStatus(node.nodes);
                if (retVal === "") {
                    retVal = node.checkStatus;
                    console.log("set ret");
            }
                if (retVal != node.checkStatus)
                    return "partlyChecked";
        }
            return retVal;
        };

        $scope.dtItemDestType;
        $scope.dtItemSourceType;

        $scope.dtItemSourceParent;
        $scope.dtItemDestParent;
        $scope.dtItemDestIndex;

        $scope.dtItemDestTitle;

        $scope.dtTermDragError;

        $scope.treeOptions = {


                accept: function (sourceNodeScope, destNodesScope, destIndex) {
                    var sourceType = sourceNodeScope.node.nodetype;
                    var sourceParent = sourceNodeScope.node.parent;
                    var destParent = destNodesScope.node ? destNodesScope.node.parent : 'undefined';

                    var destTitle = destNodesScope.node ? destNodesScope.node.title : 'undefined';
                    
                    $scope.dtItemSourceType = sourceType;

                    $scope.dtItemSourceParent = sourceParent;
                    $scope.dtItemDestParent = destParent;
                    $scope.dtItemDestIndex = destIndex;

                    $scope.dtItemDestTitle = destTitle;

                    if (sourceType == 'term') {
                        if (sourceParent == destTitle) {
                            return true;
                        }
                    }

                    if (sourceType == 'slot') {
                        if (destTitle == 'undefined') {
                            return true;
                        }
                    }

                    if (sourceType == 'framelink') {
                        if (destTitle == 'undefined') {
                            return true;
                        }
                    }

                    if (sourceType == 'frame') {
                        if (destTitle == 'undefined') {
                            return true;
                        }
                    }

                    return false;
                },

                dropped: function(e) {
                    alert(e.source.nodeScope.$modelValue);     
                },

                dragStop: function (event) {

                }

        }; //treeOptions

        $scope.dataFrame = [
            {
                "nodetype": "nothingtodisplay",
                "title" : "Possible error. Nothing to dilsplay."
            }
        ];
    });

})();