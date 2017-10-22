angular.module("exampleApp", ["increment", "ngResource"])
	.constant("baseUrl", "http://172.22.99.103:5500/products/")
	.controller("defaultCtrl", function ($scope, $http, $resource, baseUrl) {
		$scope.displayMode = "list";
		$scope.currentProduct = null;
		$scope.productsResource = $resource(baseUrl + ":id", { id: "@id"});
		$scope.listProducts = function () {
			console.log("This is listProducts function!");
			$scope.products = $scope.productsResource.query();
		}
		$scope.deleteProduct = function (product) {
			console.log("This is deleteProduct function!")
			product.$delete().then(function () {
				$scope.products.splice($scope.products.indexOf(product), 1);
			});
			$scope.displayMode = "list";
		}
		$scope.createProduct = function (product) {
			console.log("This is createProduct function!")
			product['description'] = "Ha Ha, This is a test!"
			console.log(product)
			new $scope.productsResource(product).$save().then(function(newProduct){
				$scope.products.push(newProduct);
				$scope.displayMode = "list";
			});
		}
		$scope.updateProduct = function (product) {
			console.log("This is updateProduct function!")
			product['description'] = "Ha Ha, This is a test for update!"
			console.log(product)
			product.$save();
			$scope.displayMode = "list";
		}
		$scope.editOrCreateProduct = function (product) {
			$scope.currentProduct = product ? product : {};
			$scope.displayMode = "edit";
		}
		$scope.cancelEdit = function () {
			if ($scope.currentProduct && $scope.currentProduct.$get) {
				$scope.currentProduct.$get();
			}
			$scope.currentProduct = {};
			$scope.displayMode = "list";
		}
		$scope.saveEdit = function (product) {
			if (angular.isDefined(product.id)) {
				$scope.updateProduct(product);
			} else {
				$scope.createProduct(product);
			}		
		}
		$scope.listProducts();	
	});
