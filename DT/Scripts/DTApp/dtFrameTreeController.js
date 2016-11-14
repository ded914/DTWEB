(function () {
    'use strict';

    //angular.module('dtApp', ['ui.tree'])
    angular.module('dtApp').controller('DtFrameTreeController', function ($scope) {


        $scope.dtremove = function (scope) {
            //scope.remove();
            var savedaction = scope.node.action;
            if (scope.node.action == 'deleted') {
                scope.node.action = scope.node.savedaction;
                scope.node.actionBackground = {};
            } else {
                scope.node.savedaction = scope.node.action;
                scope.node.action = 'deleted';
                scope.node.actionBackground = { 'background-color': 'lightgray' };
            }
        };

        $scope.NodeActionColor;

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBegginig = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };

        var getRootNodesScope = function () {
            return angular.element(document.getElementById("tree-root")).scope();
        };

        $scope.collapseAll = function () {
            var scope = getRootNodesScope();
            scope.collapseAll();
        };

        $scope.expandAll = function () {
            var scope = getRootNodesScope();
            scope.expandAll();
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

        
        $scope.dtItemSourceType;

        $scope.dtItemDestType;

        $scope.dtItemDestParent;

        $scope.treeOptions = {
            dropped: function (event) {
                $scope.verifyAllParentsCheckStatus($scope.data);
            },

            accept: function (sourceNodeScope, destNodesScope, destIndex) {
                var sourceType = sourceNodeScope.node.nodetype;
                var destType = destNodesScope.node ? destNodesScope.node.nodetype : 'undefined';


                $scope.dtItemDestType = destType;
                $scope.dtItemSourceType = sourceType;

                if (destType == 'undefined') {
                    return false;
                } else {
                    return true;
                }

                

                if (sourceType == 'term') {
                    if (destType == 'undefined') {
                        return false;
                    }
                    if (destType == 'slot') {
                        
                    }
                }

                if (sourceType == 'slot' || sourceType == 'framelink') {
                    if (destType == 'slot' || destType == 'framelink') {
                        return true;
                    }
                }

                
                return false;
            }
        };

        


        $scope.data = 
            [
  {
      "title": "Pain",
      "nodetype": "framelink",
      "action": "unchanged",
      "index": 0,
      "parent": "undefined"
      
  },
  {
      "parent": "Complaints",
      "nodetype": "slot",
      "action": "unchanged",
      "nodes": [
        {
            "nodetype": "term",
            "action": "unchanged",
            "title": "Breach of Form",
            "index": 0,
            "parent": "Cosmetical Defect"
        },
        {
            "nodetype": "term",
            "action": "modified",
            "title": "Breach of Color",
            "index": 1,
            "parent": "Cosmetical Defect"
        }
      ],
      "title": "Cosmetical Defect",
      "index": 1
  },
  {
      "parent": "Complaints",
      "nodetype": "slot",
      "action": "unchanged",
      "nodes": [],
      "title": "Dental Cavity Presented",
      "index": 2
  },
  {
      "parent": "Complaints",
      "nodetype": "slot",
      "nodes": [
        {
            "nodetype": "term",
            "action": "newlycreated",
            "title": "Headache",
            "index": 0,
            "parent": "General Breaches"
        },
        {
            "nodetype": "term",
            "title": "Lack of Appetite",
            "index": 1,
            "parent": "General Breaches"
        },
        {
            "nodetype": "term",
            "action": "deleted",
            "title": "SleepDisturbance",
            "index": 2,
            "parent": "General Breaches"
        },
        {
            "nodetype": "term",
            "title": "Fewer",
            "index": 3,
            "parent": "General Breaches"
        }
      ],
      "title": "General Breaches",
      "index": 3
  },
  {
      "parent": "Complaints",
      "nodetype": "slot",
      "nodes": [
        {
            "nodetype": "term",
            "title": "Fillings Destroyed",
            "index": 0,
            "parent": "Additional Complaints"
        },
        {
            "nodetype": "term",
            "title": "Fillings Moving",
            "index": 1,
            "parent": "Additional Complaints"
        },
        {
            "nodetype": "term",
            "title": "Food Gets Stuck In The Teeth",
            "index": 2,
            "parent": "Additional Complaints"
        }
      ],
      "title": "Additional Complaints",
      "index": 4
  },
  {
      "parent": "Complaints",
      "nodetype": "slot",
      "nodes": [],
      "title": "Slot with no terms",
      "index": 5
  }
            ]
        ;
        //The data
        //"Folder" has a .nodes field
        //files do not
        //$scope.data = [
        //    {
        //    "id": 1,
        //    "type": "dt_frame",
        //    "checkStatus": "unchecked",  //unchecked, partlyChecked, checked, 
        //    "title": "node1",
        //    "nodes": [
        //      {
        //          "id": 11,
        //          "type": "dt_slot",
        //          "checkStatus": "unchecked",
        //          "title": "node1.1",
        //          "nodes": [
        //            {
        //                "id": 111,
        //                "type": "dt_term",
        //                "checkStatus": "unchecked",
        //                "title": "node1.1.1",
        //            }
        //          ]
        //      },
        //      {
        //          "id": 12,
        //          "type": "dt_slot",
        //          "checkStatus": "unchecked",
        //          "title": "node1.2",
        //          "nodes": [
        //                {
        //                    "id": 111,
        //                    "type": "dt_term",
        //                    "checkStatus": "unchecked",
        //                    "title": "node1.1.1eeee",
        //                },
        //              {
        //                  "id": 111,
        //                  "type": "dt_term",
        //                  "checkStatus": "unchecked",
        //                  "title": "node1.1.1ssss",
        //              },
        //              {
        //                  "id": 111,
        //                  "type": "dt_term",
        //                  "checkStatus": "unchecked",
        //                  "title": "node1.1.1dddd",
        //              },
        //              {
        //                  "id": 111,
        //                  "type": "dt_term",
        //                  "checkStatus": "unchecked",
        //                  "title": "node1.1.1fff",
        //              }
        //          ]
        //      }
        //    ],
        //    },
        //{
        //    "id": 2,
        //    "checkStatus": "unchecked",
        //    "title": "node2",
        //    "nodes": [
        //      {
        //          "id": 21,
        //          "checkStatus": "unchecked",
        //          "title": "node2.1",
        //      },
        //      {
        //          "id": 22,
        //          "checkStatus": "unchecked",
        //          "title": "node2.2",
        //      }
        //    ],
        //},
        //{
        //    "id": 3,
        //    "checkStatus": "unchecked",
        //    "title": "node3",
        //    "nodes": [
        //      {
        //          "id": 31,
        //          "checkStatus": "unchecked",
        //          "title": "node3.1",
        //      }
        //    ],
        //},
        //{
        //    "id": 4,
        //    "checkStatus": "unchecked",
        //    "title": "node4",
        //    "nodes": [
        //      {
        //          "id": 41,
        //          "checkStatus": "unchecked",
        //          "title": "node4.1",
        //      }
        //    ],
        //}
        //];
    });

})();