import React from 'react';

import Card from '../Card';

import './styles.css';

export default class CardsDisplay extends React.Component
{
    componentWillMount()
    {
        this.processProps(this.props);
    }

    componentWillReceiveProps(newProps)
    {
        this.processProps(newProps);
    }

    processProps(newProps)
    {
        var pattern = /".*?"/g;

        var processedCss = newProps.files.css.replace(pattern, (a, b) =>
        {
            var noQuotes = a.substring(1, a.length - 1);
            var replace = newProps.files.images[noQuotes];

            if (replace !== undefined)
            {
                return replace;
            }

            return a;
        });

        if (newProps.files.json)
        {
            let variables = ":root{";

            for (var property in newProps.files.json)
            {
                variables += '--' + property + ' : ' + newProps.files.json[property] + ';\n';
            }

            variables += "}\n\n";
        
            processedCss = variables + processedCss;
        }

        this.setState({css:processedCss});
    }

    select(card)
    {
        this.setState({selected: card});

        this.props.selectionChanged(card);
    }

    render()
    {
        var id = 0;

        return (
        <div className="cardsDisplay">
            <style>{this.state.css}</style>
            {this.props.files.csv.map(item => <Card key={id++} isSelected={this.state.selected !== undefined && this.state.selected.Name == item.Name} onClick={() => this.select(item)} data={item} html={this.props.files.html} images={this.props.files.images}/>)};
        </div>);
    }
}