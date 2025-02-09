import SafeEventEmitter from '@metamask/safe-event-emitter';
import browser from 'webextension-polyfill';
import { testWalletData } from '../application/constants/cypress';
import { logOut, onboardingCompleted } from '../application/redux/actions/app';
import { enableWebsite } from '../application/redux/actions/connect';
import { setWalletData } from '../application/redux/actions/wallet';
import { marinaStore, wrapMarinaStore } from '../application/redux/store';
import { IDLE_MESSAGE_TYPE } from '../application/utils';
import { tabIsOpen } from '../application/utils/common';
import { setUpPopup } from '../application/utils/popup';
import {
  isOpenPopupMessage,
  isPopupResponseMessage,
  OpenPopupMessage,
  PopupName,
} from '../domain/message';
import { POPUP_RESPONSE } from '../presentation/connect/popupBroker';
import { INITIALIZE_WELCOME_ROUTE } from '../presentation/routes/constants';

// MUST be > 15 seconds
const IDLE_TIMEOUT_IN_SECONDS = 300; // 5 minutes
let welcomeTabID: number | undefined = undefined;

wrapMarinaStore(marinaStore); // wrap store to proxy store

/**
 * Fired when the extension is first installed, when the extension is updated to a new version,
 * and when the browser is updated to a new version.
 * https://extensionworkshop.com/documentation/develop/onboard-upboard-offboard-users/
 */
browser.runtime.onInstalled.addListener(({ reason }) => {
  (async () => {
    switch (reason) {
      //On first install, open new tab for onboarding
      case 'install':
        // /!\ skip onboarding in test env
        if (process.env.NODE_ENV === 'test') {
          marinaStore.dispatch(setWalletData(testWalletData));
          marinaStore.dispatch(enableWebsite('vulpemventures.github.io', 'regtest')); // skip the enable step too
          await setUpPopup();
          marinaStore.dispatch(onboardingCompleted());
          break;
        }

        // run onboarding flow on fullscreen
        welcomeTabID = await openInitializeWelcomeRoute();
        break;
    }
  })().catch(console.error);
});

// /!\ FIX: prevent opening the onboarding page if the browser has been closed
browser.runtime.onStartup.addListener(() => {
  (async () => {
    if (marinaStore.getState().wallet.encryptedMnemonic !== '') {
      // Everytime the browser starts up we need to set up the popup page
      await browser.browserAction.setPopup({ popup: 'popup.html' });
    }
  })().catch(console.error);
});

// this listener only run IF AND ONLY IF the popup is not set
// popup is set at the end of onboarding workflow
browser.browserAction.onClicked.addListener(() => {
  (async () => {
    // here we prevent to open many onboarding pages fullscreen
    // in case we have one active already in the current tab
    if (welcomeTabID && (await tabIsOpen(welcomeTabID))) return;

    // in case the onboarding page is closed before finishing
    // the wallet creation process, we let user re-open it
    // Check if wallet exists in storage and if not we open the
    // onboarding page again.
    if (marinaStore.getState().wallet.encryptedMnemonic === '') {
      welcomeTabID = await openInitializeWelcomeRoute();
      return;
    } else {
      await browser.browserAction.setPopup({ popup: 'popup.html' });
      await browser.browserAction.openPopup();
    }
  })().catch(console.error);
});

// the event emitter is used to link all the content-scripts (popups and providers ones)
const eventEmitter = new SafeEventEmitter();

browser.runtime.onConnect.addListener((port: browser.Runtime.Port) => {
  port.onMessage.addListener((message: any) => {
    if (isOpenPopupMessage(message)) {
      handleOpenPopupMessage(message, port).catch((error: any) => {
        console.error(error);
        port.postMessage({ data: undefined });
      });
      return;
    }

    if (isPopupResponseMessage(message)) {
      // propagate popup response
      eventEmitter.emit(POPUP_RESPONSE, message.data);
    }
  });
});

// Open the popup window and wait for a response
// then forward the response to content-script
async function handleOpenPopupMessage(message: OpenPopupMessage, port: browser.Runtime.Port) {
  await createBrowserPopup(message.name);
  eventEmitter.once(POPUP_RESPONSE, (data: any) => {
    port.postMessage(data);
  });
}

try {
  // set the idle detection interval
  browser.idle.setDetectionInterval(IDLE_TIMEOUT_IN_SECONDS);
  // add listener on Idle API, sending a message if the new state isn't 'active'
  browser.idle.onStateChanged.addListener(function (newState: browser.Idle.IdleState) {
    if (newState !== 'active') {
      browser.runtime.sendMessage(undefined, { type: IDLE_MESSAGE_TYPE }).catch(console.error);
      // this will handle the logout when the extension is closed
      marinaStore.dispatch(logOut());
    }
  });
} catch (error) {
  console.error(error);
}

async function openInitializeWelcomeRoute(): Promise<number | undefined> {
  const url = browser.runtime.getURL(`home.html#${INITIALIZE_WELCOME_ROUTE}`);
  const { id } = await browser.tabs.create({ url });
  return id;
}

const POPUP_HTML = 'popup.html';

async function createBrowserPopup(name?: PopupName) {
  const options = {
    url: `${POPUP_HTML}#/connect/${name}`,
    type: 'popup',
    height: 600,
    width: 360,
    focused: true,
    left: 100,
    top: 100,
  };
  await browser.windows.create(options as any);
}
