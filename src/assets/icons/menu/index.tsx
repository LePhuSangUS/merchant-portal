import React from "react";
import dashboard_gray from "./dashboard_gray.png";
import dashboard_purple from "./dashboard_purple.png";
import card_gray from "./card_gray.png";
import card_purple from "./card_purple.png";
import alias_gray from "./alias_gray.png";
import alias_purple from "./alias_purple.png";
import calendar_gray from "./calendar_gray.png";
import calendar_purple from "./calendar_purple.png";
import return_gray from "./return_gray.png";
import return_purple from "./return_purple.png";
import report_gray from "./report_gray.png";
import report_purple from "./report_purple.png";
import record_gray from "./record_gray.png";
import record_purple from "./record_purple.png";
import disbursement_gray from "./disbursement_gray.png";
import disbursement_purple from "./disbursement_purple.png";
import wallet_gray from "./wallet_gray.png";
import wallet_purple from "./wallet_purple.png";
import edit_gray from "./edit_gray.png";
import edit_purple from "./edit_purple.png";
import transaction_gray from "./transaction_gray.png";
import transaction_purple from "./transaction_purple.png";
import collection_gray from "./collection_gray.png";
import collection_purple from "./collection_purple.png";
import user_setting_gray from "./user_setting_gray.png";
import user_setting_purple from "./user_setting_purple.png";
import support_gray from "./support_gray.png";
import support_purple from "./support_purple.png";
import headphone_gray from "./headphone_gray.png";
import headphone_purple from "./headphone_purple.png";
import faqs_gray from "./faqs_gray.png";
import faqs_purple from "./faqs_purple.png";
import term_gray from "./term_gray.png";
import term_purple from "./term_purple.png";
import develop_gray from "./develop_gray.png";
import develop_purple from "./develop_purple.png";
import collapse_right from "./collapse_right.png";
import collapse_down from "./collapse_down.png";

const icons = {
    "dashboard": {
        gray: dashboard_gray,
        purple: dashboard_purple
    },
    "MERCHANT_DASHBOARD": {
        gray: dashboard_gray,
        purple: dashboard_purple
    },
    "PAYMENT_GATEWAY": {
        gray: card_gray,
        purple: card_purple,
    },
    "payment-link-list": {
        gray: alias_gray,
        purple: alias_purple,
    },
    "transaction-list": {
        gray: calendar_gray,
        purple: calendar_purple,
    },
    "refund-list": {
        gray: return_gray,
        purple: return_purple,
    },
    "merchant-reconciliation-report": {
        gray: report_gray,
        purple: report_purple,
    },
    "merchant-reconciliation-record": {
        gray: record_gray,
        purple: record_purple,
    },

    "DISBURSEMENT_MANAGEMENT": {
        gray: disbursement_gray,
        purple: disbursement_purple,
    },
    "DISBURSEMENT_LIMIT": {
        gray: wallet_gray,
        purple: wallet_purple,
    },
    "DIBURSEMENT_REQUEST": {
        gray: edit_gray,
        purple: edit_purple,
    },
    "DIBURSEMENT_TRANSACTIONS": {
        gray: transaction_gray,
        purple: transaction_purple,
    },
    "DISBURSEMENT_RECONCILE": {
        gray: report_gray,
        purple: report_purple,
    },

    "COLLECTION_SERVICE_MANAGMENT": {
        gray: collection_gray,
        purple: collection_purple,
    },
    "COLLECTION_SERVICES_ACCOUNT_INFO": {
        gray: wallet_gray,
        purple: wallet_purple,
    },
    "COLLECTION_SERVICE_ACCOUNT_LIST": {
        gray: user_setting_gray,
        purple: user_setting_purple,
    },
    "COLLECTION_SERVICES_TRANSACTION": {
        gray: transaction_gray,
        purple: transaction_purple,
    },
    "COLLECTION_SERVICES_RECONCILE": {
        gray: report_gray,
        purple: report_purple,
    },

    "MERCHANT_SUPPORT": {
        gray: support_gray,
        purple: support_purple,
    },
    "support-list": {
        gray: headphone_gray,
        purple: headphone_purple,
    },
    "support-faq": {
        gray: faqs_gray,
        purple: faqs_purple,
    },
    "developer-site": {
        gray: develop_gray,
        purple: develop_purple,
    },
    "SUPPORT_TERM_CONDITION": {
        gray: term_gray,
        purple: term_purple,
    },

    "collapse": {
        right: collapse_right,
        down: collapse_down,
    },

    "report": {
        gray: report_gray,
        purple: report_purple,
    },
}

export default function NeoMenuIcon(props: ObjectType) {
    const iconStyle: React.CSSProperties = {
        width: 16,
        height: 16,
        ...(props?.style || {})
    }
    const imgUrl = icons[props.id]?.[props.type] || icons[props?.icon]?.[props.type];
    return props.id ? <img className={`neo-menu-icon-${props.type}`} src={imgUrl} style={iconStyle} /> : <></>;
}
