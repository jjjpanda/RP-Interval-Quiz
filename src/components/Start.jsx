import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    Route,
    withRouter,
} from 'react-router-dom';
import {
    Button
} from 'antd'

class Start extends React.Component{
    render() {
        return (
            <Button>
                <Link to="/quiz">
                    Start
                </Link>
            </Button>
        )
    }
}

export default Start