import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './guards';
import {
  CONNECT_ENABLE_ROUTE,
  CONNECT_SPEND_ROUTE,
  CONNECT_SIGN_PSET_ROUTE,
  CONNECT_SIGN_MSG_ROUTE,
  INITIALIZE_WELCOME_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  RESTORE_VAULT_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  DEFAULT_ROUTE,
  LOGIN_ROUTE,
  TRANSACTIONS_ROUTE,
  RECEIVE_SELECT_ASSET_ROUTE,
  SEND_SELECT_ASSET_ROUTE,
  SEND_ADDRESS_AMOUNT_ROUTE,
  SEND_CHOOSE_FEE_ROUTE,
  SEND_CONFIRMATION_ROUTE,
  SETTINGS_MENU_SECURITY_ROUTE,
  SETTINGS_MENU_SETTINGS_ROUTE,
  SETTINGS_MENU_INFO_ROUTE,
  SETTINGS_SHOW_MNEMONIC_ROUTE,
  SETTINGS_CHANGE_PASSWORD_ROUTE,
  SETTINGS_CURRENCY_ROUTE,
  SETTINGS_EXPLORER_ROUTE,
  SETTINGS_NETWORKS_ROUTE,
  SETTINGS_CREDITS_ROUTE,
  SETTINGS_TERMS_ROUTE,
  SEND_END_OF_FLOW_ROUTE,
  SEND_PAYMENT_SUCCESS_ROUTE,
  SEND_PAYMENT_ERROR_ROUTE,
  BACKUP_UNLOCK_ROUTE,
  SETTINGS_DEEP_RESTORER_ROUTE,
  RECEIVE_ADDRESS_ROUTE,
} from './constants';

// Connect
import ConnectEnableView from '../connect/enable';
import ConnectSpend from '../connect/spend';
import ConnectSignTransaction from '../connect/sign-pset';
import ConnectSignMsg from '../connect/sign-msg';

// Onboarding
import Welcome from '../onboarding/welcome';
import SelectAction from '../onboarding/select-action';
import WalletRestore from '../onboarding/wallet-restore';
import WalletCreate from '../onboarding/wallet-create';
import EndOfFlow from '../../application/redux/containers/end-of-flow-onboarding.container';
import SeedReveal from '../../application/redux/containers/seed-reveal.container';
import SeedConfirm from '../../application/redux/containers/seed-confirm.container';
import BackUpUnlock from '../onboarding/backup-unlock';
// Wallet
import Home from '../../application/redux/containers/home.container';
import LogIn from '../wallet/log-in';
import Transactions from '../../application/redux/containers/transactions.container';
import ReceiveAddress from '../../application/redux/containers/receive.container';
import ReceiveSelectAsset from '../../application/redux/containers/receive-select-asset.container';
import SendSelectAsset from '../../application/redux/containers/send-select-asset.container';
import AddressAmount from '../../application/redux/containers/address-amount.container';
import ChooseFee from '../../application/redux/containers/choose-fee.container';
import Confirmation from '../../application/redux/containers/confirmation.container';
import SendEndOfFlow from '../../application/redux/containers/end-of-flow.container';
import PaymentSuccess from '../../application/redux/containers/payment-success.container';
import PaymentError from '../wallet/send/payment-error';
// Settings
import SettingsMenuSecurity from '../settings/menu-security';
import SettingsMenuSettings from '../settings/menu-settings';
import SettingsMenuInfo from '../settings/menu-info';
import SettingsShowMnemonic from '../../application/redux/containers/settings-show-mnemonic.container';
import SettingsDeepRestorer from '../../application/redux/containers/deep-restorer.container';
import SettingsChangePassword from '../settings/change-password';
import SettingsCurrency from '../settings/currency';
import SettingsExplorer from '../settings/explorer';
import SettingsNetworks from '../../application/redux/containers/settings-networks.container';
import SettingsCredits from '../settings/credits';
import SettingsTerms from '../settings/terms';

