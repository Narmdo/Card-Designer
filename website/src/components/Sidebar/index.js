import React from 'react';

import Card from '../Card';

import './styles.css';

export default class Sidebar extends React.Component
{
    render()
    {
        return (this.props.selected === undefined ? <div className="App-sidebar"/> :
            <div className="App-sidebar">
                <Card data={this.props.selected} html={this.props.files.html} images={this.props.files.images}/>
                <div className="sidebar-fields">
                    {Object.keys(this.props.selected).map((key) => 
                    <div className="sidebar-field">
                        <h1>{key}</h1>
                        <p dangerouslySetInnerHTML={{__html:this.props.selected[key]}}/>
                    </div>)}
                </div>
            </div>);
    }
}