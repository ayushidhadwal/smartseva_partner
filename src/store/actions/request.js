import axios from 'axios';
import dayjs from 'dayjs';
export const GET_BOOKING = 'GET_BOOKING';
export const GET_PENDING_REQUEST = 'GET_PENDING_REQUEST';
export const REQUEST_SERVICE_RESPONSE = 'REQUEST_SERVICE_RESPONSE';
export const JOB_COMPLETED = 'JOB_COMPLETED';
export const GET_JOB_HISTORY = 'GET_JOB_HISTORY';
export const GET_SELECTED_SERVICE = 'GET_SELECTED_SERVICE';
export const GET_SUBSERVICE_BY_SERVICE = 'GET_SUBSERVICE_BY_SERVICE';
export const ADD_SERVICE_PRICE = 'ADD_SERVICE_PRICE';
export const GET_SERVICE_LIST = 'GET_SERVICE_LIST';
export const UPDATE_SERVICE_PRICE = 'UPDATE_SERVICE_PRICE';
export const HELP = 'HELP';
export const GET_TRADE = 'GET_TRADE';
export const UPDATE_TRADE = 'UPDATE_TRADE';
export const UPDATE_TXN = 'UPDATE_TXN';
export const GET_TAX = 'GET_TAX';
export const GET_BANK_DETAILS = 'GET_BANK_DETAILS';
export const UPDATE_BANK = 'UPDATE_BANK';
export const GET_SERVICES = 'GET_SERVICES';
export const SELECT_SERVICE = 'SELECT_SERVICE';
export const GET_BOOKING_DETAILS = 'GET_BOOKING_DETAILS';
export const GET_DENY_REASON = 'GET_DENY_REASON';
export const DENY_REQUEST = 'DENY_REQUEST';
export const GET_PENDING_DECLINE_REQUEST = 'GET_PENDING_DECLINE_REQUEST';
export const GET_ACCEPTED_DECLINE_REQUEST = 'GET_ACCEPTED_DECLINE_REQUEST';
export const GET_REJECTED_DECLINE_REQUEST = 'GET_REJECTED_DECLINE_REQUEST';
export const GET_COMPLAINT_TYPES = 'GET_COMPLAINT_TYPES';

export const get_booking_list = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('limit', '1000');

    const response = await axios.post('partner/get-booking-list', formData);

    console.log(response.data);

    dispatch({ type: GET_BOOKING, bookingList: response.data.data });
  };
};

export const getPendingRequests = () => {

  return async (dispatch, getState) => {
    const { user_id } = getState().auth;


    const response = await axios.get(`partner/get-new-leads/${user_id}`);

    dispatch({
      type: GET_PENDING_REQUEST,
      pendingRequest: response.data.data,
    });
  };
};

export const request_service_response = (booking_id, response) => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;


    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('booking_id', booking_id);
    formData.append('response', response);

    console.log(formData);

    const resData = await axios.post(
      'partner/booking-response-submit',
      formData,
    );

    if (resData.data.status) {
      dispatch({ type: REQUEST_SERVICE_RESPONSE, booking_id: booking_id });
    } else {
      throw new Error(resData.data.msg);
    }
  };
};

