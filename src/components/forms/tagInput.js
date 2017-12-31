import React from "react";
import { Col, Row, Tag } from "antd";

class TagInput extends React.Component {
    constructor(props) {
        super(props);

        this.generateTagNodes = this.generateTagNodes.bind(this);
    }

    generateTagNodes(props = {}) {
        let { tags, tagProps} = props;
        return tags.map((tag, index) => {
            let p = tagProps.onClose ? { ...tagProps, onClose: tagProps.onClose.bind(undefined, tag) } : tagProps;
            return <div className="tag" key={tag}><Tag {...p}>{tag}</Tag></div>
        });
    }

    render() {
        let tags = this.generateTagNodes(this.props);
        return (
            <div className="form-cmpt-tag-input">
                {tags} <div className="input">{this.props.children}</div>
            </div>
        )
    }
}

export default TagInput;