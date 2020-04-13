import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Spin,
    Progress
} from 'antd'

import Settings from './Settings.jsx'

class Quiz extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            playing: false,
            firstPlay: true,
            numberOfQuestions: 1,
            numberCorrect: 0,
            firstAttempt: true,
            playable: false,
            nextable: false,
            currentRoot: interval.randomInteger(150, 500),
            currentInterval: interval.randomInterval(),
            correctnessDistribution: interval.blankDistribution()
        }
        console.log(this.state.correctnessDistribution)
    }

    playInterval = () => {
        this.setState(() => ({ playing: true }), () => {
            interval.playInterval(this.state.currentRoot, interval.findInterval(this.state.currentInterval).ratio, () => {
                this.setState(() => ({ playing: false, firstPlay: false }))
            })
        })
    }

    sendAnswer = (semitones) => {
        console.log(semitones)
        if(semitones === this.state.currentInterval){
            if(this.state.firstAttempt){
                this.setState((state) => ({
                    numberCorrect: state.numberCorrect+1, 
                    numberOfQuestions: state.numberOfQuestions+1, 
                    firstPlay: true,
                    currentInterval: interval.randomInterval(),
                    currentRoot: interval.randomInteger(150, 500)
                }))
            }
            else{
                this.setState((state) => ({ 
                    numberOfQuestions: state.numberOfQuestions+1, 
                    firstPlay: true,
                    currentInterval: interval.randomInterval(),
                    firstAttempt: true,
                    currentRoot: interval.randomInteger(150, 500),
                }))
            }
        }
        else{
            this.setState(() => ({ 
                firstAttempt: false
            }))
        }
    }
        
    render() {
        return (
            <div>
                {this.state.playing ? <Spin /> : null}

                <br />

                <Settings updateSettings={(settings) => {
                    console.log(settings)
                    interval.setProbability(interval.createProbabilityArr(settings.intervals))
                }} /> 

                <span>
                    <Button shape="round" icon={this.state.firstPlay ? "play-circle" : "redo"} onClick={this.playInterval} />
                    <Button shape="round" icon="arrow-right" onClick={() => {}} />
                </span>

                <br />

                <div>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(12)}}>Octave</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(11)}}>Major Seventh</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(10)}}>Minor Seventh</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(9)}}>Major Sixth</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(8)}}>Minor Sixth</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(7)}}>Perfect Fifth</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(6)}}>Tritone</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(5)}}>Perfect Fourth</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(4)}}>Major Third</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(3)}}>Minor Third</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(2)}}>Major Second</Button>
                    <Button shape="round" icon="up" onClick={() => {this.sendAnswer(1)}}>Minor Second</Button>
                    
                    <br />

                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-1)}}>Minor Second</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-2)}}>Major Second</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-3)}}>Minor Third</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-4)}}>Major Third</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-5)}}>Perfect Fourth</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-6)}}>Tritone</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-7)}}>Perfect Fifth</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-8)}}>Minor Sixth</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-9)}}>Major Sixth</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-10)}}>Minor Seventh</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-11)}}>Major Seventh</Button>
                    <Button shape="round" icon="down" onClick={() => {this.sendAnswer(-12)}}>Octave</Button>
                </div>

                <Progress percent={this.state.numberCorrect/this.state.numberOfQuestions*100} showInfo={true} type="circle" format={p => `${Math.round(p*100)/100}% Correct`} />
            </div>
        )
    }
}

export default Quiz