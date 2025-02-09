import { connect } from 'react-redux';
import { RootReducerState } from '../../../domain/common';
import SeedConfirmView, { SeedConfirmProps } from '../../../presentation/onboarding/seed-confirm';

const mapStateToProps = (state: RootReducerState): SeedConfirmProps => ({
  onboardingMnemonic: state.onboarding.mnemonic,
  isFromPopupFlow: state.onboarding.isFromPopupFlow,
});

const SeedConfirm = connect(mapStateToProps)(SeedConfirmView);

export default SeedConfirm;
