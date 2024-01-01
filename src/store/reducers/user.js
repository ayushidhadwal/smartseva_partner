import {
  SET_PROFILE,
  SET_TRANSACTION,
  GET_GALLERY,
  GET_COMPLAINTS,
  GET_CALENDER,
  GET_MESSAGE,
  SEND_MESSAGE,
  GET_WITHDRAWAL_LIST,
  SEND_REQUEST,
  MY_REVIEWS,
  MY_PLANS,
  GENERATE_ORDER,
} from '../actions/user';

import {UPDATE_CALENDER_FIELD} from '../../components/DaySection';
import dayjs from 'dayjs';

const initialState = {
  partner: {
    name: '',
    email: '',
    phone_code: '',
    mobile: '',
    password: '',
    profession: '',
    company_name: '',
    photo: '',
    address: '',
    location: '',
    experience_text: '',
    business_name: '',
    facebook_link: '',
    twitter_link: '',
    instagram_link: '',
    referral_code: null,
    firstname: '',
    lastname: '',
    country_name: null,
    city_name: null,
    partner_wallet: '',
    country: '',
    city: '',
    trnNumber: '',
    state: '',
    state_name: null,
    latitude: '',
    longitude: '',
    vendor_radius: '',
  },
  transaction: [],
  getGallery: [],
  complaints: [],
  calender: {
    created_at: '',
    friday: '',
    friday_end: '',
    friday_end_two: '',
    friday_start: '',
    friday_start_two: '',
    id: null,
    monday: '',
    monday_end: '',
    monday_end_two: '',
    monday_start: '',
    monday_start_two: '',
    partner_id: null,
    saturday: '',
    saturday_end: '',
    saturday_end_two: '',
    saturday_start: '',
    saturday_start_two: '',
    sunday: '',
    sunday_end: '',
    sunday_end_two: '',
    sunday_start: '',
    sunday_start_two: '',
    thursday: '',
    thursday_end: '',
    thursday_end_two: '',
    thursday_start: '',
    thursday_start_two: '',
    tuesday: '',
    tuesday_end: '',
    tuesday_end_two: '',
    tuesday_start: '',
    tuesday_start_two: '',
    updated_at: '',
    wednesday: '',
    wednesday_end: '',
    wednesday_end_two: '',
    wednesday_start: '',
    wednesday_start_two: '',
  },
  getChats: [],
  getWithdrawalList: [],
  myReviews: [],
  myPlans: [],
  OrderId: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE: {
      const data = action.partner;

      return {
        ...state,
        partner: {
          ...state.partner,
          name: data.name,
          email: data.email,
          photo: data.photo,
          company_name: data.company_name,
          address: data.address,
          business_name: data.business_name,
          experience_text: data.experience_text,
          profession: data.profession,
          partner_wallet: data.partner_wallet,
          firstname: data.firstname,
          lastname: data.lastname,
          country_name: data.country_name,
          city_name: data.city_name,
          city: data.city,
          country: data.country,
          mobile: data.mobile,
          phone_code: data.phone_code,
          trnNumber: data.trade_license_number,
          state: data.state,
          state_name: data.state_name,
          latitude: data.latitude,
          longitude: data.longitude,
          vendor_radius: data.vendor_radius,
        },
      };
    }
    case SET_TRANSACTION: {
      return {
        ...state,
        transaction: [...action.transaction],
      };
    }
    case GET_GALLERY: {
      return {
        ...state,
        getGallery: [...action.getGallery],
      };
    }
    case GET_COMPLAINTS: {
      return {
        ...state,
        complaints: [...action.complaints],
      };
    }
    case GET_CALENDER: {
      return {
        ...state,
        calender: {
          ...action.calender,
        },
      };
    }
    case UPDATE_CALENDER_FIELD: {
      const cal = {...state.calender};

      if (action.input.subField) {
        cal[`${action.input.field}_${action.input.subField}`] =
          action.input.value;
      } else {
        cal[`${action.input.field}`] = action.input.value;
      }

      return {
        ...state,
        calender: cal,
      };
    }
    case GET_MESSAGE: {
      return {
        ...state,
        getChats: [...action.getChats],
      };
    }
    case SEND_MESSAGE: {
      const x = [...state.getChats];
      return {
        ...state,
        // getChats: x,
      };
    }
    case GET_WITHDRAWAL_LIST: {
      return {
        ...state,
        getWithdrawalList: [...action.getWithdrawalList],
      };
    }
    case SEND_REQUEST:
      return {
        ...state,
        getWithdrawalList: [
          {
            id: Math.random(),
            wr_user_id: action.request.userId,
            wr_amount: action.request.amount,
            wr_status: 'PENDING',
            wr_payment_status: '0',
            created_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          },
          ...state.getWithdrawalList,
        ],
      };
    case MY_REVIEWS: {
      return {
        ...state,
        myReviews: [...action.myReviews],
      };
    }
    case MY_PLANS: {
      return {
        ...state,
        myPlans: [...action.myPlans],
      };
    }
    case GENERATE_ORDER: {
      return {
        ...state,
        OrderId: action.OrderId,
      };
    }
    default:
      return state;
  }
};
