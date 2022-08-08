import React from 'react';
import ReactDOM from 'react-dom';

import Papa from 'papaparse';

import Card from '../Card';

import './styles.css';

import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

export default class Uploader extends React.Component
{
    constructor()
    {
        super();

        this.fileRef = React.createRef();

        this.state =
        {
            jsonFiles : ["No .json found"],
            htmlFiles : ["No .html found"],
            csvFiles : ["No .csv found"],
            cssFiles : ["No .css found"],
            selectedJson : "",
            selectedHtml : "",
            selectedCss : "",
            selectedCsv : "",
         };

         this.downloadRef = React.createRef();
    }

    filesSet(e)
    {
        var files = e.target.files;

        var jsons = [];
        var htmls = [];
        var csvs = [];
        var csss = [];
        var pngs = [];

        for (var i = 0, f; (f = files[i]); i++)
        {
            if (f.name.endsWith(".json"))
            {
                jsons.push(f);
            }
            else if (f.name.endsWith('.html'))
            {
                htmls.push(f);
            }
            else if (f.name.endsWith('.csv'))
            {
                csvs.push(f);
            }
            else if (f.name.endsWith('.css'))
            {
                csss.push(f);
            }
            else if (f.name.endsWith('.png'))
            {
                pngs.push(f);
            }
        }

        if (jsons.length == 0) jsons.push("");
        if (htmls.length === 0) htmls.push("");
        if (csvs.length === 0) csvs.push("");
        if (csss.length === 0) csss.push("");

        
        var imageUrls = {};

        for (i = 0; i < pngs.length; i++)
        {
            var file = pngs[i];

            var path = file.webkitRelativePath;
            var index = path.indexOf('/');

            path = path.substring(index + 1, path.length);

            var url = URL.createObjectURL(file);

            imageUrls[path] = url;
        }

        this.setState({
            jsonFiles:jsons,
            htmlFiles:htmls,
            csvFiles:csvs,
            cssFiles:csss,
            selectedJson: jsons[0],
            selectedHtml:htmls[0],
            selectedCss:csss[0],
            selectedCsv:csvs[0],
            
            images:imageUrls,
        });
    }

    componentDidMount()
    {
        var input = ReactDOM.findDOMNode(this.fileRef.current).firstChild;
        input.directory = true;
        input.webkitdirectory = true;
        input.multiple = true;
    }

    componentDidUpdate(oldProps, oldState)
    {
        if (this.state.images !== oldState.images ||
            this.state.html !== oldState.html ||
            this.state.css !== oldState.css ||
            this.state.csv !== oldState.csv ||
            this.state.json !== oldState.json)
        {
            this.props.selectionChanged({
                images: this.state.images,
                html: this.state.html,
                css: this.state.css,
                csv: this.state.csv,
                json: this.state.json
            });
        }

        if (this.state.selectedJson !== oldState.selectedJson)
        {
            this.processJson();   
        }

        if (this.state.selectedHtml !== oldState.selectedHtml)
        {
            this.processHtml();   
        }
        
        if (this.state.selectedCss !== oldState.selectedCss)
        {
            this.processCss();   
        }
        
        if (this.state.selectedCsv !== oldState.selectedCsv)
        {
            this.processCsv();   
        }
    }

    jsonSet(e)
    {
        this.setState({selectedJson:e.target.value});
    }

    processJson()
    {
        var selected = this.state.selectedJson;
        var reader = new FileReader();

        reader.onload = file =>
        {
            if (this.state.selectedJson === selected)
            {
                this.setState({ json:JSON.parse(file.target.result)});
            }
        };

        reader.readAsText(selected);
    }

    htmlSet(e)
    {
        this.setState({selectedHtml:e.target.value});
    }

    processHtml()
    {
        var selected = this.state.selectedHtml;
        var reader = new FileReader();

        reader.onload = file =>
        {
            if (this.state.selectedHtml === selected)
            {
                this.setState({html:file.target.result});
            }
        };

        reader.readAsText(selected);
    }

    cssSet(e)
    {
        this.setState({selectedCss:e.target.value});
    }

    processCss()
    {
        var selected = this.state.selectedCss;
        var reader = new FileReader();

        reader.onload = file =>
        {
            if (this.state.selectedCss === selected)
            {
                this.setState({css:file.target.result});
            }
        };

        reader.readAsText(selected);
    }

    csvSet(e)
    {
        this.setState({selectedCsv:e.target.value});
    }

    processCsv()
    {
        var selected = this.state.selectedCsv;
        var reader = new FileReader();

        reader.onload = file =>
        {
            if (this.state.selectedCsv === selected)
            {
                var parsed = Papa.parse(file.target.result.trim(), {header:true});
                
                this.setState({csv:parsed.data});
            }
        };

        reader.readAsText(selected);
    }

    refresh()
    {
        this.processJson();
        this.processHtml();
        this.processCss();
        this.processCsv();
    }

    save()
    {
        var csv = Papa.unparse(this.state.content.csv, {header:true});

        let data = new Blob([csv], { type : 'text/csv;charset=utf-8;' });

        let url =  window.URL.createObjectURL(data);

        this.downloadRef.current.download = this.state.selectedCsv.name;
        this.downloadRef.current.href = url;
        this.downloadRef.current.click();

        window.URL.revokeObjectURL(url)
    }

    render()
    {
       return (
           <div className="uploader">
                <Input ref={this.fileRef} type="file" multiple onChange={this.filesSet.bind(this)}/>
                <Select value={this.state.selectedJson} onChange={this.jsonSet.bind(this)}>
                    {this.state.jsonFiles.map(item => { return (<MenuItem key={item.name} value={item}>{item.name}</MenuItem>)})}
                </Select>
                <Select value={this.state.selectedHtml} onChange={this.htmlSet.bind(this)}>
                    {this.state.htmlFiles.map(item => { return (<MenuItem key={item.name} value={item}>{item.name}</MenuItem>)})}
                </Select>
                <Select value={this.state.selectedCss} onChange={this.cssSet.bind(this)}>
                    {this.state.cssFiles.map(item => <MenuItem key={item.name} value={item}>{item.name}</MenuItem>)}
                </Select>
                <Select value={this.state.selectedCsv} onChange={this.csvSet.bind(this)}>
                    {this.state.csvFiles.map(item => <MenuItem key={item.name} value={item}>{item.name}</MenuItem>)}
                </Select>
                <Button onClick={this.refresh.bind(this)}>Refresh</Button>
                <Button onClick={this.save.bind(this)}>Save</Button>
                <a ref={this.downloadRef} download hidden/>
           </div>
        );
    }
}