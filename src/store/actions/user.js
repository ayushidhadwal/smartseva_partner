import axios from 'axios';
import dayjs from 'dayjs';

export const SET_PROFILE = 'SET_PROFILE';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE';
export const SET_TRANSACTION = 'SET_TRANSACTION';
export const GET_GALLERY = 'GET_GALLERY';
export const DELETE_IMAGE = 'DELETE_IMAGE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const GET_COMPLAINTS = 'GET_COMPLAINTS';
export const POST_FEEDBACK = 'POST_FEEDBACK';
export const GET_CALENDER = 'GET_CALENDER';
export const UPDATE_CALENDER = 'UPDATE_CALENDER';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const GET_WITHDRAWAL_LIST = 'GET_WITHDRAWAL_LIST';
export const SEND_REQUEST = 'SEND_REQUEST';
export const MY_REVIEWS = 'MY_REVIEWS';
export const MY_PLANS = 'MY_PLANS';
export const GENERATE_ORDER = 'GENERATE_ORDER';
export const GET_ADDRESS_NAME = 'GET_ADDRESS_NAME';

export const set_Profile = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get('partner/get-profile/' + user_id);

    if (response.data.result) {
      dispatch({type: SET_PROFILE, partner: response.data.data});
    } else {
      throw new Error('set profile', response.data.msg);
    }
  };
};

