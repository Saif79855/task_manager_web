"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";
import { setAuthTokenGetter } from "@/lib/axios";
import { getToken } from "@/lib/authStorage";
import {
  setToken,
  authChecked,
  fetchCurrentUser,
} from "@/features/auth/authSlice";

export default function StoreProvider({ children }) {
  useEffect(() => {
    setAuthTokenGetter(() => store.getState().auth.token);

    const token = getToken();

    if (token) {
      store.dispatch(setToken(token));
      store.dispatch(fetchCurrentUser());
    } else {
      store.dispatch(authChecked());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
