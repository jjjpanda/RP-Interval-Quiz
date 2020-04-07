import React from 'react'

import * as Tone from "tone";

//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth().toMaster();

//play a middle 'C' for the duration of an 8th note


class Start extends React.Component{
    render() {
        synth.triggerAttackRelease("C4", "8n");
        return (
            <div>Start</div>
        )
    }
}

export default Start