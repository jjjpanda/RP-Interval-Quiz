import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Spin
} from 'antd'

class Quiz extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            playing: false
        }
    }

    playInterval = () => {
        this.setState(() => ({ playing: true }), () => {
            interval.playInterval(interval.randomInteger(150, 500), interval.findInterval(interval.randomInteger(1, 12) * (Math.random()>0.5 ? 1 : -1)).ratio, () => {
                this.setState(() => ({ playing: false }))
            })
        })
    }
        
    render() {
        return (
            <div>
                {this.state.playing ? <Spin /> : null}
                <Button icon="play-cirle" onClick={this.playInterval} />
            </div>
        )
    }
}

export default Quiz