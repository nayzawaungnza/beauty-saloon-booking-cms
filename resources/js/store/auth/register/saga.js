import { takeEvery, put } from "redux-saga/effects";
import { REGISTER_USER } from "./actionTypes";
import { 
  registerUserSuccessful, 
  registerUserFailed 
} from "./actions";
import { router } from '@inertiajs/react';

function* registerUser({ payload: { user } }) {
  try {
    yield router.post('/register', {
      name: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    }, {
      onSuccess: (page) => {
        // Handle successful registration
        const registeredUser = page.props.auth.user;
        put(registerUserSuccessful(registeredUser));
        
        // Redirect to dashboard or verification page
        router.visit('/dashboard');
      },
      onError: (errors) => {
        put(registerUserFailed(
          errors.email || 
          errors.password || 
          "Registration failed. Please try again."
        ));
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    yield put(registerUserFailed(error.message));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser);
}

export default function* accountSaga() {
  yield watchUserRegister();
}