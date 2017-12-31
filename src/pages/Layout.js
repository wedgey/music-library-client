import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";

import SideBar from "../components/sidebar";
import PlayerBar from "../components/player/bar";

class BaseLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Layout className="fixed-footer" style={{ minHeight: '100vh'}}>
                <Layout>
                    <Layout.Sider className="hidden-xs" trigger={null} collapsible collapsed={!this.props.ui.isSideBarOpen}>
                        <SideBar />
                    </Layout.Sider>
                    <Layout>
                        <Layout.Content id="site-container">
                            {this.props.children}
                        </Layout.Content>
                        {/* <Layout.Footer>
                            Footer Component Goes Here
                        </Layout.Footer> */}
                    </Layout>
                </Layout>
                <Layout.Footer style={{padding: 0}}>
                    <PlayerBar />
                </Layout.Footer>
            </Layout>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        ui: store.ui
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(BaseLayout);