import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {BASE_URL} from '../../constant/base_url';
import { getNotificationToken } from '../../lib/Notifee';

export const SESSION_ID = '"@SMARTSEVA_PARTNER:userId"';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_COUNTRIES = 'SET_COUNTRIES';
export const SET_STATES = 'SET_STATES';
export const SET_CITIES = 'SET_CITIES';
export const REGISTER = 'REGISTER';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const VERIFY_OTP = 'VERIFY_OTP';
export const SET_NEW_PASSWORD = 'SET_NEW_PASSWORD';

export const auth = user_id => {
  return {type: LOGIN, user_id: user_id};
};

export const logout = () => {
  return async dispatch => {
    dispatch({type: LOGOUT});
    await AsyncStorage.removeItem(SESSION_ID);
  };
};

export const login = ({email, password}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('token', token);

    const response = await axios.post(`partner/login`, formData);

    if (response.data.result) {
      const {
        otp,
        mobile_otp,
        email,
        mobile,
        mobile_verified,
        email_verified,
        user_id,
      } = response.data.data;

      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            emailOTP: otp,
            mobileOTP: mobile_otp,
            mobileNumber: mobile,
            email: email,
            userId: user_id,
          },
        });
      }
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setCountries = () => {
  return async dispatch => {
    const response = await axios.get('main/get-countries');
    dispatch({type: SET_COUNTRIES, countries: response.data.data});
  };
};

export const setStates = () => {
  return async dispatch => {
    const response = await axios.get('main/get-states/101');
    dispatch({type: SET_STATES, states: response.data.data});
  };
};

export const setCities = state => {
  return async dispatch => {
    const response = await axios.get('main/get-cities/' + state);
   dispatch({type: SET_CITIES, cities: response.data.data});
  };
};

export const register = (
  firstname,
  lastname,
  emailVal,
  password,
  passwordConfirmation,
  mobileVal,
  company,
  stateCode,
  cityId,
  trade_license_number,
  image,
  startdate,
  expiredate,
  latitude,
  longitude,
) => {
  return async dispatch => {
    if (!firstname) {
      throw new Error('First Name is required!');
    }
    if (!lastname) {
      throw new Error('Last Name is required!');
    }
    if (!emailVal) {
      throw new Error('Email is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (!passwordConfirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password !== passwordConfirmation) {
      throw new Error('Password Fields must be same!');
    }
    if (!mobileVal) {
      throw new Error('Mobile Number is required!');
    }
    if (!company) {
      throw new Error('Company Name is required!');
    }
    if (!stateCode) {
      throw new Error('State is required!');
    }
    if (!cityId) {
      throw new Error('City is required!');
    }
    if (!latitude || !longitude) {
      throw new Error('Allow access your location!');
    }
    // if (!trade_license_number) {
    //   throw new Error('Trade License Number is required!');
    // }
    // if (!image.uri) {
    //   throw new Error('License is required!');
    // }
    // if (!startdate) {
    //   throw new Error('License Issue Date is required!');
    // }
    // if (!expiredate) {
    //   throw new Error('License Expire Date is required!');
    // }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', emailVal);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    formData.append('phone_code', '+91');
    formData.append('mobile', mobileVal);
    formData.append('company_name', company);
    formData.append('country', '101');
    formData.append('state', stateCode);
    formData.append('city', cityId);
    formData.append('trade_license_number', trade_license_number);
    if (image.uri) {
      formData.append('tradelicense', image);
    }
    formData.append('startdate', startdate.toLocaleDateString());
    formData.append('expiredate', expiredate.toLocaleDateString());
    formData.append('token', token);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    const response = await fetch(`${BASE_URL}partner/register`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const resData = await response.json();
    // const err = [];
    //
    // if (!resData.result) {
    //   const { errors } = resData;
    //
    //   for (const key in errors) {
    //     err.push(errors[key]);
    //   }
    // }
    //
    // if (err.length !== 0) {
    //   throw new Error(err.join("\n"));
    // }
    if (!resData.result) {
      throw new Error(resData.msg);
    }

    const {otp, mobile_otp, email, mobile, mobile_verified, email_verified} =
      resData.data;

    dispatch({
      type: REGISTER,
      register: {
        mobileVerified: mobile_verified.toUpperCase() !== 'NO',
        emailVerified: email_verified.toUpperCase() !== 'NO',
        emailOTP: otp,
        mobileOTP: mobile_otp,
        mobileNumber: mobile,
        email: email,
      },
    });
  };
};

export const forgotPassword = ({email}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post(`partner/send-otp`, formData);

    if (response.data.result) {
      dispatch({
        type: 'FORGOT_PASSWORD',
        email: response.data.email,
        otp: response.data.otp,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyOtp = ({email, userOTP}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }
    if (!userOTP) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', userOTP);

    const response = await axios.post(`partner/verify-otp`, formData);

    if (response.data.result) {
      dispatch({
        type: 'VERIFY_OTP',
        token: response.data.token,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const set_new_password = ({token, password, password_confirmation}) => {
  return async dispatch => {
    if (password.length < 6) {
      throw new Error('Password must contain 6 letters');
    }
    if (!password || !password_confirmation) {
      throw new Error('Fields must be filled!');
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.');
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios.post(
      `partner/forgot-password-update`,
      formData,
    );

    if (response.data.result) {
      dispatch({
        type: 'SET_NEW_PASSWORD',
      });
      alert(response.data.msg);
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationEmailOtp = email => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post(`partner/send-otp-again`, formData);

    if (response.data.result) {
      const {otp, email, mobile, mobile_verified, email_verified} =
        response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          emailOTP: otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationMobileOtp = mobile => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);

    const response = await axios.post(
      `partner/send-mobile-otp-again`,
      formData,
    );

    if (response.data.result) {
      const {mobile_otp, email, mobile, mobile_verified, email_verified} =
        response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          mobileOTP: mobile_otp,
          mobileNumber: mobile,
          email: email,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyUserEmail = (email, otp) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);

    const response = await axios.post(
      `partner/verify-partner-registration`,
      formData,
    );

    if (response.data.result) {
      const {mobile_verified, email_verified, mobile, email} =
        response.data.data;
      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            mobileNumber: mobile,
            email: email,
          },
        });
      }
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyUserMobile = (mobile, otp) => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);

    const response = await axios.post(
      `partner/verify-mobile-user-registration`,
      formData,
    );

    if (response.data.result) {
      const {mobile_verified, email_verified, mobile, email} =
        response.data.data;
      if (mobile_verified === 'Yes' && email_verified === 'Yes') {
        const userId = response.data.data.user_id;
        dispatch(auth(userId));
        await AsyncStorage.setItem(SESSION_ID, userId.toString());
      } else {
        dispatch({
          type: REGISTER,
          register: {
            mobileVerified: mobile_verified.toUpperCase() !== 'NO',
            emailVerified: email_verified.toUpperCase() !== 'NO',
            mobileNumber: mobile,
            email: email,
          },
        });
      }
    } else {
      throw new Error(response.data.msg);
    }
  };
};
