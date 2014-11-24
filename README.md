Flyout
====

Native AngularJS flyout helper

Angular Module: net.enzey.flyout
Dependent on: net.enzey.services

Directive Name: nzFlyout

Live Example: http://EnzeyNet.github.io/Flyout

| directive params | description |
| ------------- | ------------- |
| positionFn | A string contant that maps to a registered positioning function in 'nzFlyoutConfig' or reference to a positioning function on the scope. If not set the default positioning function in 'nzFlyoutConfig' will be used |
| positionToOther | Takes no parameters, when it exists the flyout will be positioned against the next parent element that has the 'attribute nz-flyout-position-against'. |
| appendToBody | Takes no parameters, when it exists the flyout will be appended to the body instead of its parent element. |

```
<button>
	<div nz-flyout>
		<menu>
		</menu>
	</div>
</button>
```
