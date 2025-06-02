import { takeEvery, put } from "redux-saga/effects";
import { EDIT_PROFILE } from "./actionTypes";
import { profileSuccess, profileError } from "./actions";
import { router } from '@inertiajs/react';

function* editProfile({ payload: { user } }) {
  try {
    yield router.put('/profile', {
      name: user.username,
      // Include other profile fields as needed
      _method: 'PUT' // Laravel's method spoofing for PUT requests
    }, {
      preserveState: true,
      onSuccess: (page) => {
        const updatedUser = page.props.auth.user;
        put(profileSuccess(updatedUser));
      },
      onError: (errors) => {
        put(profileError(
          errors.name || 
          errors.email || 
          "Profile update failed. Please try again."
        ));
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    yield put(profileError(error.message));
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

export default function* ProfileSaga() {
  yield watchProfile();
}