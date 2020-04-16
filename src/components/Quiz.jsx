import React from 'react'

import * as interval from '../lib/interval.js'

import {
    Button,
    Progress,
    Layout,
    Space,
    Result
} from 'antd'

import {
    ArrowRightOutlined,
    PlayCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    RedoOutlined,
    CloseOutlined,
    CheckOutlined,
    SoundOutlined,
    NotificationOutlined,
} from '@ant-design/icons'

import Settings from './Settings.jsx'
import Results from './Results.jsx'
import Cookies from 'js-cookie'

class Quiz extends React.Component{
    constructor(props){
        super(props)

        interval.setProbability(interval.createProbabilityArr(JSON.parse(Cookies.get('intervals')) || Settings.intervalArr('up', 6)))
        
        this.state = {
            playing: false,
            firstPlay: true,
            numberOfQuestions: 1,
            numberCorrect: 0,
            firstAttempt: true,
            playable: true,
            nextable: false,
            currentRoot: interval.randomInteger(150, 500),
            currentInterval: interval.randomInterval(),
            correctnessDistribution: interval.currentDistribution(),
            incorrectGuesses: [],
            correct: false,
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

    nextInterval = () => {
        this.setState(() => ({
            firstPlay: true,
            firstAttempt: true,
            nextable: false,
            playable: true,
            currentInterval: interval.randomInterval(),
            currentRoot: interval.randomInteger(150, 500),
            incorrectGuesses: [],
            correct: false
        }), () =>{
            
        })
    }

    sendAnswer = (semitones) => {
        console.log(semitones)
        if(semitones === this.state.currentInterval){
            if(this.state.firstAttempt){
                this.setState((state) => {
                    const index = state.correctnessDistribution.findIndex(i => semitones === i.semitones)
                    state.correctnessDistribution[index].correct++
                    state.correctnessDistribution[index].percent = 100 * state.correctnessDistribution[index].correct / (state.correctnessDistribution[index].correct + state.correctnessDistribution[index].incorrect)
                    return {
                        numberCorrect: state.numberCorrect+1,
                        correctnessDistribution: state.correctnessDistribution,
                        numberOfQuestions: state.numberOfQuestions+1, 
                        nextable: true,
                        firstAttempt: false,
                        correct: true,
                    }
                })
            }
            else{
                this.setState((state) => ({
                    nextable: true,
                    correct: true,
                }))
            }
        }
        else{
            if(this.state.firstAttempt){
                this.setState((state) => { 
                    state.incorrectGuesses.push(semitones)
                    const index = state.correctnessDistribution.findIndex(i => this.state.currentInterval === i.semitones)
                    state.correctnessDistribution[index].incorrect++
                    state.correctnessDistribution[index].percent = 100 * state.correctnessDistribution[index].correct / (state.correctnessDistribution[index].correct + state.correctnessDistribution[index].incorrect)
                    return {
                        numberOfQuestions: state.numberOfQuestions+1, 
                        firstAttempt: false,
                        incorrectGuesses: state.incorrectGuesses 
                    }    
                })
            }
            else{
                this.setState((state) => { 
                    state.incorrectGuesses.push(semitones)
                    return {
                        incorrectGuesses: state.incorrectGuesses 
                    }    
                })
            }
        }
    }

    renderAscendingButtons(){
        return [...interval.intervals].slice(12,24).map(i => {
            return (
                <Button 
                    danger={this.state.incorrectGuesses.includes(i.semitones)} 
                    shape="round" 
                    icon={this.state.incorrectGuesses.includes(i.semitones) ? <CloseOutlined /> : (this.state.correct && i.semitones === this.state.currentInterval ? <CheckOutlined /> : (i.direction === 'ascending' ? <CaretUpOutlined /> : <CaretDownOutlined /> ))} 
                    onClick={() => {this.sendAnswer(i.semitones)}}
                >
                    {i.name}
                </Button>
            )
        })
    }

    renderDescendingButtons(){
        return [...interval.intervals].slice(0,12).reverse().map(i => {
            return (
                <Button 
                    danger={this.state.incorrectGuesses.includes(i.semitones)} 
                    shape="round" 
                    icon={this.state.incorrectGuesses.includes(i.semitones) ? <CloseOutlined /> : (this.state.correct && i.semitones === this.state.currentInterval ? <CheckOutlined /> : (i.direction === 'ascending' ? <CaretUpOutlined /> : <CaretDownOutlined /> ))} 
                    onClick={() => {this.sendAnswer(i.semitones)}}
                >
                    {i.name}
                </Button>
            )
        })
    }
        
    render() {
        return (
            <Layout>
                <Layout.Header style={{textAlign: 'right'}}>
                    <Space>
                        <Settings updateSettings={(settings) => {
                            console.log(settings)
                            interval.setProbability(interval.createProbabilityArr(settings.intervals))
                        }} /> 
                        <Results 
                            results = {this.state.correctnessDistribution}
                        />
                    </Space>
                </Layout.Header>
                
                <Layout.Content style={{textAlign: 'center'}}>

                    <Space >
                        {this.state.playing ? <SoundOutlined /> : <NotificationOutlined />}
                    </Space>

                    <br />

                    <Space direction={'horizontal'}>
                        <Button shape="round" disabled={!this.state.playable} icon={this.state.firstPlay ? <PlayCircleOutlined /> : <RedoOutlined />} onClick={this.playInterval} />
                        <Button shape="round" disabled={!this.state.nextable} icon={<ArrowRightOutlined />} onClick={this.nextInterval} />
                    </Space>

                    <br />

                    <Space>
                        <Space direction={"vertical"}>
                            {this.renderAscendingButtons()}
                        </Space>
                        <Space direction={"vertical"}>
                            {this.renderDescendingButtons()}
                        </Space>
                    </Space>

                    <br />

                    <Progress 
                        percent={this.state.numberCorrect/this.state.numberOfQuestions*100} 
                        showInfo={true} 
                        type="circle" 
                        format={p => `${Math.round(p*100)/100}% Correct`} 
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </Layout.Content>
                
            </Layout>
        )
    }
}

export default Quiz