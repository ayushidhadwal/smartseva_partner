import {
  GET_BOOKING,
  GET_PENDING_REQUEST,
  GET_JOB_HISTORY,
  REQUEST_SERVICE_RESPONSE,
  GET_SELECTED_SERVICE,
  GET_SUBSERVICE_BY_SERVICE,
  GET_SERVICE_LIST,
  GET_TRADE,
  GET_TAX,
  GET_BANK_DETAILS,
  GET_SERVICES,
  GET_BOOKING_DETAILS,
  GET_DENY_REASON,
  GET_PENDING_DECLINE_REQUEST,
  GET_ACCEPTED_DECLINE_REQUEST,
  GET_REJECTED_DECLINE_REQUEST,
  GET_COMPLAINT_TYPES,
} from '../actions/request';

const initialState = {
  bookingList: [],
  pendingRequest: [],
  jobHistoryList: [],
  selectService: [],
  subServiceList: [],
  serviceList: [],
  services: [],
  trade: {
    trade_license_number: '',
    tradelicense: '',
    startdate: '',
    expiredate: '',
  },
  tax: {
    trn_name: '',
    trn_number: '',
  },
  bank: {
    bank_name: '',
    bank_account_number: '',
    account_type: '',
    iban: '',
    cancel_cheque: '',
  },
  getDetailsOfBooking: {
    booking_details: {
      id: null,
      booking_id: '',
      booking_date: '',
      booking_time: '',
      service_price: null,
      final_service_price: '',
      total_price: null,
      price_paid: null,
      wallet_pay: null,
      vat_amount: '',
      vat_percent: '',
      message: null,
      service_id: null,
      qty: null,
      user_id: null,
      vendor_id: null,
      status: '',
      payment_status: '',
      booking_status_check: '0',
      rejected_by: '',
      refund_status: '0',
      partner_pay_status: '0',
      transaction_id: null,
      job_completed_comment: null,
      confirm_status: '',
      confirm_reason: null,
      created_at: '',
      updated_at: '',
      reason: null,
      address_id: null,
      addr_username: '',
      addr_address: '',
      addr_country: '',
      addr_city: '',
      addr_state: '',
      addr_phonenumber: '',
      booking_comment: null,
      servgo_commission: '',
      commission_cut: 0,
    },
    serviceDetails: [],
    serviceConfirmation: [],
    // complaints: {
    //   cr_subject: "",
    //   cr_comment: "",
    //   feedback: "",
    // },
    complaints: {
      id: 0,
      cr_booking_id: '',
      cr_subject: '',
      cr_comment: '',
      cr_status: 0,
      created_at: '',
      feedback_id: 0,
      feedback: '',
    },
    providerReview: [],
    userReviews: [],
    setting: {
      application_name: '',
      address: '',
    },
    gst_percent: '',
    gst_amount: '',
    additional_price: '',
    totalAmount: '',
    completeDate: '',
  },
  deny_reasons: [],
  get_decline_booking_list: [],
  get_decline_accepted_booking_list: [],
  get_decline_rejected_booking_list: [],
  complaintList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOKING: {
      return {
        ...state,
        bookingList: [...action.bookingList],
      };
    }
    case GET_PENDING_REQUEST: {
      return {
        ...state,
        pendingRequest: [...action.pendingRequest],
      };
    }
    case GET_JOB_HISTORY: {
      return {
        ...state,
        jobHistoryList: [...action.jobHistoryList],
      };
    }
    case GET_SELECTED_SERVICE: {
      return {
        ...state,
        selectService: [...action.selectService],
      };
    }
    case GET_SUBSERVICE_BY_SERVICE: {
      return {
        ...state,
        subServiceList: [...action.subServiceList],
      };
    }
    case GET_SERVICE_LIST: {
      return {
        ...state,
        serviceList: [...action.serviceList],
      };
    }
    case GET_SERVICES: {
      return {
        ...state,
        services: [...action.services],
      };
    }
    case REQUEST_SERVICE_RESPONSE: {
      const list = [...state.pendingRequest];
      const index = list.findIndex(item => {
        return action.booking_id === item.booking_id;
      });

      if (index > -1) {
        list.splice(index, 1);
      }

      return {
        ...state,
        pendingRequest: list,
      };
    }
    case GET_TRADE: {
      const data = action.trade;
      return {
        ...state,
        trade: {
          ...state.trade,
          trade_license_number: data.trade_license_number,
          tradelicense: data.tradelicense,
          startdate: data.startdate,
          expiredate: data.expiredate,
        },
      };
    }
    case GET_TAX: {
      const data = action.tax;
      return {
        ...state,
        tax: {
          ...state.tax,
          trn_name: data.trn_name,
          trn_number: data.trn_number,
        },
      };
    }
    case GET_BANK_DETAILS: {
      const data = action.bank;
      return {
        ...state,
        bank: {
          ...state.bank,
          bank_name: data.bank_name,
          bank_account_number: data.bank_account_number
            ? data.bank_account_number.toString()
            : data.bank_account_number,
          account_type: data.account_type,
          iban: data.iban,
          cancel_cheque: data.cancel_cheque,
        },
      };
    }
    case GET_BOOKING_DETAILS: {
      return {
        ...state,
        getDetailsOfBooking: {
          booking_details: {
            ...action.getDetailsOfBooking.booking_details,
          },
          setting: {
            ...action.getDetailsOfBooking.setting,
          },
          serviceDetails: [...action.getDetailsOfBooking.serviceDetails],
          providerReview: [...action.getDetailsOfBooking.providerReview],
          serviceConfirmation: [
            ...action.getDetailsOfBooking.serviceConfirmation,
          ],
          complaints: {
            ...action.getDetailsOfBooking.complaints,
          },
          userReviews: [...action.getDetailsOfBooking.userReviews],
          gst_percent: action.getDetailsOfBooking.gst_percent,
          gst_amount: action.getDetailsOfBooking.gst_amount,
          additional_price: action.getDetailsOfBooking.additional_price,
          totalAmount: action.getDetailsOfBooking.totalAmount,
          completeDate: action.getDetailsOfBooking.completeDate,
        },
      };
    }
    case GET_DENY_REASON: {
      return {
        ...state,
        deny_reasons: [...action.deny_reason],
      };
    }
    case GET_PENDING_DECLINE_REQUEST: {
      return {
        ...state,
        get_decline_booking_list: [...action.pendingDeclineRequestList],
      };
    }

    case GET_ACCEPTED_DECLINE_REQUEST: {
      return {
        ...state,
        get_decline_accepted_booking_list: [
          ...action.acceptedDeclineRequestList,
        ],
      };
    }

    case GET_REJECTED_DECLINE_REQUEST: {
      return {
        ...state,
        get_decline_rejected_booking_list: [
          ...action.rejectedDeclineRequestList,
        ],
      };
    }

    case GET_COMPLAINT_TYPES: {
      return {
        ...state,
        complaintList: action.complaintList,
      };
    }

    default:
      return state;
  }
};
