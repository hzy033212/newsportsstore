angular.module("exampleApp", ["increment"])
	.constant("baseUrl", "http://172.22.99.103:5500/products/")
	.controller("defaultCtrl", function ($scope, $http, baseUrl) {
		$scope.displayMode = "list";
		$scope.currentProduct = null;
		$scope.listProducts = function () {
			console.log("This is listProducts function!");
			$http.get(baseUrl).then(function (response) {
				$scope.products = response.data;
			});
		}
		$scope.deleteProduct = function (product) {
			console.log("This is deleteProduct function!")
			console.log(product)
			console.log(baseUrl + product.id)
			$http({ 'url': baseUrl + product.id,
				'method': "DELETE",
				}).then(function () {
					console.log("Deleted target product successfully!");
					$scope.products.splice($scope.products.indexOf(product), 1);
				}, function (error) {
					console.log("ERROR: " + error);
				});
		}
		$scope.createProduct = function (product) {
			console.log("This is createProduct function!")
			product['description'] = "Ha Ha, This is a test!"
			console.log(product)
			curUrl = baseUrl.substring(0, baseUrl.length - 1)
			console.log(curUrl)
			$http( {'url': curUrl,
			        'method': "POST",
			        'data': product,
				}).then(function (newProduct) {
					$scope.products.push(newProduct);
					$scope.displayMode = "list";
				}, function (error) {
					console.log("ERROR: " + error);
				});
			$scope.listProducts();
		}
		$scope.updateProduct = function (product) {
			console.log("This is updateProduct function!")
			product['description'] = "Ha Ha, This is a test for update!"
			console.log(product)
			console.log(baseUrl + product.id)
			$http({
				'url': baseUrl + product.id,
				'method': "PUT",
				'data': product,
			}).then(function (modifiedProduct) {
				for (var i = 0; i < $scope.products.length; i++) {
					if ($scope.products[i].id == modifiedProduct.id) {
						$scope.products[i] = modifiedProduct;
						break;
					}
				}
				$scope.displayMode = "list";
			}, function (error) {
				console.log("ERROR: " + error);
			});
			$scope.listProducts();
		}
		$scope.editOrCreateProduct = function (product) {
			$scope.currentProduct = product ? angular.copy(product) : {};
			$scope.displayMode = "edit";
		}
		$scope.saveEdit = function (product) {
			if (angular.isDefined(product.id)) {
				$scope.updateProduct(product);
			} else {
				$scope.createProduct(product);
			}
		}
		$scope.cancelEdit = function () {
			$scope.currentProduct = {};
			$scope.displayMode = "list";
		}
		$scope.listProducts();	
	});
