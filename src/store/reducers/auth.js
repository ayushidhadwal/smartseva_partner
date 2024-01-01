import {
  LOGIN,
  LOGOUT,
  SET_COUNTRIES,
  SET_CITIES,
  FORGOT_PASSWORD,
  VERIFY_OTP,
  REGISTER,
  SET_STATES,
} from '../actions/auth';

const initialState = {
  user_id: null,
  countries: [],
  states: [],
  cities: [],
  email: '',
  otp: 0,
  token: '',
  register: {
    mobileVerified: false,
    emailVerified: false,
    emailOTP: null,
    mobileOTP: null,
    mobileNumber: '',
    email: '',
    userId: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      return {
        ...state,
        register: {
          ...state.register,
          ...action.register,
        },
      };
    }
    case LOGIN: {
      return {
        ...state,
        user_id: action.user_id,
      };
    }
    case FORGOT_PASSWORD: {
      return {
        ...state,
        email: action.email,
        otp: action.otp,
      };
    }
    case VERIFY_OTP: {
      return {
        ...state,
        token: action.token,
      };
    }
    case SET_COUNTRIES: {
      return {
        ...state,
        countries: action.countries,
      };
    }
    case SET_STATES: {
      return {
        ...state,
        states: action.states,
      };
    }
    case SET_CITIES: {
      return {
        ...state,
        cities: action.cities,
      };
    }
    case LOGOUT: {
      return {
        user_id: null,
        countries: [],
        cities: [],
        email: '',
        otp: 0,
        token: '',
        register: {
          mobileVerified: false,
          emailVerified: false,
          emailOTP: null,
          mobileOTP: null,
          mobileNumber: '',
          email: '',
          partnerId: '',
        },
      };
    }
    default:
      return state;
  }
};
