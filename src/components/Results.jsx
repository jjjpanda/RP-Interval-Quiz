import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Progress,
    Layout,
    Space,
    Modal
} from 'antd'

import {
    StopOutlined
} from '@ant-design/icons'

class Results extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false
        }
    }

    openModal = () => {
        this.setState(() => ({visible: true}))
    }

    closeModal = () => {
        this.setState(() => ({visible: false}))
    }

    render() {
        return (
            <div>
                <Button shape="round" icon={<StopOutlined />} onClick={this.openModal} />
                <Modal
                    closable={false}
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                >
                    {JSON.stringify(this.props.results, null, "\t")}
                </Modal>
            </div>
        )
    }
}

export default Results