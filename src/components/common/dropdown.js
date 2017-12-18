import React from "react";
import { Button, Dropdown as AntDropdown, Icon, Menu } from "antd";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let options = this.props.options || [];
        const menu = (
            <Menu>
                {options.map((option, idx) => option)}
            </Menu>
        )
        return (
            <AntDropdown overlay={menu} trigger={["click"]}>
                {this.props.children}
            </AntDropdown>
        )
    }
}

export default Dropdown;