/**
 * Created by bjcarson75 on 11/26/15.
 */
angular.module('SolutionCenter', [])
    .controller('HomePage', function($scope, JSON_Service, gatherFilters){
        $scope.name = "Cory"; // Placeholder for demo

        $scope.resetSearch = function(){
            $scope.currentItem = {name:'solution',industry:'any industry',product:'any product',showAll:false};
            $scope.pristineForm = true;
            $scope.showSolutions = false;
            $scope.showWins = false;
        }

        $scope.showAll = function(){
            $scope.currentItem.showAll = true;
            $scope.showSolutions = true;
            $scope.showWins = true;
        }
        $scope.activateSearch = function(){
            //$scope.currentItem = {name:'solution',industry:'any industry',product:'any product',showAll:false};
            $scope.pristineForm = false;
            $scope.showSolutions = true;
            $scope.showWins = true;
        }

        var filters = { name:['solution','solution win'], industry:[], product:[] };

        $scope.resetSearch(); // Initialize search and form values

        // Retrieve first data set from JSON file
        JSON_Service.get('solutions.json')
            .then(function(data){
                angular.forEach(data, function(item, index){
                    // Add (non-duplicate) items to filter arrays
                    filters = gatherFilters.checkArrays(item, filters);
                });
                $scope.solutions = data;

                // Retrieve second data set from JSON file
                JSON_Service.get('wins.json')
                    .then(function(data){
                        angular.forEach(data, function(item, index){
                            // Add (non-duplicate) items to filter arrays
                            filters = gatherFilters.checkArrays(item, filters);
                        });
                        $scope.wins = data;
                        $scope.filters = filters;
                    });
            });

        // Natural Language Form control
        $scope.nlFieldOpen= {name:false,industry:false,product:false};
        $scope.nlFieldOpenToggle = function( category, key, value ){
            if ( key != undefined ) {
                $scope.currentItem[category] = value;
                $scope.pristineForm = false;
                if(value == 'solution'){ $scope.showSolutions = true; }
                if(value == 'solution win'){ $scope.showWins = true; }
            }
            $scope.nlFieldOpen[category] = !$scope.nlFieldOpen[category];
        };
    })
    .factory('gatherFilters', function(){
        // Angular Factory - check each item against array,
        // push to array if not duplicate entry
        return {
            checkArrays: function(item, filters){
                var industryFilter = $.inArray(item.industry, filters.industry);
                if(industryFilter == -1){
                    filters.industry.push(item.industry); }
                var productFilter = $.inArray(item.product, filters.product);
                if(productFilter == -1){
                    filters.product.push(item.product); }
                return filters;
            }
        }
    })
    .factory('JSON_Service', function($http, $q){
        // Simple Angular Factory to retrieve JSON data w/promise
        return {
            get: function(path){
                var d = $q.defer();
                $http.get(path)
                    .then(function(result){
                        d.resolve(result.data);
                    })
                return d.promise;
            }
        }
    })
    .filter('formSelected', function($filter){
        // Custom Angular Filter to check all three categories simultaneously
        return function (input, selected) {
            //console.log(input)
            //console.log(selected)
            var output = [];
            if(selected.showAll){
                output = input;
                return output;
            } else if(selected.search){
                output = $filter('filter')(input, selected.search);
                return output;
            } else {
                angular.forEach(input, function(item){
                    //console.log(item);
                    //if(selected.name == 'solution' || selected.name == item.name){
                        if(selected.industry == 'any industry' || selected.industry == item.industry){
                            if(selected.product == 'any product' || selected.product == item.product){
                                output.push(item);
                            }
                        }
                    //}
                })
                return output;
            }

        };
    });


