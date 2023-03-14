import Dashboard from '@/pages/dashboard';

import TransactionList from '@/pages/transaction/list';
import TransactionDetail from '@/pages/transaction/detail';
import RefundList from '@/pages/refund/list';
import RefundDetail from '@/pages/refund/detail';
import PaymentLinkList from '@/pages/payment-link/list';

import MerchantStoreDetail from '@/pages/store/detail';
import MerchantStoreList from '@/pages/store/list';
import UserAllStore from '@/pages/store/user';

import ReconcileReport from '@/pages/reconcile/report';
import ReconcileRecord from '@/pages/reconcile/record';

import SupportRequestList from '@/pages/support-request/list';
import SupportRequestDetail from '@/pages/support-request/detail';
import SupportFAQ from '@/pages/support-request/SupportFAQ';

import DeveloperSite from '@/pages/developer-site';

// investment
import ConversionScheduleList from '@/pages/conversion-schedule/list';
import ConversionScheduleDetail from '@/pages/conversion-schedule/detail';
//Disbursement
import DisbursementLimit from '@/pages/disbursement/disbursement-limit';
import DisbursementTransactions from '@/pages/disbursement/disbursement-transactions';
import DisbursementTransactionDetail from '@/pages/disbursement/disbursement-transaction-detail';
import DisbursementRequest from '@/pages/disbursement/disbursement-request';
import DisbursementRequestDetail from '@/pages/disbursement/disbursement-request-detail';
import DisbursementReconcile from '@/pages/disbursement/disbursement-reconcile';

import * as COLLECTION_SERVICE_MANAGMENT from '@/pages/collection-service'
import TermCondition from "@/pages/term-condition";
import SupersetPage from '@/pages/superset';

const MERCHANT_DASHBOARD = {
  Dashboard
};

const PAYMENT_GATEWAY = {
  TransactionList,
  TransactionDetail,
  RefundList,
  RefundDetail,
  PaymentLinkList,
  ReconcileReport,
  ReconcileRecord
};

const MERCHANT_STORE = {
  MerchantStoreList,
  MerchantStoreDetail,
  UserAllStore
};

const MERCHANT_SUPPORT = {
  SupportRequestList,
  SupportRequestDetail,
  SupportFAQ,
  DeveloperSite,
  TermCondition
}

const GOLD_CERTIFICATE_MANAGEMENT = {
  ConversionScheduleList,
  ConversionScheduleDetail
}
const DISBURSEMENT_MANAGEMENT = {
  DisbursementLimit,
  DisbursementTransactions,
  DisbursementTransactionDetail,
  DisbursementReconcile,
  DisbursementRequest,
  DisbursementRequestDetail
}

const SUPERSET = {
  SupersetPage
};

export default {
  PAYMENT_GATEWAY,
  MERCHANT_DASHBOARD,
  MERCHANT_STORE,
  MERCHANT_SUPPORT,
  GOLD_CERTIFICATE_MANAGEMENT,
  DISBURSEMENT_MANAGEMENT,
  COLLECTION_SERVICE_MANAGMENT,
  SUPERSET
};