const Routes: React.FC = () => {
  return (
    <Switch>
      {/*Onboarding*/}
      <Route exact path={INITIALIZE_WELCOME_ROUTE} component={Welcome} />
      <Route exact path={INITIALIZE_SELECT_ACTION_ROUTE} component={SelectAction} />
      <Route exact path={INITIALIZE_CREATE_PASSWORD_ROUTE} component={WalletCreate} />
      <Route exact path={INITIALIZE_SEED_PHRASE_ROUTE} component={SeedReveal} />
      <Route exact path={INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE} component={SeedConfirm} />
      <Route exact path={INITIALIZE_END_OF_FLOW_ROUTE} component={EndOfFlow} />
      <Route exact path={RESTORE_VAULT_ROUTE} component={WalletRestore} />
      <Route exact path={BACKUP_UNLOCK_ROUTE} component={BackUpUnlock} />
      {/*Wallet*/}
      <ProtectedRoute exact path={DEFAULT_ROUTE} comp={Home} />
      <ProtectedRoute exact path={TRANSACTIONS_ROUTE} comp={Transactions} />
      <ProtectedRoute exact path={RECEIVE_SELECT_ASSET_ROUTE} comp={ReceiveSelectAsset} />
      <ProtectedRoute exact path={RECEIVE_ADDRESS_ROUTE} comp={ReceiveAddress} />
      <ProtectedRoute exact path={SEND_SELECT_ASSET_ROUTE} comp={SendSelectAsset} />
      <ProtectedRoute exact path={SEND_ADDRESS_AMOUNT_ROUTE} comp={AddressAmount} />
      <ProtectedRoute exact path={SEND_CHOOSE_FEE_ROUTE} comp={ChooseFee} />
      <ProtectedRoute exact path={SEND_CONFIRMATION_ROUTE} comp={Confirmation} />
      <ProtectedRoute exact path={SEND_END_OF_FLOW_ROUTE} comp={SendEndOfFlow} />
      <ProtectedRoute exact path={SEND_PAYMENT_SUCCESS_ROUTE} comp={PaymentSuccess} />
      <ProtectedRoute exact path={SEND_PAYMENT_ERROR_ROUTE} comp={PaymentError} />
      {/*Settings*/}
      <ProtectedRoute exact path={SETTINGS_MENU_SECURITY_ROUTE} comp={SettingsMenuSecurity} />
      <ProtectedRoute exact path={SETTINGS_MENU_SETTINGS_ROUTE} comp={SettingsMenuSettings} />
      <ProtectedRoute exact path={SETTINGS_MENU_INFO_ROUTE} comp={SettingsMenuInfo} />
      <ProtectedRoute exact path={SETTINGS_SHOW_MNEMONIC_ROUTE} comp={SettingsShowMnemonic} />
      <ProtectedRoute exact path={SETTINGS_CHANGE_PASSWORD_ROUTE} comp={SettingsChangePassword} />
      <ProtectedRoute exact path={SETTINGS_CURRENCY_ROUTE} comp={SettingsCurrency} />
      <ProtectedRoute exact path={SETTINGS_EXPLORER_ROUTE} comp={SettingsExplorer} />
      <ProtectedRoute exact path={SETTINGS_NETWORKS_ROUTE} comp={SettingsNetworks} />
      <ProtectedRoute exact path={SETTINGS_CREDITS_ROUTE} comp={SettingsCredits} />
      <ProtectedRoute exact path={SETTINGS_DEEP_RESTORER_ROUTE} comp={SettingsDeepRestorer} />
      <Route exact path={SETTINGS_TERMS_ROUTE} component={SettingsTerms} />
      {/*Login*/}
      <Route exact path={LOGIN_ROUTE} component={LogIn} />
      {/*Connect*/}
      <Route exact path={CONNECT_ENABLE_ROUTE} component={ConnectEnableView} />
      <Route exact path={CONNECT_SPEND_ROUTE} component={ConnectSpend} />
      <Route exact path={CONNECT_SIGN_PSET_ROUTE} component={ConnectSignTransaction} />
      <Route exact path={CONNECT_SIGN_MSG_ROUTE} component={ConnectSignMsg} />
    </Switch>
  );
};

export default Routes;
