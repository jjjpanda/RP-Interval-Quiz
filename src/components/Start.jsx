import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    Route,
    withRouter,
} from 'react-router-dom';
import {
    Button,
    Layout,
    Space,
    Typography
} from 'antd'

import * as interval from '../lib/interval.js'
import Settings from './Settings.jsx'

class Start extends React.Component{
    render() {
        return (
            <Layout>
                <Layout.Header style={{textAlign: 'right'}}>
                    <Settings updateSettings={(settings) => {
                        console.log(settings)
                        interval.setProbability(interval.createProbabilityArr(settings.intervals))
                    }} />  
                </Layout.Header>
                <Layout.Content style={{textAlign: 'center'}}>
                    <Space direction="vertical">
                        <Typography.Title>RP Interval Quiz</Typography.Title>
                        <br />
                        <Button>
                            <Link to="/quiz">
                                Start
                            </Link>
                        </Button>
                    </Space>
                    
                </Layout.Content>
            </Layout>
        )
    }
}

export default Start