export const job_completed = (booking_id, image, date, comment, amount) => {
  return async (dispatch, getState) => {
    if (!date) {
      throw new Error('Please clickOn JOB COMPLETED button!');
    }
    if (image.length === 0) {
      throw new Error('Attachment is required!');
    }
    if (!comment) {
      throw new Error('Comment is required!');
    }

    const { user_id } = getState().auth;
    const formData = new FormData();
    formData.append('booking_id', booking_id);
    image.forEach((i, c) => {
      formData.append(`image[${c}]`, {
        name: i.fileName,
        uri: i.uri,
        type: i.type,
      });
    });

    formData.append('date', dayjs(date).format('YYYY-MM-DD'));
    formData.append('time', dayjs(date).format('HH:mm'));
    formData.append('partner_id', user_id);
    formData.append('comment', comment);
    formData.append('amount', amount);

    const response = await axios.post('partner/job-completed', formData);
    if (response.data.result) {
      dispatch({ type: JOB_COMPLETED });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_job_history = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('limit', '1000');

    const response = await axios.post('partner/get-job-history', formData);

    if (response.data.status) {
      dispatch({ type: GET_JOB_HISTORY, jobHistoryList: response.data.data });
    }
  };
};

export const get_selected_service = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const response = await axios.get('partner/get-selected-service/' + user_id);

    if (response.data.status) {
      dispatch({
        type: GET_SELECTED_SERVICE,
        selectService: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_subservice_by_service = serviceId => {
  return async dispatch => {
    const response = await axios.get(
      `partner/get-subservice-by-service/` + serviceId,
    );

    dispatch({
      type: GET_SUBSERVICE_BY_SERVICE,
      subServiceList: response.data.data,
    });
  };
};

export const add_service_pricing = (
  serviceId,
  service_price,
  service_desc,
  subServiceId,
) => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    if (!serviceId) {
      throw new Error('Please Select Service !!!');
    }
    if (!subServiceId) {
      throw new Error('Please Select Sub-Service !!!');
    }
    if (!service_price) {
      throw new Error('Please Select Service Price !!!');
    }
    if (!service_desc) {
      throw new Error('Please Add Service Description !!!');
    }

    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('services_id', serviceId);
    formData.append('service_price', service_price);
    formData.append('service_desc', service_desc);
    formData.append('sub_service_id', subServiceId);

    const response = await axios.post('partner/add-service-pricing', formData);

    if (response.data.status) {
      dispatch({ type: ADD_SERVICE_PRICE });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getServiceList = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const formData = new FormData();
    formData.append('partner_id', user_id);
    formData.append('limit', '10000');

    const response = await axios.post('partner/get-services', formData);

    if (response.data.status) {
      dispatch({ type: GET_SERVICE_LIST, serviceList: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateServiceStatus = id => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('id', id);

    const response = await axios.post(
      'partner/update-service-status',
      formData,
    );

    if (response.data.status) {
      dispatch({ type: 'UPDATE_SERVICE_STATUS' });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateServicePrice = (id, price, desc) => {
  return async (dispatch, getState) => {
    if (!price) {
      throw new Error('Please add updated Price');
    }
    if (!desc) {
      throw new Error('Please add Description');
    }
    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('service_price', price);
    form.append('service_desc', desc);
    form.append('id', id);

    const response = await axios.post(`partner/update-service-price`, form);

    if (response.data.status) {
      dispatch({ type: UPDATE_SERVICE_PRICE });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const help = (complaint, comment, image) => {
  return async (dispatch, getState) => {
    if (!comment) {
      throw new Error('Description is required!');
    }

    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('description', comment);
    form.append('type', complaint);
    form.append('user_type', 'PARTNER');
    if (image.uri) {
      form.append('file', image);
    }

    const response = await axios.post('user/urgent-services', form);
    if (response.data.status) {
      dispatch({ type: HELP });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getTrade = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;
    const response = await axios.get(
      'partner/get-trade-license-details/' + user_id,
    );
    if (response.data.status) {
      dispatch({ type: GET_TRADE, trade: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateTrade = (number, startdate, expiredate, image) => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('trade_license_number', number);
    form.append('issue_date', dayjs(startdate).format('YYYY-MM-DD'));
    form.append('last_date', dayjs(expiredate).format('YYYY-MM-DD'));
    if (image) {
      form.append('trade_license_file', image);
    }
    const response = await axios.post(`partner/update-trade-license`, form);

    if (response.data.status) {
      dispatch({ type: UPDATE_TRADE });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateTax = (name, number) => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('name', name);
    form.append('trn_number', number);

    const response = await axios.post(
      `partner/update-tax-registration-number`,
      form,
    );
    if (response.data.status) {
      dispatch({ type: UPDATE_TXN });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getTax = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;
    const response = await axios.get(
      `partner/get-tax-registration-number/` + user_id,
    );
    if (response.data.status) {
      dispatch({ type: GET_TAX, tax: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getBankDetails = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;
    const response = await axios.get(`partner/get-bank-details/` + user_id);
    if (response.data.status) {
      dispatch({ type: GET_BANK_DETAILS, bank: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateBankDetails = (
  bankName,
  account,
  confirmAccount,
  accountType,
  iBan,
  image,
) => {
  return async (dispatch, getState) => {
    if (!image.uri) {
      throw new Error(' Photo of Cancel Cheque is required !!!');
    }
    if (account !== confirmAccount) {
      throw new Error(
        'Account Number and Confirm Account Number Should be Same',
      );
    }
    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('bank_name', bankName);
    form.append('bank_account_number', account);
    form.append('account', accountType);
    form.append('confirm_bank_account_number', confirmAccount);
    form.append('iban', iBan);
    if (image.uri) {
      form.append('cancel_cheque', {
        name: image.name,
        uri: image.uri,
        type: image.type,
      });
    }
    const response = await axios.post(`partner/update-bank-detail`, form);

    if (response.data.status) {
      dispatch({ type: UPDATE_BANK });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getServices = () => {
  return async dispatch => {
    const response = await axios.get(`main/get-services`);

    if (response.data.result) {
      dispatch({ type: GET_SERVICES, services: response.data.data });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const selectServices = number => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    if (number.length === 0) {
      throw new Error('Please Select Service First!');
    }

    const num = JSON.stringify(number);

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('selectedService', num);

    const response = await axios.post(`partner/update-selected-service`, form);

    if (response.data.status) {
      dispatch({ type: SELECT_SERVICE });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export function getBookingDetails(booking_id) {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;
    console.log(user_id);

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('booking_id', booking_id);

    const response = await axios.post('partner/get-booking-details', form);
    // console.log('sdfghj',response.data);

    if (response.data.status) {
      dispatch({
        type: GET_BOOKING_DETAILS,
        getDetailsOfBooking: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export const get_decline_Request_Reason = () => {
  return async dispatch => {
    const response = await axios.get(`get-deny-reason`);
    if (response.data.result) {
      dispatch({ type: GET_DENY_REASON, deny_reason: response.data.data });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export function decline_Request(selectedReason, booking_id) {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('partner_id', user_id);
    form.append('booking_id', booking_id);
    form.append('deny_reason', selectedReason);

    console.log(form);

    const response = await axios.post('partner/deny-reason', form);

    if (response.data.status) {
      dispatch({
        type: DENY_REQUEST,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export const get_pending_decline_list = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const response = await axios.get(
      `partner/get-pending-declined-bookings/${user_id}`,
    );
    dispatch({
      type: GET_PENDING_DECLINE_REQUEST,
      pendingDeclineRequestList: response.data.data.request,
    });
  };
};

export const get_accepted_decline_list = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const response = await axios.get(
      `partner/get-accept-declined-bookings/${user_id}`,
    );

    dispatch({
      type: GET_ACCEPTED_DECLINE_REQUEST,
      acceptedDeclineRequestList: response.data.data.request,
    });
  };
};

export const get_rejected_decline_list = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().auth;

    const response = await axios.get(
      `partner/get-rejected-declined-bookings/${user_id}`,
    );

    dispatch({
      type: GET_REJECTED_DECLINE_REQUEST,
      rejectedDeclineRequestList: response.data.data.request,
    });
  };
};

export const getComplaintTypes = () => {
  return async (dispatch, getState) => {
    const response = await axios.get('get-complaint-types');

    dispatch({
      type: GET_COMPLAINT_TYPES,
      complaintList: response.data.data,
    });
  };
};
