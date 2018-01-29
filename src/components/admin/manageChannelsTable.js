import React from "react";
import { Button, Table } from "antd";
import PropTypes from "prop-types";

import LocalizationManager from "../../localization";

class ManageChannelsTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;

        this.columns = this.buildColumns();
    }

    buildColumns() {
        return [{
            title: this.stringObj.modelsText.channel.title,
            dataIndex: 'title' ,
            sorter: (a , b) => a.title.localeCompare(b.title)
        }, {
            title: this.stringObj.modelsText.channel.customUrl,
            dataIndex: 'customUrl',
            sorter: (a, b) => a.customUrl.localeCompare(b.customUrl)
        }, {
            title: this.stringObj.modelsText.channel.youtubeId,
            dataIndex: 'youtubeId',
            sorter: (a, b) => a.youtubeId.localeCompare(b.youtubeId)
        }, {
            key: 'sync-button',
            render: (text, row, index) => <Button type="primary" onClick={this.props.handleSyncChannel.bind(undefined, row)}>Sync</Button>
        }];
    }

    render() {
        return (
            <Table className="table-manage-channels-table" columns={this.columns} dataSource={this.props.channels} rowKey={record => record.id} />
        )
    }
}

ManageChannelsTable.propTypes = {
    channels: PropTypes.array,
    handleSyncChannel: PropTypes.func
}

ManageChannelsTable.defaultProps = {
    channels: [],
    handleSyncChannel: () => {}
}

export default ManageChannelsTable;