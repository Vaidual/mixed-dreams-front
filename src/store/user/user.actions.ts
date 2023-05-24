import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthResponse, ILogin, IRegisterCompany } from "interfaces/auth.interface";
import { IStandardError } from "interfaces/responseError.interface";
import { AuthService } from "services/auth/auth.service";

export const registerCompany = createAsyncThunk<IAuthResponse, IRegisterCompany, {rejectValue: IStandardError}>(
  "auth/register/company",
  async (data, thunkAPI) => {
      try {
          const response = await AuthService.registerCompany(data)
          return response
      } catch (e) {
        //throw e
          return thunkAPI.rejectWithValue(e as IStandardError);
      }
  }
);

export const login = createAsyncThunk<IAuthResponse, ILogin>(
  "auth/login",
  async (data, thunkAPI) => {
      try {
          const response = await AuthService.login(data)
          return response
      } catch(e) {
          return thunkAPI.rejectWithValue(e);
      }
  }
);