import React, { useEffect } from 'react';
import { FormItem, Cascader } from '@/components';
import { PROVINCE, DISTRICT, WARD } from '@/constants/location';
import { translate } from '@/utils';

const Address = (props: any) => {
  const [options, setOptions] = React.useState();
  const district = DISTRICT.map((item) => ({ ...item, level: 2, isLeaf: false }));

  useEffect(() => {
    let province = PROVINCE;
    let district = DISTRICT.map(item => {
      let dd = WARD.filter(i => i.district === item.id);
      return {...item, children: dd}
    });
    let fullAddress = province.map(item => {
      let dd = district.filter(i => i.province === item.id);
      return {...item, children: dd}
    })
    setOptions(fullAddress);
  }, [])

  const loadData = (selectedOptions: any) => {
    const level = selectedOptions.length;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      let currentData = [];
      if (level === 1) {
        currentData = district.filter((item) => item.province === selectedOptions?.[0].id);
      }
      if (level === 2) {
        currentData = WARD.filter((item) => item.district === selectedOptions?.[0].id);
      }
      targetOption.loading = false;
      targetOption.children = currentData;
      setOptions([...options]);
    }, 1000);
  };

  return (
    <FormItem {...props}>
      <Cascader
        fieldNames={{ label: 'name', value: 'id' }}
        options={options}
        loadData={loadData}
        placeholder={translate('form.field.select.address')}
        // onChange={onChange}
        // changeOnSelect
      />
    </FormItem>
  );
};

export { Address };
