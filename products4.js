angular.module("exampleApp", ["increment", "ngResource", "ngRoute"])
	.constant("baseUrl", "http://172.22.99.103:5500/products/")
	.factory("productsResource", function ($resource, baseUrl) {
		return $resource(baseUrl + ":id", { id: "@id" },
			{ create: { method: "POST" }, save: { method: "PUT" } });
	})
	.config(function ($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(false);
		$routeProvider.when("/list", {
			templateUrl: "/newsportsstore/tableView.html"
		});
		$routeProvider.when("/edit/:id", {
			templateUrl: "/newsportsstore/editorView.html",
			controller: "editCtrl"
		});
		$routeProvider.when("/edit/:id/:data*", {
			templateUrl: "/editorView.html"
		});
		$routeProvider.when("/create", {
			templateUrl: "/newsportsstore/editorView.html",
			controller: "editCtrl"
		});
		$routeProvider.otherwise({
			templateUrl: "/newsportsstore/tableView.html",
			controller: "tableCtrl",
			resolve: {
				data: function (productsResource) {
					return productsResource.query();
				}
			}
		});
	})
	.controller("defaultCtrl", function ($scope, $http, $resource, $location, $route, $routeParams, baseUrl) {
		$scope.currentProduct = null;
		$scope.$on("$routeChangeSuccess", function () {
			if ($location.path().indexOf("/edit/") == 0) {
				var id = $routeParams["id"];
				for (var i = 0; i < $scope.products.length; i++) {
					if ($scope.products[i].id == id) {
						$scope.currentProduct = $scope.products[i];
						break;
					}
				}
			}
		});
		$scope.productsResource = $resource(baseUrl + ":id", { id: "@id"}, { create: { method: "POST" }, save: { method: "PUT" }});
		$scope.listProducts = function () {
			console.log("This is listProducts function!");
			$scope.products = $scope.productsResource.query();
		}
		$scope.deleteProduct = function (product) {
			console.log("This is deleteProduct function!")
			product.$delete().then(function () {
				$scope.products.splice($scope.products.indexOf(product), 1);
			});
			$location.path("/list");
		}
		$scope.createProduct = function (product) {
			console.log("This is createProduct function!")
			product['description'] = "Ha Ha, This is a test!"
			console.log(product)
			new $scope.productsResource(product).$create().then(function(newProduct){
				$scope.products.push(newProduct);
				$location.path("/list");
			});
		}
		$scope.updateProduct = function (product) {
			console.log("This is updateProduct function!")
			product['description'] = "Ha Ha, This is a test for update!"
			console.log(product)
			product.$save();
			$location.path("/list");
		}
		$scope.cancelEdit = function () {
			if ($scope.currentProduct && $scope.currentProduct.$get) {
				$scope.currentProduct.$get();
			}
			$scope.currentProduct = {};
			$location.path("/list");
		}
		$scope.saveEdit = function (product) {
			if (angular.isDefined(product.id)) {
				$scope.updateProduct(product);
			} else {
				$scope.createProduct(product);
			}
			$scope.currentProduct = {};		
		}
		$scope.listProducts();	
	})
	.controller("editCtrl", function ($scope, $routeParams, $location) {
		$scope.currentProduct = null;
		if ($location.path().indexOf("/edit/") == 0) {
			var id = $routeParams["id"];
			for (var i = 0; i < $scope.products.length; i++) {
				if ($scope.products[i].id == id) {
					$scope.currentProduct = $scope.products[i];
					break;
				}
			}
		}
		$scope.cancelEdit = function () {
			if ($scope.currentProduct && $scope.currentProduct.$get) {
				$scope.currentProduct.$get();
			}
			$scope.currentProduct = {};
			$location.path("/list");
		}
		$scope.updateProduct = function (product) {
			product.$save();
			$location.path("/list");
		}
		$scope.saveEdit = function (product) {
			if (angular.isDefined(product.id)) {
				$scope.updateProduct(product);
			} else {
				$scope.createProduct(product);
			}
			$scope.currentProduct = {};
		}
	});
