import React, { useEffect, useState } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { Empty } from 'antd';

import { Container } from '@/components';
import { getSupersetGuestToken } from '@/services/superset/api';
import style from "./index.less";


const SupersetPage: ReactPageProps = ({ route }) => {
    console.log('route', route);
    
    const { supersetDashboardID } = route;
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        if(supersetDashboardID) {
            (async () => {
                const resp: ObjectType = await getSupersetGuestToken(supersetDashboardID);
    
                const fetchGuestTokenFromBackend = async () => {
                    try {
                        if(resp.success) {
                            return Promise.resolve(resp?.data?.token);
                        }
                        else {
                            setIsError(false);
                            console.error('NEO ERROR: fetchGuestTokenFromBackend', resp?.message)
                            return Promise.resolve('false');
                        }
                    } catch (error) {
                        setIsError(false);
                        console.error('NEO ERROR: fetchGuestTokenFromBackend', error)
                        return Promise.resolve('false');
                    }
                }
    
                const element = document.getElementById("my-superset-container");
                if (element)
                    embedDashboard({
                        id: supersetDashboardID, // given by the Superset embedding UI
                        supersetDomain: resp?.data?.supersetDomain,
                        mountPoint: element, // any html element that can contain an iframe
                        fetchGuestToken: () => fetchGuestTokenFromBackend(),
                        dashboardUiConfig: { hideTitle: true, hideChartControls: true, hideTab: true, filters: {
                            visible: true,
                            expanded: false
                        } }, // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
                    });
            })();
        }
    }, [supersetDashboardID])

    const containerStyle: React.CSSProperties = {
        height: '100vh'
    }

    return (
        <Container style={containerStyle}>
            {
                supersetDashboardID && !isError ? <div style={{ width: '100%', height: 400 }} id="my-superset-container" className={style['my-superset-container']}></div>
                : <Empty />
            }
        </Container>
    );
};

export default SupersetPage;
