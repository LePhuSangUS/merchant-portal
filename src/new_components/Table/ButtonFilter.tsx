import { Card, CardProps, Popover } from 'antd';
import {Button} from  "@/new_components"
import {  icFilterActive,
  icFilterDefault} from '@/assets/icons/table';
import classNames from 'classnames';
import styles from './ButtonFilter.less';
import { icMoreActive, icMoreDefault } from '@/assets/icons/table';
import { useState } from 'react';
import { useToggle } from 'react-use';

interface IPageProps extends CardProps {
  children?: any;
  className?: any;
  toggleShowFilter:(prev?:any)=>void
}
const ButtonFilter = (props: IPageProps) => {
  const { children, toggleShowFilter=()=>{} } = props;
  const [open, toggleOpen] = useToggle(false);

 
  const handleOpenChange:any = () => {
    toggleOpen();
    toggleShowFilter()
  };

  return (
    <Button onClick={handleOpenChange} className={classNames({
      [ styles.active]:open,
      
   },styles.default)} size="large" icon={<img src={open?icFilterActive:icFilterDefault} alt="icon" />}>
 {children}
</Button>
  );
};

export default ButtonFilter;
