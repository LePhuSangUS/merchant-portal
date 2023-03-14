import { connect, history, Link, useIntl, createIntl, getLocale } from 'umi';

export const renderBreadcrumItem = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;

    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
        route?.path ? <Link to={route?.path}>{route.breadcrumbName}</Link> : <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{route.breadcrumbName}</span>
    );
}