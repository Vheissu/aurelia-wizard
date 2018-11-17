import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(aurelia: FrameworkConfiguration) {
    aurelia.globalResources([
        PLATFORM.moduleName('./step'),
        PLATFORM.moduleName('./wizard')
    ]);
}
