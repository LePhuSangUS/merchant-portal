import styles from "./NotificationItemModal.less";
import React, {  Fragment } from 'react';
import {
  Modal,
  Button,
  Status,
} from '@/components';
import { Typography } from "antd";
import { parseValue, translate, format, renderField, } from '@/utils';
import { TRANSACTION_STATUS_LIST, WITHDRAWAL_STATUS_LIST } from '@/constants';
import { DetailFieldItem } from "@/components/DetailPage";
const { Title,Text } = Typography;



export default function NotificationItemModal(props: any) {
  const { onCancel, noticeItem } = props;  
  const actionType = noticeItem?.actionType;
  const renderNotiContent = () => {

    const notificationData = noticeItem?.data;
    switch (actionType) {
      case "WITHDRAWAL": {
        const mappingData = [
          {
            title: translate("my-notification.Information"),
            id:"1.1",

            items: [
              {
                id:"1",
                label: translate("my-notification.Created_At"),
                content: renderField(notificationData?.createdAt,"datetimes") ,
              },
              {
                id:"2",
                label: translate("my-notification.Transaction_Code"),
                content: renderField(notificationData?.transId) ,
              },
              {
                id:"2",
                label: translate("my-notification.Amount"),
                content: renderField(notificationData?.amount,"currency") ,
              },
              {
                id:"3",
                label: translate("my-notification.Status"),
                content: <Status value={notificationData?.status} options={WITHDRAWAL_STATUS_LIST} />
              },
              {
                id:"4",
                label: translate("my-notification.Failed_Reason"),
                content: renderField(notificationData?.note||"-") ,
                noBorder:true,
              },
            ]
          },
          {
            title: translate("my-notification.Information_Other"),
            id:"2.1",
            items: [
              {
                id:"4",
                label: translate("my-notification.Withdrawal"),
                content: renderField(notificationData?.payoutInfo?.name) ,
              },
              {
                id:"5",
                label: translate("my-notification.Branch"),
                content: renderField(notificationData?.payoutInfo?.branch) ,
              },
              {
                id:"6",
                label: translate("my-notification.Account_Number"),
                content: renderField(notificationData?.payoutInfo?.accountNumber) ,
              },
              {
                id:"7",
                label: translate("my-notification.Account_Name"),
                content: renderField(notificationData?.payoutInfo?.accountName) ,
                noBorder:true,
                
              },
            ]
          },
        ]

        return mappingData.map((item) => {
              return <div style={{marginBottom:"20px"}} key={item.id}>
                <Title level={5}>{item.title}</Title>
                <div style={{
                  marginLeft:"20px"
                }}>
                  {
                    (item?.items || []).map((childItem:any)=>{
                      return <DetailFieldItem
                      key={childItem.id}
                        {...childItem}
                        colConfig={{
                          xs: 24,
                          sm: 24,
                          md: 24,
                      }}
                      childColConfig={{
                          label: {
                              xs: 24,
                              sm: 10,
                              md: 8,
                 
                          },
                          content: {
                              xs: 24,
                              sm: 14,
                              md: 16,
  
                          }
                      }}
                      />
                    })
                  }
                </div>
                
              </div> 
           }) 
      }
        
        
      
      default:
        return <table className='table'>
        <tbody>
          <tr>
            <td>
              {translate('my-notification.field.title')}:
            </td>
            <td>
              {parseValue(noticeItem?.notification?.title || "-")}
            </td>
          </tr>
          <tr>
            <td>
              {translate('my-notification.field.content')}:
            </td>
            <td>
              <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: noticeItem?.notification?.body || "-" }} />
            </td>
          </tr>
          {
            noticeItem?.data?.type !== 'FIRST_LOGIN' &&
            <tr>
              <td>
                {translate('my-notification.field.sendBy')}:
              </td>
              <td>
                {parseValue(noticeItem?.appChannel || "-")}
              </td>
            </tr>
          }
          {
            noticeItem?.data?.type !== 'FIRST_LOGIN' &&
            <tr>
              <td>
                {translate('my-notification.field.status')}:
              </td>
              <td>
                <Status options={TRANSACTION_STATUS_LIST} value={noticeItem?.state} />
              </td>
            </tr>
          }
          <tr>
            <td>
              {translate('my-notification.field.sendAt')}:
            </td>
            <td>
              {
                noticeItem?.createdAt
                  ? format.datetimes(noticeItem.createdAt)
                  : "-"
              }
            </td>
          </tr>
        </tbody>
      </table>
    }

  }

  return (<Modal
    visible={true}
    title={translate('my-notification.title.detail')}
    onCancel={onCancel}
    className={styles.modal}
    width={800}
    footer={
      <div className='btn-wrap'>
        <Button onClick={onCancel}>
          {translate('form.button.close')}
        </Button>
      </div>
    }
  >
    {renderNotiContent()}
  </Modal>
  )
}
