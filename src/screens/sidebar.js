import template from '../views/screens/sidebar.hbs';
import AppUtils from '../libs/appUtils';
import {
    getTemplateRenderer,
} from '../libs/renderer';
import { setTranslation, resetTranslation, } from '../libs/utils';
import { dispatchEvent, handleEvent, } from '../libs/events';
import constants from '../config/constants';

const {
    events,
} = constants;

const rootID = 'sidebar-root';
const overlayID = 'sidebar-overlay';
const mainID = 'sidebar-main';
const backIconID = 'sidebar-close-icon';
const swapMenuItemID = 'sidebar-menu-swap';
const resetAppDataMenuItemID = 'sidebar-menu-reset-app-data';
const reloadAppMenuItemID = 'sidebar-menu-reload-app';

export default class SidebarScreen {
    constructor(appRoot) {
        this.appRoot = appRoot;
        this.root = null;
        this.renderTemplate = getTemplateRenderer(template);
        this.appUtils = new AppUtils(appRoot);
    }

    init() {
        this.root = document.getElementById(rootID);
        this.render();
    }

    registerVisibilityHandler() {
        handleEvent(events.SHOW_SIDEBAR, () => {
            this.setVisible(true);
        }, this.appRoot);
    }

    registerBackAndOverlayClickHandlers() {
        const handler = () => {
            this.setVisible(false);
        };

        handleEvent('click', handler, this.appRoot, `#${backIconID}`);
        handleEvent('click', handler, this.appRoot, `#${overlayID}`);
    }

    registerMenuClickHandlers() {
        const handler = (eventName) => {
            dispatchEvent(this.appRoot, eventName);
            this.setVisible(false);
        };

        handleEvent('click', () => handler(events.SWAP_CURRENCIES), this.appRoot, `#${swapMenuItemID}`);
        handleEvent('click', () => handler(events.RESET_APP_DATA), this.appRoot, `#${resetAppDataMenuItemID}`);
        handleEvent('click', () => handler(events.RELOAD_APP), this.appRoot, `#${reloadAppMenuItemID}`);
    }

    listen() {
        this.registerBackAndOverlayClickHandlers();
        this.registerMenuClickHandlers();
        this.registerVisibilityHandler();
    }

    setVisible(visible) {
        if (this.root) {
            const overlayEl = document.getElementById(overlayID);
            const mainEl = document.getElementById(mainID);

            if (visible) {
                this.root.style.zIndex = 29;
                if (mainEl) resetTranslation(mainEl);
                if (overlayEl) overlayEl.style.opacity = 0.7;
            } else {
                if (mainEl) setTranslation(mainEl, '-100vw, 0');
                if (overlayEl) overlayEl.style.opacity = 0;

                // SMH => Todo: Should I really be doing this?!
                setTimeout(() => {
                    this.root.style.zIndex = -9;
                }, 500);

                this.appUtils.setAppPrimaryFocus(true);
            }
        } else console.log('{{SidebarScreen.setVisible}}: Invalid root element', this.root);
    }

    render() {
        try {
            if (this.root) {
                this.root.innerHTML = this.renderTemplate({});
            } else console.log('{{SidebarScreen.render}}: Root is invalid', this.root);
        } catch (error) {
            console.log('{{SidebarScreen.render}}', error);

            // Re-throw the error (to be handled in the main script)
            throw error;
        }
    }
}
