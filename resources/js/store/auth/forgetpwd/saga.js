import { takeEvery, put } from "redux-saga/effects";
import { FORGET_PASSWORD } from "./actionTypes";
import { 
  userForgetPasswordSuccess, 
  userForgetPasswordError 
} from "./actions";
import { router } from '@inertiajs/react';

function* forgetUser({ payload: { email } }) {
  try {
    yield router.post('/forgot-password', {
      email: email,
    }, {
      onSuccess: () => {
        put(userForgetPasswordSuccess(
          "Reset link has been sent to your email. Please check your inbox."
        ));
      },
      onError: (errors) => {
        put(userForgetPasswordError(
          errors.email || "Failed to send reset link"
        ));
      }
    });
  } catch (error) {
    yield put(userForgetPasswordError(error.message));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

export default function* forgetPasswordSaga() {
  yield watchUserPasswordForget();
}