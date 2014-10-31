(function (angular) {
    "use strict";

	var module = angular.module('net.enzey.services', []);

	module.service('nzService', function ($document, $timeout) {
		// position flyout

		var getChildElems = function(elem) {
			var childElems = [];
			elem = angular.element(elem);
			var children = elem.children();
			for (var i=0; i < children.length; i++) {
				getChildElems(children[i]).forEach(function(childElem) {
					childElems.push(childElem);
				});
			}
			childElems.push(elem[0]);

			return childElems;
		};

		this.registerClickAwayAction = function(element, clickAwayAction) {
			var wrappedClickAwayAction  = function(event) {
				if (getChildElems(element).indexOf(event.target) === -1) {
					$document.off('click', clickAwayAction);
					clickAwayAction(event);
				}
			};
			$timeout(function() {
				$document.on('click', wrappedClickAwayAction);
			});
		};

	});

})(angular);