import React from "react";
import { DefaultFooter } from "@ant-design/pro-layout";

const Footer = () => (
    <DefaultFooter
        copyright={`${new Date().getFullYear()} Merchant Portal. All rights reserved.`}
        style={{ background: '#F3F3F9' }}
        links={[
            {
                key: 'Merchant Portal',
                title: '',
                href: 'https://portal.neopay.vn/neopay/portal',
                blankTarget: true,
            },
        ]}
    />
);

export default Footer;