import wifi from "./wifi.svg";
import card from "./card.svg";
import alias from "./alias.svg";
import calendar from "./calendar.svg";
import return_icon from "./return.svg";
import report from "./report.svg";
import file from "./file.svg";
import get_money from "./get-money.svg";
import wallet from "./wallet.svg";
import edit from "./edit.svg";
import transaction from "./transaction.svg";
import money from "./money.svg";
import user_setting from "./user-setting.svg";
import support from "./support.svg";
import headphone from "./headphone.svg";
import question from "./question.svg";
import book from "./book.svg";
import code from "./code.svg";

// header
import account from "./header/icon-header-ic-account.svg";
import setting from "./header/icon-header-ic-trang-thanh-to-n.svg";
import header_disbursement from "./header/icon-header-ic-chi-h.svg";
import header_collection from "./header/icon-header-ic-thu-h.svg";
import key from "./header/icon-header-ic-password.svg";
import logout from "./header/icon-header-ic-log-out.svg";
import notification from "./header/icon-header-ic-notification.svg";

import menu from "./menu.svg";
import right_arrow from "./right-arrow.svg";

const icons = {
    "dashboard": wifi,
    "MERCHANT_DASHBOARD": wifi,

    "PAYMENT_GATEWAY": card,
    "payment-link-list": alias,
    "transaction-list": calendar,
    "refund-list": return_icon,
    "merchant-reconciliation-report": report,
    "merchant-reconciliation-record": file,

    "DISBURSEMENT_MANAGEMENT": get_money,
    "DISBURSEMENT_LIMIT": wallet,
    "DIBURSEMENT_REQUEST": edit,
    "DIBURSEMENT_TRANSACTIONS": transaction,
    "DISBURSEMENT_RECONCILE": report,

    "COLLECTION_SERVICE_MANAGMENT": money,
    "COLLECTION_SERVICES_ACCOUNT_INFO": wallet,
    "COLLECTION_SERVICE_ACCOUNT_LIST": user_setting,
    "COLLECTION_SERVICES_TRANSACTION": transaction,
    "COLLECTION_SERVICES_RECONCILE": report,

    "MERCHANT_SUPPORT": support,
    "support-list": headphone,
    "support-faq": question,
    "developer-site": code,
    "SUPPORT_TERM_CONDITION": book,

    "header_account": account,
    "header_wallet": wallet,
    "header_pg_setting": setting,
    "header_disbursement": header_disbursement,
    "header_collection": header_collection,
    "header_change_password": key,
    "header_logout": logout,
    "header_notification": notification,

    "menu": menu,
    "menu_right_arrow": right_arrow,
}

export default function NeoIcon(props: ObjectType) {
    const iconStyle: React.CSSProperties = {
        width: 16,
        height: 16,
        background: '#C0C0C9',
        ...(props.style || {}),
        mask: `url(${icons[props.id]})`,
        WebkitMask: `url(${icons[props.id]})`,
    }
    return props.id ? <div className="neo-svg-icon" style={iconStyle} /> : <></>;
}
