import React from 'react';

import './styles.css';

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

export default class Card extends React.Component
{
    componentWillMount()
    {
        this.handleProps(this.props);
    }

    componentWillReceiveProps(newProps)
    {
        this.handleProps(newProps);
    }

    handleProps(newProps)
    {
        var html = newProps.html;

        var pattern = /{{[^|{}]*?}}/g;

        html = html.replace(pattern, (a, b) =>
        {
            var noBrackets = a.substring(2, a.length - 2);

            var replace = newProps.data[noBrackets];

            return replace;
        });

        var pattern = /{{[\s\S]*?}}/g;

        html = html.replace(pattern, (a, b) =>
        {
            var noBrackets = a.substring(2, a.length - 2);

            var split = noBrackets.split('|');

            var replace = newProps.data[split[0]];

            if (split.length == 1)
            {
                return replace;
            }
            else if (replace)
            {   
                return split[1];
            }
            else if (split.length > 2)
            {
                return split[2];
            }
        });

        pattern = /".*?"/g;

        html = html.replace(pattern, (a, b) =>
        {
            var noQuotes = a.substring(1, a.length - 1);
            var replace = newProps.images[noQuotes];

            if (replace !== undefined)
            {
                return replace;
            }

            return a;
        });

        this.setState({html:html});
    }

    componentDidMount()
    {
        this.refs.content.innerHTML = this.state.html;
    }

    componentDidUpdate()
    {
        this.refs.content.innerHTML = this.state.html;
    }

    render()
    {
        return <div className={this.props.isSelected ? "cardContainer selected" : "cardContainer"} ref="content" onClick={this.props.onClick}/>;
    }
}