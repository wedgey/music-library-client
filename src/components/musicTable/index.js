import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

import { formatToMinutes } from "../../utils/common";
import LocalizationManager from "../../localization";

class MusicTable extends React.Component {
    constructor(props) {
        super(props);

        this.stringObj = LocalizationManager.localization;
        this.defaultColumns = this.buildColumns();
    }

    buildColumns() {
        return [{
            title: this.stringObj.modelsText.music.title,
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title)
        },{
            title: this.stringObj.modelsText.music.artist,
            dataIndex: 'artistNames',
            sorter: (a, b) => a.artistNames.localeCompare(b.artistNames)
        },{
            title: this.stringObj.modelsText.music.duration,
            dataIndex: 'duration',
            render: (text, row, index) => text ? formatToMinutes(text) : "",
            sorter: (a, b) => (a.duration || 0) - (b.duration || 0)
        }];
    }

    render() {
        let { additionalColumns, dataSource, columns, pageSize, totalCount, pagination, ...rest } = this.props;
        columns = [ ...(columns.length > 0 ? columns : this.defaultColumns), ...additionalColumns ];
        pagination = pagination || (totalCount > pageSize && { pageSize, total: totalCount });
        return (
            <Table className="table-music-table" {...rest} columns={columns} dataSource={dataSource} rowKey={record => record.id} pagination={pagination} />
        )
    }
}

MusicTable.propTypes = {
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array,
    additionalColumns: PropTypes.array,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number
}

MusicTable.defaultProps = {
    additionalColumns: [],
    columns: [],
    pageSize: 10
}

export default MusicTable;