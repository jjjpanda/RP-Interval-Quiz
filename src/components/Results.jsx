import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Typography,
    Table,
    Space,
    Modal
} from 'antd'

import {
    BarChartOutlined
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

    columns = [
        {
            title: 'Interval',
            dataIndex: 'interval',
            key: 'interval',
        },
        {
            title: 'Semitones',
            dataIndex: 'semitones',
            key: 'semitones',
        },
        {
            title: 'Correct',
            dataIndex: 'correct',
            key: 'correct',
        },
        {
            title: 'Incorrect',
            dataIndex: 'incorrect',
            key: 'incorrect',
        },
        {
            title: 'Percent Correct',
            dataIndex: 'percent',
            key: 'percent',
            render: (text) => {
                return (
                    <div>{text.toFixed(2)}%</div>
                )
            }
        },
    ];

    render() {
        return (
            <div>
                <Button shape="round" icon={<BarChartOutlined />} onClick={this.openModal} />
                <Modal
                    closable={false}
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                >
                    <Typography.Title level={2}>Results</Typography.Title>
                    <Table size={'small'} pagination={false} dataSource={[...this.props.results].reverse().filter(i => i.correct != 0 || i.incorrect != 0)} columns={this.columns} />
                </Modal>
            </div>
        )
    }
}

export default Results