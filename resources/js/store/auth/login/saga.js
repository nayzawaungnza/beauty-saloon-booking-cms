import { put, takeEvery } from "redux-saga/effects";
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";
import { router } from '@inertiajs/react';

function* loginUser({ payload: { user } }) {
  try {
    yield router.post('/login', {
      email: user.email,
      password: user.password,
    }, {
      onSuccess: (page) => {
        // Handle successful login
        const user = page.props.auth.user;
        localStorage.setItem('authUser', JSON.stringify(user));
        put(loginSuccess(user));
      },
      onError: (errors) => {
        put(apiError(errors));
      }
    });
    
  } catch (error) {
    yield put(apiError(error.message));
  }
}

function* logoutUser() {
  try {
    yield router.post('/logout', {}, {
      onSuccess: () => {
        localStorage.removeItem('authUser');
        put(logoutUserSuccess());
        router.visit('/login');
      },
      onError: (errors) => {
        put(apiError(errors));
      }
    });
    
  } catch (error) {
    yield put(apiError(error.message));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;