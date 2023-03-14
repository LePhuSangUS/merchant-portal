
import { Card, Button,Status } from "@/new_components";
import { Avatar, Skeleton } from "antd"
import styles from "./AccountInformation.less";
import { parseImgUrl, parseOptions } from '@/utils/parse';
import { translate, parseAddress } from "@/utils";
import {MODAL_TYPE} from "@/constants"
import { connect } from 'dva';
import { AUTHORIZATION_MANAGEMENT_USER_ROLES } from "@/constants";
import { formatPhoneNumber } from '@/utils/format';
import {icStoreDefault} from "@/assets/icons";

import InformationItem from "./InformationItem";
import _ from "lodash";
import { IInformationItem } from "../types";
import { Fragment } from "react";
import {
  icMerchantPhone,
  icAccount,
  icEmail,
  icMerchantJob,
  icMerchantID
} from "@/assets/icons/my-profile"
import ModalEditInformation from "./ModalEditInformation";
interface IProps {
  currentMerchant: any;
  loading: any;
  myProfile:any,
  dispatch: any,
  global:any
}


//Component
const AccountInformation = (props: IProps) => {
  const {
    currentMerchant = {},
    dispatch,
    myProfile = {}, 
    global={},
    loading
  } = props;
  const { modalVisible } = myProfile;
  const { businessLineData} = global;
  const { visibleAvatar, merchantCode,identityName, merchantPhone, businessLine, address, userInfo={},name } = currentMerchant;
  const { email,fullName,roleCode,roleName } = userInfo;
  
  const isAuthorizationManagement = AUTHORIZATION_MANAGEMENT_USER_ROLES?.[roleCode];
  const isBusinessOwner = AUTHORIZATION_MANAGEMENT_USER_ROLES?.BUSINESS_OWNER === roleCode

  const dataRender: IInformationItem[] = [
    {
      id: "1",
      title: translate("Merchant Information"),
      dataList: [
        {
          id: "1.1",
          icon: icMerchantID,
          label: translate("Merchant code"),
          content: merchantCode,
        },
        {
          id: "1.2",
          icon:icMerchantPhone,
          label: translate("Merchant phone number"),
          content: formatPhoneNumber(merchantPhone),
        },
        {
          id: "1.3",
          icon: icMerchantJob,
          label: translate("Business line"),
          content: <Status type="text" value={businessLine} options={parseOptions(businessLineData,"code","name")}  />,
        },
        {
          id: "1.4",
          icon: icMerchantID,
          label: translate("Address"),
          content: parseAddress(address),
        },
      ]
    },
    {
      id: "2",
      title: translate("Personal information"),
      dataList: [
        {
          id: "2.1",
          icon: icEmail,
          label: translate("Email"),
          content: email,
        },
        {
          id: "2.2",
          icon: icAccount,
          label: translate("Full name"),
          content: isBusinessOwner?identityName:fullName,
        },

      ]
    }
  ]



  const handleOpenModal = (modalType=MODAL_TYPE.CREATE,currentItem=null) => {
    dispatch({
      type: 'myProfile/showModal',
      payload: {
          currentItem,
          modalType
      }
    })    }
  const renderMerchantInformationOverview = () => {
    return <div className={styles.merchantInformationOverview}>
      <div className={styles.avatar}>
        <Avatar size={100} src={parseImgUrl(visibleAvatar,icStoreDefault)} />
      </div>
      <h1 className={styles.name}>{name}</h1>
      <h4 className={styles.position}>{roleName}</h4>
      {isAuthorizationManagement&&<Button style={{marginBottom:"24px"}} onClick={()=>handleOpenModal(MODAL_TYPE.EDIT,currentMerchant)} size="large" type="default">{translate("Edit")}</Button>}
    </div>
  }
  const renderMerchantInformationDetail = () => {
    return <div className={styles.merchantInformationDetail}>
      {dataRender?.map((item: IInformationItem) => {
        return <InformationItem key={item?.id} {...item} />
      })}
    </div>
  }


  const renderComponent=() => {
    if (loading?.effects?.["user/fetchCurrentMerchant"]) return <>
      <Skeleton className={styles.skeleton} />
      <Skeleton className={styles.skeleton} />
      <Skeleton className={styles.skeleton} />
      <Skeleton className={styles.skeleton} />
      <Skeleton className={styles.skeleton} />
      <Skeleton className={styles.skeleton} />
      
    </>;
    // if (_.isEmpty(currentMerchant)) return <><Empty className={styles.empty}  /> <Empty className={styles.empty}  /></> ;
    return <Fragment>
      {renderMerchantInformationOverview()}
      {renderMerchantInformationDetail()}
    </Fragment>

  }



  //RENDER UI
  return <Card className={styles.component}>
    {renderComponent()}
    {(modalVisible)&&<ModalEditInformation/>}
  </Card>
};

export default connect(({loading, dispatch,myProfile,global }: any) => ({
  dispatch,
  loading,
  myProfile,
   global
}))(AccountInformation);
