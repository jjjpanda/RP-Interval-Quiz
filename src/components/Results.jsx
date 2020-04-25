import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Typography,
    Table,
    Space,
    Modal,
    Popover,
    Progress
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
            <Popover content = {<Typography>Results</Typography>} title={null} trigger="hover">
                <Button shape="round" icon={<BarChartOutlined />} onClick={this.openModal} />
                <Modal
                    closable={true}
                    visible={this.state.visible}
                    footer={<Button onClick={this.closeModal} >Ok</Button>}
                    onCancel={this.closeModal}
                    maskClosable
                >
                    <Typography.Title level={2}>Results</Typography.Title>
                    <Typography>
                        {`Correct: ${this.props.numberCorrect}/${this.props.numberOfQuestions}`}
                    </Typography>
                    <Progress
                        percent={this.props.numberCorrect/this.props.numberOfQuestions*100}
                        showInfo={false} 
                        type="line"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        trailColor={"#dddddd"}
                    />
                    <Table size={'small'} pagination={false} dataSource={[...this.props.results].reverse().filter(i => i.correct != 0 || i.incorrect != 0)} columns={this.columns} />
                </Modal>
            </Popover>
        )
    }
}

export default Results