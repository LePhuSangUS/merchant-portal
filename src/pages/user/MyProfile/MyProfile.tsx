import {
  Row,
  Col,
  Space
} from "antd";
import { Page,ModalRemind } from "@/new_components"
import styles from "./MyProfile.less";
import AccountInformation from "./components/AccountInformation"
import AuthorizationManagement from "./components/AuthorizationManagement";
import APIConnectionConfig from "./components/APIConnectionConfig";
import { connect } from 'dva';
interface IMyProfileProps {
  currentMerchant: any,
  global:any,
  [key: string]: any
}

const MyProfile = (props: IMyProfileProps) => {
  const { currentMerchant, global} = props;
  const { visibleModalRemind } = global || {};
  const renderPage = () => {
    return <Row gutter={[16,16]}>
      <Col sm={24} md={12} lg={10}>
        <AccountInformation currentMerchant={currentMerchant} />
      </Col>
      <Col sm={24} md={12} lg={14}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <AuthorizationManagement  currentMerchant={currentMerchant} />
          <APIConnectionConfig />
      </Space>
      </Col>
    </Row>
  }

  return <Page  className={styles.page}>
    {renderPage()}
   { visibleModalRemind&&<ModalRemind/>}
  </Page>;
};

export default connect(({ user, global }: any) => ({
  currentMerchant: user.currentMerchant,
  global
}))(MyProfile);