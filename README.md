# aurelia-wizard

A wizard step based plugin for Aurelia applications. Great for dealing with multiple screens of data.


## Documentation is coming

This plugin is a release in progress.

```javascript
export class ViewModel {
    wizard;
    currentStepIndex;

    wizardRender(currentStepIndex, currentStep) {
        this.currentStepIndex = currentStepIndex;

        console.log('Wizard render: ', currentStepIndex, currentStep);
    }

    wizardNavigate(destinationStep, movingDirection, currentStepIndex, currentStep) {
        console.log('Wizard navigate: ', destinationStep, movingDirection, currentStepIndex, currentStep);
    }

    get currentStep() {
        return this.wizard.currentStep.stepViewModel;
    }

    runStepValidation() {
        return new Promise((resolve, reject) => {
            if (this.currentStep.validationCallback) {
                this.currentStep.validationCallback()
                    .then(resolve)
                    .catch(e => {
                        reject(e);
                    });
            } else {
                resolve(true);
            }
        });
    }

    async goToNextStep() {
        let isStepValid = await this.runStepValidation();

        if (stepValid) {
            this.wizard.goToNextStep();
        }
    }

    goToPreviousStep() {
        this.wizard.goToPreviousStep();
    }
}
```

```javascript
export class StepOne {
     validationCallback = () => {      
         return true;
    };
} 
```

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
