# aurelia-wizard

A wizard step based plugin for Aurelia applications. Great for dealing with multiple screens of data.


## Documentation is coming

This plugin is a release in progress.

```html
<wizard 
    on-render.call="wizardRender(currentStepIndex, currentStep)" 
    on-navigate.call="wizardNavigate(destinationStep, movingDirection, currentStepIndex, currentStep)" 
    view-model.ref="wizard">
    <step path="step1"></step>
    <step path="step2"></step>
    <step path="step3"></step>
</wizard>
```
