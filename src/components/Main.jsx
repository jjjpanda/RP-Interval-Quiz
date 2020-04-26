import React from 'react';
import {
    Button,
    Icon,
    Layout
} from 'antd'
import {
    BrowserRouter as Router,
    Link,
    Route,
    Prompt
} from 'react-router-dom';

import Start from './Start.jsx'
import Quiz from './Quiz.jsx'

console.log(window.location)

const Content = Layout.Content

class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Router basename={'/RP-Interval-Quiz'} >
                <Layout style={{ minHeight: '100vh', height:'100vh' }}>
                    <Content>
                        <Route exact path="/" render={(props) => (<Start {...props} />)} />
                        <Route exact path="/quiz" render={(props) => (<Quiz {...props} />)} />
                    </Content>
                </Layout>
            </Router>
        )
    }
}

export default Main;