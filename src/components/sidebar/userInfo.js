import React from "react";
import { Col, Row } from "antd";

class SideBarUserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="cmpt-side-bar-user-info">
                <Row>
                    <Col span={24}>
                        <img className="profile-pic img-responsive" src="http://www.theheadshotguy.co.uk/wp-content/uploads/2014/12/Screen-Shot-2014-12-02-at-11.14.42.png" />
                    </Col>
                </Row>
                {this.props.isSideBarOpen && 
                <Row className="user-info-row">
                    <Col span={24} className="text-center">
                        <h3>{`${this.props.user.username}`}</h3>
                        <div>Thai Pearl</div>
                        <div>Manager</div>
                    </Col>
                </Row>}
            </div>
        );
    }
}

export default SideBarUserInfo;