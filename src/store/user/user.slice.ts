import { createSlice } from '@reduxjs/toolkit'
import { IInitialState } from './user.interface'
import StorageTypes from 'constants/StorageTypes'
import { login, registerCompany } from './user.actions'
import { removeAuthDataFromStorage } from 'services/auth/auth.helper'

const initialState: IInitialState = {
  user: localStorage.getItem(StorageTypes.User) ? 
    JSON.parse(localStorage.getItem(StorageTypes.User) as string) : 
    null,
  isLoading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      //removeAuthDataFromStorage()
  }
  },
  extraReducers: builder => {
    builder
      .addCase(registerCompany.pending, state => {
        state.isLoading = true;
      })
      .addCase(registerCompany.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(registerCompany.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
  }
})

export const { logout } = userSlice.actions