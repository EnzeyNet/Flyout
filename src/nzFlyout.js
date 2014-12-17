(function (angular) {
    "use strict";

	var module = angular.module('net.enzey.flyout', ['net.enzey.services']);
	var repositionEventTrigger = 'NZ_EVENT_REPOSITION';

	module.provider('nzFlyoutConfig', function () {
		var defaultPositionFn = function(flyoutElem, contextElem, mouseEvent) {
			flyoutElem.css('position', 'absolute');
			contextElem.append(flyoutElem);
		};
		var positioinFnMap = {};

		this.setPositionFn = function(_positionFn, _key) {
			if (angular.isFunction(_positionFn)) {
				if (!_key) {
					positioinFnMap[null] = _positionFn
					positioinFnMap[undefined] = _positionFn
				} else if (angular.isString(_key)) {
					positioinFnMap[_key] = _positionFn
				}
			}
		};

		this.$get = function() {
			return {
				getPositionFn: function(_key) {
					return positioinFnMap[_key];
				}
			};
		};

		this.setPositionFn(defaultPositionFn);
	});

	module.directive('nzFlyout', function ($compile, $parse, $document, nzService, nzFlyoutConfig) {
		return {
			priority: 9999,
			terminal: true,
			compile: function ($element, $attrs) {
				var directiveName = this.name;
				var directivePriority = this.priority;
				var currentlyDisplayed = false;

				var html = $element[0].outerHTML;

				return {
					pre: function (scope, element, attrs) {
						var parentElem = $element.parent();
						var positionFn = $parse(attrs.positionFn)(scope);
						if (angular.isString(positionFn)) {
							positionFn = nzFlyoutConfig.getPositionFn(positionFn);
						} else if (!angular.isFunction(positionFn)) {
							positionFn = nzFlyoutConfig.getPositionFn();
						}

						var positionAgainstElem = parentElem;
						if (angular.isDefined(attrs.positionToOther)) {
							// Find element to bind flyout to
							var searchParentElem = parentElem;
							while (searchParentElem.length) {
								if (angular.isDefined(searchParentElem.attr('data-nz-flyout-position-against')) ||
									angular.isDefined(searchParentElem.attr('nz-flyout-position-against')) ) {
									positionAgainstElem = searchParentElem;
									break;
								}
								searchParentElem = searchParentElem.parent();
							}
						}

						var appendToElem = parentElem;
						if (angular.isDefined(attrs.appendToBody)) {
							appendToElem = angular.element($document[0].body);
						}

						parentElem.on('click', function(event) {
							if (!currentlyDisplayed) {
								currentlyDisplayed = true;
								var childScope = scope.$new();
								var renderedHtml = $compile(html, null, directivePriority)(childScope);
								positionFn(renderedHtml, positionAgainstElem, appendToElem, event);
								nzService.registerClickAwayAction(function(event) {
									renderedHtml.remove();
									childScope.$destroy();
									currentlyDisplayed = false;
								}, parentElem, renderedHtml);
								childScope.$apply();
								childScope.$on(repositionEventTrigger, function() {
									positionFn(renderedHtml, positionAgainstElem, appendToElem, event);
								});
							}
						});

						element.remove();
					},
					post: function (scope, element, attrs, controllers) {
						
					}
				}
			}
		};

	});

})(angular);