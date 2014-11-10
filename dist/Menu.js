(function (angular) {
    "use strict";

	var module = angular.module('net.enzey.menu', ['net.enzey.services']);

	module.provider('nzMenuConfig', function () {
		var positionFn = function(flyoutElem, contextElem, mouseEvent) {
			flyoutElem.css('position', 'absolute');
			contextElem.append(flyoutElem);
		};

		this.setPositionFn = function(_positionFn) {
			if (angular.isFunction(_positionFn)) {
				positionFn = _positionFn;
			}
		};

		this.$get = function() {
			return {
				getPositionFn: function() {
					return positionFn;
				}
			};
		};
	});

	module.directive('nzMenu', function ($compile, $parse, nzService, nzMenuConfig) {
		return {
			scope: true,
			priority: 9999,
			compile: function ($element, $attrs) {
				var currentlyDisplayed = false;

				var html;
				if (!$element.attr('isLifted')) {
					var html = $element[0].outerHTML;
				}

				return {
					pre: function (scope, element, attrs) {
						if (!element.attr('isLifted')) {
							var parentElem = $element.parent();
							var positionFn = $parse(attrs.positionFn)(scope);
							if (!positionFn) {positionFn = nzMenuConfig.getPositionFn();}

							parentElem.on('click', function(event) {
								if (!currentlyDisplayed) {
									currentlyDisplayed = true;
									var renderedHtml = $compile(html)(scope);
									positionFn(renderedHtml, parentElem, event);
									nzService.registerClickAwayAction(parentElem, function(event) {
										renderedHtml.remove();
										currentlyDisplayed = false;
									});
									scope.$apply();
								}
							});

							// Configure click action
							element.attr('isLifted', true);
							element.remove();
						}
					},
					post: function (scope, element, attrs, controllers) {
						
					}
				}
			}
		};

	});

})(angular);