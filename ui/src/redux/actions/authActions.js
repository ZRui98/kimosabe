import 'cross-fetch/polyfill';
import { navigate } from 'gatsby';

import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
} from '../../constants';
import authService from '../../../src/services/authService';

export const registerUser = ({ username, password }) => {
  return async (dispatch) => {
    dispatch({
      type: REGISTER_REQUEST,
    });
    const response = await authService.register({ username, password });
    if (response.error) {
      dispatch({
        type: REGISTER_FAILED,
        errorMessage: response.error,
      });
      return;
    }
    dispatch({
      type: REGISTER_SUCCESS,
    });
    navigate('/');
  };
};

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    });
    const response = await authService.login({ username, password });
    if (response.error) {
      dispatch({
        type: LOGIN_FAILED,
        errorMessage: response.error,
      });
      return;
    }
    dispatch({
      type: LOGIN_SUCCESS,
    });
    navigate('/');
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
    const response = await authService.logout();
    if (response.error) {
      dispatch({
        type: LOGOUT_FAILED,
      });
      return;
    }
    dispatch({
      type: LOGOUT_SUCCESS,
    });
    navigate('/');
  };
};