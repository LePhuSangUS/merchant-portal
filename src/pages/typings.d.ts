type ObjectType = Record<string, any>

type PageProps = {
    history: ObjectType;
    location: ObjectType;
    match: ObjectType;
    routes: ObjectType;
    route: ObjectType;
}

type ReactPageProps = React.FC<PageProps>