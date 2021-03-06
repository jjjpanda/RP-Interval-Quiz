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
    Typography,
    PageHeader
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
                
                <Layout.Content style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <br/>
                    <Space direction="vertical">
                        <Typography.Title>RP Interval Quiz</Typography.Title>
                        <Button type="primary">
                            <Link to="/quiz">
                                Start
                            </Link>
                        </Button>

                        <img src="img/notes.png" />
                    </Space>
                    
                </Layout.Content>
            </Layout>
        )
    }
}

export default Start