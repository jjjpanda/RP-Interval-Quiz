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
import Settings from './Settings.jsx'
import Results from './Results.jsx'

const Content = Layout.Content

class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Content>
                        <Route exact path="/" render={(props) => (<Start {...props} />)} />
                        <Route exact path="/quiz" render={(props) => (<Quiz {...props} />)} />
                        <Route exact path="/settings" render={(props) => (<Settings {...props} />)} />
                        <Route exact path="/results" render={(props) => (<Results {...props} />)} />
                    </Content>
                </Layout>
            </Router>
        )
    }
}

export default Main;