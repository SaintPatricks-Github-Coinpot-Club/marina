import React, { useRef, useState } from 'react';
import Button from '../components/button';
import ShellConnectPopup from '../components/shell-connect-popup';
import ModalUnlock from '../components/modal-unlock';
import { debounce } from 'lodash';
import {
  connectWithConnectData,
  WithConnectDataProps,
} from '../../application/redux/containers/with-connect-data.container';
import { useSelector } from 'react-redux';
import { restorerOptsSelector } from '../../application/redux/selectors/wallet.selector';
import { RootReducerState } from '../../domain/common';
import { decrypt, mnemonicWallet } from '../../application/utils';
import PopupWindowProxy from './popupWindowProxy';
import { SOMETHING_WENT_WRONG_ERROR } from '../../application/utils/constants';

export interface SignTransactionPopupResponse {
  accepted: boolean;
  signedPset?: string;
}

const ConnectSignTransaction: React.FC<WithConnectDataProps> = ({ connectData }) => {
  const popupWindowProxy = new PopupWindowProxy<SignTransactionPopupResponse>();

  const [isModalUnlockOpen, showUnlockModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const network = useSelector((state: RootReducerState) => state.app.network);
  const restorerOpts = useSelector(restorerOptsSelector);
  const encryptedMnemonic = useSelector(
    (state: RootReducerState) => state.wallet.encryptedMnemonic
  );

  const handleModalUnlockClose = () => showUnlockModal(false);
  const handleUnlockModalOpen = () => showUnlockModal(true);

  const sendResponseMessage = (accepted: boolean, signedPset?: string) => {
    return popupWindowProxy.sendResponse({ data: { accepted, signedPset } });
  };

  const rejectSignRequest = async () => {
    try {
      await sendResponseMessage(false);
    } catch (e) {
      console.error(e);
    }
    window.close();
  };

  const signTx = async (password: string) => {
    try {
      if (!password || password.length === 0) throw new Error('Need password');
      const { tx } = connectData;
      if (!tx || !tx.pset) throw new Error('No transaction to sign');

      const mnemo = await mnemonicWallet(
        decrypt(encryptedMnemonic, password),
        restorerOpts,
        network
      );
      const signedPset = await mnemo.signPset(tx.pset);
      await sendResponseMessage(true, signedPset);

      window.close();
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }

    handleModalUnlockClose();
  };

  const debouncedHandleUnlock = useRef(
    debounce(signTx, 2000, { leading: true, trailing: false })
  ).current;

  console.log(connectData.tx?.pset);
  return (
    <ShellConnectPopup
      className="h-popupContent container pb-20 mx-auto text-center bg-bottom bg-no-repeat"
      currentPage="Sign PSET"
    >
      {error.length === 0 ? (
        <>
          <h1 className="mt-8 text-2xl font-medium break-all">{connectData.tx?.hostname}</h1>

          <p className="mt-4 text-base font-medium">Requests you to spend</p>

          <p className="text-small mt-4 font-medium">
            {' '}
            <b>WARNING</b> This transaction could potentially spend all of your funds.
          </p>

          <div className="bottom-24 container absolute right-0 flex justify-between">
            <Button isOutline={true} onClick={rejectSignRequest} textBase={true}>
              Reject
            </Button>
            <Button onClick={handleUnlockModalOpen} textBase={true}>
              Accept
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-8 text-lg font-medium">{SOMETHING_WENT_WRONG_ERROR}</h1>
          <p className="font-small mt-4 text-sm">{error}</p>
          <img className="mx-auto my-10" src="/assets/images/cross.svg" alt="error" />
          <Button
            className="w-36 container mx-auto mt-10"
            onClick={handleUnlockModalOpen}
            textBase={true}
          >
            Unlock
          </Button>
        </>
      )}
      <ModalUnlock
        isModalUnlockOpen={isModalUnlockOpen}
        handleModalUnlockClose={handleModalUnlockClose}
        handleUnlock={debouncedHandleUnlock}
      />
    </ShellConnectPopup>
  );
};

export default connectWithConnectData(ConnectSignTransaction);
