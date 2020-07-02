import React, { Component } from 'react';

class About extends Component {
    render() {
        return (
            <div>
                <h2>About this Algorithm:</h2>
                <p>
                    <strong>Origins</strong>
                </p>
                <p>John von Neumann defined life as a creation which can simulate a Turing machine. Von Neumann pursued a solution which would use electromagnetic components floating randomly in liquid or gas but turned out not to be realistic with the technology available at the time. Stanislaw Ulam invented cellular automata which was intended to simulate von Neumann's electromagnetic constructions.</p>
                <p>John Conway experimented with a variety of different 2D cellular automation rules. His goal was to define an interesting yet unpredictable automation. For example, he wanted some configurations to last for a long time before dying and other configurations to go on forever.</p>
            </div>
        );
    }
}

export default About;