export const updatePassword = (
  user_id,
  old_password,
  password,
  password_confirmation,
) => {
  return async dispatch => {
    if (!old_password) {
      throw new Error('Old Password is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (!password_confirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password.length < 5) {
      throw new Error(
        'New Password field must be atleast 6 charaters in length.',
      );
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.!');
    }
    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('old_password', old_password);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios.post(`partner/update-password`, formData);

    if (response.data.result) {
      dispatch({type: 'UPDATE_PASSWORD'});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateProfile = (
  firstName,
  lastName,
  address,
  stateCode,
  cityCode,
  companyName,
  overview,
  radius,
  lat,
  long,
) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('first_name', firstName);
    form.append('last_name', lastName);
    form.append('address', address);
    form.append('country', 101);
    form.append('state', stateCode);
    form.append('city', cityCode);
    form.append('company_name', companyName);
    form.append('overview', overview);
    form.append('radius', radius);
    form.append('lat', lat);
    form.append('long', long);

    const response = await axios.post('partner/partner-profile-update', form);

    if (response.data.status) {
      dispatch({type: UPDATE_PROFILE});
    } else {
      throw new Error('Update Profile', response.data.msg);
    }
  };
};

export const updatePicture = image => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('image', image);

    const response = await axios.post('partner/update-profile-image', form);

    if (response.data.result) {
      dispatch({type: UPDATE_PROFILE_PICTURE});
      alert(response.data.msg);
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const set_Transactions = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const response = await axios.get(
      `partner/get-partner-wallet-transaction/` + user_id,
    );

    if (response.data.result) {
      dispatch({type: SET_TRANSACTION, transaction: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export function getGallery() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);

    const response = await axios.post(`partner/fetch-gallery`, form);

    if (response.data.status) {
      dispatch({type: GET_GALLERY, getGallery: response.data.data.images});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function deleteImage(imageId) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('image_id', imageId);

    const response = await axios.post(`partner/delete-gallery-image`, form);

    if (response.data.status) {
      dispatch({type: DELETE_IMAGE});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function addImages(img) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    img.forEach((i, c) => {
      form.append(`images[${c}]`, {
        name: 'image.jpg',
        uri: i.uri,
        type: 'image/jpeg',
      });
    });

    const response = await axios.post(`partner/add-gallery`, form);

    if (response.data.status) {
      dispatch({type: ADD_IMAGE});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export const getComplaints = () => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);

    const response = await axios.post(`partner/get-complaints`, form);

    if (response.data.status) {
      dispatch({type: GET_COMPLAINTS, complaints: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export function postFeedback(bookingId, complaintId, comment) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('booking_id', bookingId);
    form.append('complaint_id', complaintId);
    form.append('feedback', comment);

    const response = await axios.post('partner/post-feedback', form);

    if (response.data.status) {
      dispatch({type: POST_FEEDBACK});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function getCalender() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get(
      'partner/get-calendar-list' + '/' + user_id,
    );

    if (response.data.status) {
      dispatch({type: GET_CALENDER, calender: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function updateCalender() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;
    const {calender} = getState().user;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('sunday', calender.sunday);
    form.append('sunday_start', calender.sunday_start);
    form.append('sunday_end', calender.sunday_end);
    form.append('sunday_start_two', calender.sunday_start_two);
    form.append('sunday_end_two', calender.sunday_end_two);
    form.append('monday', calender.monday);
    form.append('monday_start', calender.monday_start);
    form.append('monday_end', calender.monday_end);
    form.append('monday_start_two', calender.monday_start_two);
    form.append('monday_end_two', calender.monday_end_two);
    form.append('tuesday', calender.tuesday);
    form.append('tuesday_start', calender.tuesday_start);
    form.append('tuesday_end', calender.tuesday_end);
    form.append('tuesday_start_two', calender.tuesday_start_two);
    form.append('tuesday_end_two', calender.tuesday_end_two);
    form.append('wednesday', calender.wednesday);
    form.append('wednesday_start', calender.wednesday_start);
    form.append('wednesday_end', calender.wednesday_end);
    form.append('wednesday_start_two', calender.wednesday_start_two);
    form.append('wednesday_end_two', calender.wednesday_end_two);
    form.append('thursday', calender.thursday);
    form.append('thursday_start', calender.thursday_start);
    form.append('thursday_end', calender.thursday_end);
    form.append('thursday_start_two', calender.thursday_start_two);
    form.append('thursday_end_two', calender.thursday_end_two);
    form.append('friday', calender.friday);
    form.append('friday_start', calender.friday_start);
    form.append('friday_end', calender.friday_end);
    form.append('friday_start_two', calender.friday_start_two);
    form.append('friday_end_two', calender.friday_end_two);
    form.append('saturday', calender.saturday);
    form.append('saturday_start', calender.saturday_start);
    form.append('saturday_end', calender.saturday_end);
    form.append('saturday_start_two', calender.saturday_start_two);
    form.append('saturday_end_two', calender.saturday_end_two);

    const response = await axios.post(`partner/calendar-list`, form);

    if (response.data.status) {
      dispatch({type: UPDATE_CALENDER});
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export const sendMessage = (bookingId, text) => {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('booking_id', bookingId);
    form.append('message', text);

    const response = await axios.post(`partner/send-message`, form);

    if (response.data.status) {
      dispatch({
        type: SEND_MESSAGE,
        input: text,
        bookingId: bookingId,
        senderId: user_id,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export function getMessage(bookingId, customerId) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('booking_id', bookingId);
    form.append('user_id', customerId);

    const response = await axios.post(`partner/get-messages`, form);

    if (response.data.status) {
      dispatch({type: GET_MESSAGE, getChats: response.data.data});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function getWithdrawalRequest() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const response = await axios.get(
      'partner/get-withdrawal-request' + '/' + user_id,
    );

    if (response.data.result) {
      dispatch({
        type: GET_WITHDRAWAL_LIST,
        getWithdrawalList: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function sendRequest(amt) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('withdrawal_amount', amt);

    const response = await axios.post(`partner/withdrawal-request`, form);

    if (response.data?.status) {
      dispatch({
        type: SEND_REQUEST,
        request: {
          userId: user_id,
          amount: amt,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function setMyReview() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);

    const response = await axios.post(`partner/get-customer-reviews`, form);

    if (response.data.status) {
      dispatch({
        type: MY_REVIEWS,
        myReviews: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function getmyPlans() {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);

    const response = await axios.post(`partner/get-subscription-plan`, form);

    if (response.data.status) {
      dispatch({
        type: MY_PLANS,
        myPlans: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function payForPlan(planId, amount, cardNumber, month, year, cvv) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('plan_id', planId);
    form.append('amount', amount);
    form.append('card_no', cardNumber);
    form.append('ccExpiryMonth', month);
    form.append('ccExpiryYear', year);
    form.append('cvvNumber', cvv);

    const response = await axios.post(
      `partner/pay-for-subscription-plan`,
      form,
    );

    if (!response.data.status) {
      throw new Error(response.data.msg);
    }
  };
}

export function getFreePlan(planId) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('plan_id', planId);

    const response = await axios.post(`partner/subscribe-free-plan`, form);

    if (!response.data.status) {
      throw new Error(response.data.msg);
    }
  };
}

export function Recharge(amt) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('amount', amt);

    const response = await axios.post(`partner/wallet-order-generate`, form);

    if (response.data.status) {
      dispatch({
        type: GENERATE_ORDER,
        OrderId: response.data.data.id,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function onlineRecharge(amt, order, paymentId, sign) {
  return async (dispatch, getState) => {
    const {user_id} = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('amount', amt);
    form.append('razorpay_order_id', order);
    form.append('razorpay_payment_id', paymentId);
    form.append('razorpay_signature', sign);

    const response = await axios.post(
      `partner/verify-signature-for-wallet-recharge`,
      form,
    );

    if (!response.data.status) {
      throw new Error(response.data.msg);
    }
  };
}
