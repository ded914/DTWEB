(function () {
    'use strict';

    angular.module('dtApp', ['ui.tree'])
    .controller('DtConstructorController', function ($scope) {


        $scope.remove = function (scope) {
            scope.remove();
        };

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

        //This *should* update the folder checkboxes after a node drag and drop
        //BROKEN AS OF v2.1.5, FIX EXPECTED IN 2.1.6?
        $scope.treeOptions = {
            dropped: function (event) {
                $scope.verifyAllParentsCheckStatus($scope.data);
            },

            accept: function (sourceNode, destIndex) {
                return false;
            }
        };


        $scope.data = 
            [
              {
                  "title": "Pain",
                  "nodetype": "framelink",
                  "checkStatus": "unchecked",
                  "index": 0
              },
              {
                  "nodetype": "slot",
                  "nodes": [
                    {
                        "nodetype": "term",
                        "title": "Breach of Form",
                        "checkStatus": "unchecked",
                        "index": 0
                    },
                    {
                        "nodetype": "term",
                        "title": "Breach of Color",
                        "checkStatus": "unchecked",
                        "index": 1
                    }
                  ],
                  "checkStatus": "unchecked",
                  "title": "Cosmetical Defect",
                  "index": 1
              },
              {
                  "title": "Dental Cavity Presented",
                  "nodetype": "slot",
                  "index": 2,
                  "nodes": []
              },
              {
                  "nodetype": "slot",
                  "nodes": [
                    {
                        "nodetype": "term",
                        "title": "Headache",
                        "checkStatus": "unchecked",
                        "index": 0
                    },
                    {
                        "nodetype": "term",
                        "title": "Lack of Appetite",
                        "checkStatus": "unchecked",
                        "index": 1
                    },
                    {
                        "nodetype": "term",
                        "title": "SleepDisturbance",
                        "checkStatus": "unchecked",
                        "index": 2
                    },
                    {
                        "nodetype": "term",
                        "title": "Fewer",
                        "checkStatus": "unchecked",
                        "index": 3
                    }
                  ],
                  "checkStatus": "unchecked",
                  "title": "General Breaches",
                  "index": 3
              },
              {
                  "nodetype": "slot",
                  "nodes": [
                    {
                        "nodetype": "term",
                        "title": "Fillings Destroyed",
                        "checkStatus": "unchecked",
                        "index": 0
                    },
                    {
                        "nodetype": "term",
                        "title": "Fillings Moving",
                        "checkStatus": "unchecked",
                        "index": 1
                    },
                    {
                        "nodetype": "term",
                        "title": "Food Gets Stuck In The Teeth",
                        "checkStatus": "unchecked",
                        "index": 2
                    }
                  ],
                  "checkStatus": "unchecked",
                  "title": "Additional Complaints",
                  "index": 4
              },
              {
                  "nodetype": "slot",
                  "nodes": [
                    {
                        "nodetype": "term",
                        "title": null,
                        "checkStatus": "unchecked",
                        "index": null
                    }
                  ],
                  "checkStatus": "unchecked",
                  "title": "Slot with no terms",
                  "index": 5
              }
            ];
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