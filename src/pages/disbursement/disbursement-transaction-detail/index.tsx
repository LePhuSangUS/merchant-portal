import { Container, PageLoading, ProColumns, ProTable, FormSelect, Status, Icons, FormText } from "@/components"
import { DISBURSEMENT_HISTORIES_TRANSACTION_STATUS } from "@/constants"
import { renderField, translate, message, format, parseOptions } from "@/utils"
import { Fragment, useEffect, useState } from "react"
import { getDisbursementTransactionDetail } from '@/services/disbursement/api';
import { DetailFieldItem } from "@/components/DetailPage";
import { Card } from "antd";
import { useRequestAPI } from '@/hooks';
import {parseNumberToCurrencyMultipleLanguage} from "@/utils/parse"
import {renderMaskCardNumber} from "@/utils/format"

const { EyeOutlined } = Icons;

const DisbursementTransactionDetail = ({ history ,route,match}: any) => {
  const { id } = match.params
  const [transactionData, setTransactionData] = useState<any>({});
  const { isLoading}=useRequestAPI({
    requestFn: getDisbursementTransactionDetail,
    pageName: route?.name,
    handleSuccess: (resp) => {
      const respData = resp?.data;
      setTransactionData(respData)
    },

    internalCall: true,
  },
  {
    id,
  })


  const dataRender = [
    {
      id: '1',
      label: translate('form.field.creationTime'),
      content: renderField(transactionData?.createdAt, 'datetimes')
    },
    {
      id: '2',
      label: translate('Disbursement_Histories.Transaction_Code'),
      content: renderField(transactionData?.transId)
    },
    {
      id: '3',
      label: translate('Disbursement_Histories.Account_Number'),
      content: renderMaskCardNumber(transactionData?.bankAccountNumber)

    },
    {
      id: '4',

      label: translate('disbursement.Currency_Code'),
      content: renderField(transactionData?.srcCurrency)

    },
    {
      id: '4',

      label: translate('Disbursement_Histories.Amount'),
      content: parseNumberToCurrencyMultipleLanguage(transactionData?.srcAmount)

    },
    {
      id: '4',

      label: translate('disbursement.Exchange_Rate'),
      content: parseNumberToCurrencyMultipleLanguage(transactionData?.fxRate)

    },
    {
      id: '4',

      label: translate('disbursement.VND_Value'),
      content: parseNumberToCurrencyMultipleLanguage(transactionData?.amount)

    },
    {
      id: '5',
      label: translate('Disbursement_Histories.Status'),
      content: <Status value={transactionData.status || "-"} options={DISBURSEMENT_HISTORIES_TRANSACTION_STATUS}></Status>

    },
    {
      id: '6',
      label: translate('Disbursement_Histories.Updated_At'),
      content: renderField(transactionData?.lastUpdatedAt)

    },
    {
      id: "7",
      label: translate('Disbursement_Histories.Ref_Code'),
      content: renderField(transactionData?.refCode)
  
    },
    ///===================
    {
      id: '8',
      label: translate('Disbursement_Histories.Request_Code'),
      content: renderField(transactionData?.disbursementRequestId)

    },
    {
      id: '9',
      label: translate('Disbursement_Histories.Bank'),
      content: renderField(transactionData?.bankName)

    },
    {
      id: '10',
      label: translate('Disbursement_Histories.Branch'),
      content: renderField(transactionData?.bankBranchName)

    },
    {
      id: '11',
      label: translate('Disbursement_Histories.Account_Name'),
      content: renderField(transactionData?.bankAccountName)

    },
    {
      id: '12',
      label: translate('Disbursement_Histories.Content'),
      content: renderField(transactionData?.description)

    },
    {
      id: '13',
      label: translate('Disbursement_Histories.Reason'),
      content: renderField(transactionData?.failedReason)

    },
    {
      id: '14',
      label: translate('Disbursement_Histories.Noted'),
      content: renderField(transactionData?.note)

    },
    {
      id: '15',
    label: translate('Disbursement_Histories.Transaction_Code_Merchant'),
    content: renderField(transactionData?.requestTransId)
  },
 
  ]

  const renderDetail = () => {
    return <Fragment>
      {
        dataRender?.map((item: any) => {
          return <DetailFieldItem key={item.key} {...item}   colConfig={{
            xs: 24,
            sm: 24,
            md: 24,
        }}
        childColConfig={{
            label: {
                xs: 10,
                md: 8,
             
            },
            content: {
                xs: 14,
                md: 16,
        
            }
        }}/>
        })
       }
     </Fragment>
  }


  return (<Fragment>

    <Container>
      <div className="content" style={{ paddingTop: 0 }}>
        <PageLoading active={isLoading} />
        <Card>
        {renderDetail()}

        </Card>
      </div>
    </Container>
  </Fragment>

  )
}

export default DisbursementTransactionDetail