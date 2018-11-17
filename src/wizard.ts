import { bindable, bindingMode, children, computedFrom, customElement, inlineView, observable } from 'aurelia-framework';
import { TaskQueue } from 'aurelia-task-queue';

@inlineView(`<template><slot></slot></template>`)
@customElement('wizard')
export class Wizard {
    static inject = [Element, TaskQueue];

    @bindable({ defaultBindingMode: bindingMode.oneWay }) options;
    @bindable onRender;
    @bindable onNavigate;

    @observable currentStep;
    @observable currentStepIndex = -1;

    @children('step') wizardSteps;

    constructor(private element: HTMLElement, private taskQueue) {

    }
    
    currentStepChanged() {
        if (this.onRender) {
            this.onRender({currentStepIndex: this.currentStepIndex, currentStep: this.currentStep});
        }
    }

    wizardStepsChanged() {
        if (this.wizardSteps && this.wizardSteps.length > 0) {
            this.currentStepIndex = 0;

            this.currentStep = this.wizardSteps[0];
            
            if (typeof this.currentStep.stepEnter === 'function') {
                this.currentStep.stepEnter('forward');
            }

            this.currentStep.completed = false;
            this.currentStep.selected = true;      
        }
    }

    hasStep(stepIndex) {
        return this.wizardSteps && this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
    }

    hasPreviousStep() {
        return this.hasStep(this.currentStepIndex - 1);
    }

    hasNextStep() {
        return this.hasStep(this.currentStepIndex + 1);
    }

    @computedFrom('currentStepIndex', 'wizardSteps')
    get isFirstStep() {
        if (!this.wizardSteps) {
            return false;
        }

        return this.wizardSteps.length > 0 && this.currentStepIndex === 0;
    }

    @computedFrom('currentStepIndex', 'wizardSteps')
    get isLastStep() {
        if (!this.wizardSteps) {
            return false;
        }

        return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
    }

    @computedFrom('currentStepIndex', 'wizardSteps')
    get canGoToPreviousStep() {
        const previousStepIndex = this.currentStepIndex - 1;

        return this.hasStep(previousStepIndex) && this.canGoToStep(previousStepIndex);
    }

    @computedFrom('currentStepIndex', 'wizardSteps')
    get canGoToNextStep() {
        const nextStepIndex = this.currentStepIndex + 1;

        return this.hasStep(nextStepIndex) && this.canGoToStep(nextStepIndex);
    }

    @computedFrom('currentStep')
    get currentStepIsValid() {
        return this.currentStep.canExitStep();
    }

    preventCurrentStepNavigation() {
        this.currentStep.stepCanExitComputed = false;
    }

    enableCurrentStepNavigation() {
        this.currentStep.stepCanExitComputed = true;
    }

    getStepAtIndex(stepIndex) {
        if (!this.hasStep(stepIndex)) {
            throw new Error(`Could not find step at this stepIndex`);
        }

        return this.wizardSteps.find((item, index, array) => index === stepIndex);
    }

    getMovingDirection(destinationStep) {
        let movingDirection;

        if (destinationStep > this.currentStepIndex) {
            movingDirection = 'forward';
        } else if (destinationStep < this.currentStepIndex) {
            movingDirection = 'backward';
        } else {
            movingDirection = 'stay';
        }

        return movingDirection;
    }

    goToPreviousStep() {
        if (this.hasPreviousStep()) {
            this.goToStep(this.currentStepIndex - 1);
        }
    }

    goToNextStep() {
        if (this.hasNextStep()) {
            this.goToStep(this.currentStepIndex + 1);
        }
    }

    canGoToStep(stepIndex) {
        let result = this.hasStep(stepIndex);

        this.wizardSteps.forEach((wizardStep, index) => {
            if (index < stepIndex && index !== this.currentStepIndex) {
                result = result && (wizardStep.completed || wizardStep.optional);
            }
        });

        return result;
    }

    goToStep(destinationStepIndex) {
        const destinationStep = this.getStepAtIndex(destinationStepIndex);

        const movingDirection = this.getMovingDirection(destinationStepIndex);

        this.currentStep.canExitStep(movingDirection)
            .then(() => {
                this.wizardSteps.forEach((wizardStep, index) => {
                    if (index === this.currentStepIndex) {
                        wizardStep.completed = true;
                    }

                    if (this.currentStepIndex > destinationStepIndex && index > destinationStepIndex) {
                        wizardStep.completed = false;
                    }
                });

                if (typeof this.currentStep.stepExit === 'function') {
                    this.currentStep.stepExit({direction: movingDirection});
                }

                this.currentStep.selected = false;

                this.currentStepIndex = destinationStepIndex;
                this.currentStep = destinationStep;

                if (typeof this.currentStep.stepEnter === 'function') {
                    this.currentStep.stepEnter({direction: movingDirection});
                }

                this.currentStep.selected = true;

                if (this.onNavigate) {
                    this.onNavigate({
                        destinationStep: destinationStep, 
                        movingDirection: movingDirection, 
                        currentStepIndex: this.currentStepIndex, 
                        currentStep: this.currentStep
                    });
                }
            })
            .catch(e => {
                if (typeof this.currentStep.stepExit === 'function') {
                    this.currentStep.stepExit({direction: 'stay'});
                }

                if (typeof this.currentStep.stepEnter === 'function') {
                    this.currentStep.stepEnter({direction: 'stay'});
                }
            });
    }
}
