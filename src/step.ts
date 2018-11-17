import { bindable, bindingMode, computedFrom, customElement } from 'aurelia-framework';

@customElement('step')
export class Step {
    @bindable path;
    @bindable optional = false;
    @bindable selected = false;

    @bindable({ defaultBindingMode: bindingMode.twoWay }) model = {};

    @bindable canExit = true;
    @bindable stepEnter;
    @bindable stepExit;

    stepCanExitComputed = true;

    private stepViewModel;
    private stepRef;

    attached() {
        this.stepViewModel = this.stepRef.currentViewModel;
    }

    @computedFrom('selected')
    get hidden() {
        return !this.selected;
    }

    canExitStep(direction = 'forward') {
        if (typeof this.canExit !== 'function') {
            return this.canExit && this.stepCanExitComputed ? Promise.resolve() : Promise.reject(new Error('Cannot exit step'));
        } else {
            /* tslint:disable-next-line */
            return this.canExit({ direction: direction }) && this.stepCanExitComputed;
        }
    }
}
