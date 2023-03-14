const DragableUploadListItem = ({ originNode, file }: any) => {
    // const ref = React.useRef();
    // const errorNode = <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>;
    return (
        <div
            // ref={ref}
            className="ant-upload-draggable-list-item"
            style={{ cursor: 'move' }}
        >
            {/* only render file tiem uploaded successful */}
            {file.status !== 'error' && originNode}
        </div>
    )
}

export default DragableUploadListItem