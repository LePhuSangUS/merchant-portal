import { Card, CardProps, Popover } from 'antd';
import {Button} from  "@/new_components"
import classNames from 'classnames';
import styles from './ButtonAction.less';
import { ReactNode } from "react";
import { icMoreActive, icMoreDefault } from '@/assets/icons/table';
import { useState } from 'react';
import _ from "lodash";
interface IPageProps extends CardProps {
  children?: any;
    className?: any;
    renderActionRow?:(value:any,record:any)=>ReactNode,
    value: any,
    record:any,
}
const Page = (props: IPageProps) => {
  const { value,record,children, renderActionRow} = props;
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

    const renderAction = () => {
        if (_.isFunction(renderActionRow)) {
        return renderActionRow(value,record)
        }
        return <>Please Define renderActionRow</>
        
}

  return (
    <Popover
      content={<div onClick={hide}>{renderAction()}</div>}
      trigger="click"
      open={open}
      
      placement="bottomRight"
      onOpenChange={handleOpenChange}
    >
          <Button className={classNames({
             [ styles.active]:open,
             
          },styles.default)} size="large" icon={<img src={open?icMoreActive:icMoreDefault} alt="icon" />}>
        {children}
      </Button>
    </Popover>
  );
};

export default Page;
