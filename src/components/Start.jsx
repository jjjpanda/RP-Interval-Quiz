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

import * as interval from '../lib/interval.js'
import Settings from './Settings.jsx'

class Start extends React.Component{
    render() {
        return (
            <div>
                <Settings updateSettings={(settings) => {
                    console.log(settings)
                    interval.setProbability(interval.createProbabilityArr(settings.intervals))
                }} />  
                <Button>
                    <Link to="/quiz">
                        Start
                    </Link>
                </Button>
            </div>
           
        )
    }
}

export default Start