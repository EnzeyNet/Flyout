(function (angular) {
    "use strict";

	var module = angular.module('net.enzey.menu', ['net.enzey.services']);

	module.directive('nzMenu', function ($compile, $parse, $document, $timeout, nzService) {
		var defaultPositionFn = function(menuElem, contextElem, mouseEvent) {
			menuElem.css('position', 'absolute');
			contextElem.append(menuElem);
		};

		return {
			compile: function ($element, $attrs) {
				//var html = $element.html();
				//$element.html('');
				var currentlyDisplayed = false;

				return {
					pre: function (scope, element, attrs) {
						if (!element.attr('isLifted')) {
							var positionFn = $parse(attrs.positionFn)(scope);
							if (!positionFn) {positionFn = defaultPositionFn;}
							var contextObj = element.parent();
							contextObj.on('click', function(event) {
								if (!currentlyDisplayed) {
									currentlyDisplayed = true;
									var renderedHtml = $compile(html)(scope);
									defaultPositionFn(renderedHtml, contextObj, event);
									nzService.registerClickAwayAction(contextObj, function(event) {
										renderedHtml.remove();
										currentlyDisplayed = false;
									});
									scope.$apply();
								}
							});

							element.attr('isLifted', true);
							var html = element[0].outerHTML;
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