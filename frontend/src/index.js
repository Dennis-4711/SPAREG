import React from 'react';
import ReactDOM from 'react-dom/client';
import * as echarts from 'echarts';
import {selectOptions} from "@testing-library/user-event/dist/select-options";
import Button from '@mui/material/Button';



class ReportPanel extends React.Component {
    constructor(props) {
        super(props);
        this.elem_id = props.id;
        this.state = {
            series_meta: {},
            full_options: null,
            current_options: {
                disciplines: ["Any"],
                spaces: ["Any"],
                athlete_ids: ["Any"]
            },
            current_series_ids: [],
            current_series_id: [],
            current_chart_type: "bar",
            current_info: {
                sum: null,
                avg: null
            },
            display_data: {},
            chart_mode: false
        }
        this.query_series();
    }

    render() {
        return (
            <div>
                 {/*click the create report will change to the filter site*/}
                <div style={{borderRadius: "10px", padding: "2em", backgroundColor: "#aacccc"}}>
                    <div style={{display: this.state.chart_mode ? "none" : "block"}}>
                        <div style={{fontsize: "15px", margin: "1em"}}>Filter your time series</div>
                        <div style={{borderRadius: "10px", backgroundColor: "#ffffff"}}>
                            <div style={{display: "flex", flexDirection: "row", padding: "1em"}}>
                                <label style={{margin: "1em", minWidth: "10em"}}>Discipline:</label>
                                <select id={"select_discipline" + this.elem_id.toString()} style={{margin: "1em", minWidth: "10em"}}
                                        onChange={(e) => {
                                            this.update_selection("discipline");
                                        }}>
                                    {this.state.current_options.disciplines.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", padding: "1em"}}>
                                <label style={{margin: "1em", minWidth: "10em"}}>Space:</label>
                                <select id={"select_space" + this.elem_id.toString()} style={{margin: "1em", minWidth: "10em"}}
                                        onChange={(e) => {
                                            this.update_selection("space");
                                        }}>
                                    {this.state.current_options.spaces.map((v, k) =>
                                        <option value={v}>{v}</option>
                                    )}
                                </select>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", padding: "1em"}}>
                                <label style={{margin: "1em", minWidth: "10em"}}>Athlete id:</label>
                                <select id={"select_athlete_id" + this.elem_id.toString()} style={{margin: "1em", minWidth: "10em"}}
                                        onChange={(e) => {
                                            this.update_selection("athlete_id");
                                        }}>
                                    {this.state.current_options.athlete_ids.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "right", padding: "1em"}}>
                            <Button variant="contained" style={{fontSize: "16px",backgroundColor:"blue"}} onClick={() => this.confirm_filter()}>Confirm</Button>
                        </div>
                    </div>
                    {/* if we confirm our filter we can select the type of chart and the corresponding seried id for the filter */}
                    <div style={{display: this.state.chart_mode ? "block" : "none"}}>
                        <div style={{display: "flex", fontSize: "14px"}}>
                            <div>
                                <label style={{margin: "1em"}}>Element type</label>
                                <select id={"chart_type_select" + this.elem_id.toString()} style={{margin: "1em"}}
                                        onClick={e => {
                                            this.setState({current_chart_type: e.target.value});
                                            this.draw_chart(this.state.current_series_id, e.target.value)}}>
                                    <option value={"bar"}>Bar Chart</option>
                                    <option value={"line"}>Line Chart</option>
                                    <option value={"swarm"}>Swarm Chart</option>
                                    <option value={"table"}>Table</option>
                                </select>
                            </div>
                            <div>
                                <label style={{margin: "1em"}}>Series id</label>
                                <select id={"series_id_select" + this.elem_id.toString()} style={{margin: "1em"}}
                                        onClick={e => {
                                            this.setState({current_series_id: e.target.value});
                                            this.draw_chart(e.target.value, this.state.current_chart_type)}
                                        }>
                                    {this.state.current_series_ids.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div id={"chart-container-" + this.elem_id.toString()} style={{width: "700px", height: "500px",
                                display: this.state.current_chart_type === "table"?"none":"block"}}/>
                            <div id={"table-container-" + this.elem_id.toString()} style={{margin: "2em"}}/>
                            <div >
                                <div id={"infobox" + this.elem_id.toString()}
                                     style={{width: "10em", border: "1px solid #228877", borderRadius: "5px",margin:"0.1em"}}>
                                    <div style={{margin: "1em"}}>Total: {this.state.current_info.sum}</div>
                                    <div style={{margin: "1em"}}>Average: {this.state.current_info.avg}</div>
                                    <div style={{margin: "1em"}}>Target: {Math.round(this.state.display_data.targetValue*100)/100}</div>
                                </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    get_selected_value(selector_id) {
        const e = document.getElementById(selector_id + this.elem_id.toString());
        console.log(e);
        console.log(e.value);
        return e.value;
    }
    // query the information from the api 

    query_series() {
        fetch("http://127.0.0.1:5000/time_series").then(res => res.json()).then(res => {
            const series_meta = res;
            console.log(series_meta);
            this.setState({series_meta: series_meta});

            let selection = JSON.parse(JSON.stringify(this.state.current_options));
            for (const i in series_meta) {
                if (!selection.athlete_ids.includes(series_meta[i].athlete_id))
                    selection.athlete_ids.push(series_meta[i].athlete_id);
                if (!selection.disciplines.includes(series_meta[i].discipline))
                    selection.disciplines.push(series_meta[i].discipline);
                if (!selection.spaces.includes(series_meta[i].space))
                    selection.spaces.push(series_meta[i].space);
            }

            this.setState({current_options: selection});
            this.setState({full_options: JSON.parse(JSON.stringify(selection))}, ()=>{
                this.update_selection("discipline")
            });

        })
    }

    update_selection(key) {
        let available_options = {
            disciplines: ["Any"],
            spaces: ["Any"],
            athlete_ids: ["Any"]
        };
        const key_list = ["discipline", "space", "athlete_id"];
        const order = key_list.indexOf(key);
        console.log("Current key/order: ", key, order);
        console.log("Current options: ", this.state.current_options);
        // For example, if the 'space' option is updated, then we must update the options of athlete_ids,
        // given the selected 'disciplines' and 'spaces' as condition.

        let current_selection = {};

        // First, add previous options.
        for (let i = 0; i <= order; i++) {
            const key = key_list[i];
            const option_key = key + "s";
            current_selection[key] = this.get_selected_value("select_" + key);
            available_options[option_key] = this.state.current_options[option_key];
        }

        console.log("Available options before check:", available_options);

        let satisfy = function (data, key_pos) {
            for (let i = 0; i <= key_pos; i++) {
                const key = key_list[i];
                if (current_selection[key] !== "Any" && data[key] !== current_selection[key]) return false;
            }
            return true;
        }

        let next_key_idx = order + 1;

        while(next_key_idx < 3) {
            const next_key = key_list[next_key_idx];
            const next_option_key = next_key + "s";
            for (const i in this.state.series_meta) {
                const data = this.state.series_meta[i];
                if (satisfy(data, next_key_idx - 1)) {
                    if (!available_options[next_option_key].includes(data[next_key]))
                        available_options[next_option_key].push(data[next_key]);
                }
            }
            current_selection[next_key] = available_options[next_option_key][0];
            next_key_idx += 1;
        }
        this.setState({current_options: available_options});
    }


// through the information that we filter from discipline, space and athlete id we receive our series id
    confirm_filter() {
        const select_discipline = this.get_selected_value("select_discipline");
        const select_space = this.get_selected_value("select_space");
        const select_athlete_id = this.get_selected_value("select_athlete_id");
        // console.log(select_discipline, select_space, select_athlete_id);
        let series_ids = [];
        for (const i in this.state.series_meta) {
            const data = this.state.series_meta[i];
            if ((select_discipline === "Any" || data.discipline === select_discipline) &&
                (select_space === "Any" || data.space === select_space) &&
                (select_athlete_id === "Any" || data.athlete_id.toString() === select_athlete_id)) {
                series_ids.push(data.series_id);
            }
        }

        console.log(series_ids);

        if (series_ids.length === 0) {
            alert("No series found.");
            return;
        }

        // const query_url = "http://127.0.0.1:5000/time_series?" + encodeURIComponent(
        //     "athletes[]=" + select_athlete_id + "&disciplines[]=" + select_discipline + "&spaces[]=" + select_space)

        this.setState({current_series_ids: series_ids, current_series_id: series_ids[0], chart_mode: true});
        this.draw_chart(series_ids[0], "bar");
    }
    // draw the chart with echart libary
    async draw_chart(series_id, chart_type) {
        let series_data = await fetch("http://127.0.0.1:5000/time_series/" + series_id.toString())
        series_data = await series_data.json();
        series_data = series_data[0];
        console.log("Series data: ", series_data);
        this.setState({display_data: series_data});
        let x_labels = [];
        let data_list = [];
        for (const i in series_data.vector) {
            const item = series_data.vector[i];
            x_labels.push(item.timestamp.slice(0, 8));
            data_list.push(item.value);
        }
        let sum = 0;
        for (const d of data_list) {
            sum += d;
        }
        //sum = Math.round(sum*100)/sum

        this.setState({
            current_info: {
                sum: sum.toFixed(2),
                avg: (sum / data_list.length).toFixed(2)
            }
        })

        let targetValue = [];
        for (const i in series_data.vector) {
            targetValue.push(series_data.targetValue);
        }


        console.log("x_labels: ", x_labels);
        console.log("data: ", data_list);

        const chart = echarts.init(document.getElementById('chart-container-' + this.elem_id.toString()));
        chart.clear()
        document.getElementById('table-container-' + this.elem_id.toString()).innerHTML = "";
        if (chart_type === "bar") {
            chart.setOption({
                title: {
                    text: 'Report for athlete id:' + series_data.athlete_id.toString() + " of " +
                        series_data.discipline + " (" + series_data.space + ")"
                },
                tooltip: {},
                xAxis: {
                    data: x_labels
                },
                yAxis: {},
                series: [
                    {
                        name: series_data.discipline + " (" + series_data.space + ")",
                        type: 'bar',
                        data: data_list
                    },
                    {
                        name: "Target",
                        type: "line",
                        lineStyle: {type: "dashed", color: "red"},
                        data: targetValue
                    }
                ]
            });
        } else if (chart_type === "line") {
            chart.setOption({
                title: {
                    text: 'Report for athelete id:' + series_data.athlete_id.toString() + " of " +
                        series_data.discipline + " (" + series_data.space + ")"
                },
                tooltip: {},
                xAxis: {
                    data: x_labels
                },
                yAxis: {},
                series: [
                    {
                        name: series_data.discipline + " (" + series_data.space + ")",
                        type: 'line',
                        data: data_list
                    },
                    {
                        name: "Target",
                        type: "line",
                        lineStyle: {type: "dashed", color: "red"},
                        data: targetValue
                    }
                ]
            });
        } else if (chart_type === "swarm") {
            let scatter_data = [];
            for (const i in data_list) scatter_data.push([parseInt(i), data_list[i]]);
            console.log("Scatter:", scatter_data);
            chart.setOption({
                title: {
                    text: 'Report for athelete id:' + series_data.athlete_id.toString() + " of " +
                        series_data.discipline + " (" + series_data.space + ")"
                },
                tooltip: {},
                xAxis: {
                    data: x_labels
                },
                yAxis: {},
                series: [
                    {
                        symbolSize: 20,
                        data: scatter_data,
                        type: 'scatter'
                    },
                    {
                        name: "Target",
                        type: "line",
                        lineStyle: {type: "dashed", color: "red"},
                        data: targetValue
                    }
                ]
            });
        } else {
            const table_style = {
                borderCollapse: "collapse",
                width: "100%"
            }
            const td_style = {
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "1em"
            }
            let table_content =
                <div>
                    <h3>{'Report for athelete id:' + series_data.athlete_id.toString() + " of " +
                        series_data.discipline + " (" + series_data.space + ")"}</h3>
                    <table style={table_style}>
                        <tr>
                            <th style={td_style}>Date</th>
                            <th style={td_style}>Value</th>
                            <th style={td_style}>Diff (value-target value)</th>
                        </tr>
                        {[...data_list.keys()].map(
                            (i)=><tr>
                                <td style={td_style}>{x_labels[i]}</td><td style={td_style}>{data_list[i]}</td>
                                <td style={{...td_style,color:data_list[i]-series_data.targetValue<0?'red':'blue'}}>
                                {Math.round((data_list[i]-series_data.targetValue)*100)/100}
                                </td>
                            </tr>)}
                    </table>
                </div>
            const root = ReactDOM.createRoot(document.getElementById("table-container-" + this.elem_id.toString()));
            root.render(table_content);
        }
    }
}


class PageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panels: []
        }
    }

    render() {
        return <div style={{margin: "1em", padding: "1em", minWidth: "50em"}}>
            <Button className={"btn btn-primary"} style={{margin: "1em", width: "10em", height: "4em", fontSize: "1em",
                position: "relative", left: "-3em", color:"#aacccc", border:"1px solid #aacccc"}}
                    onClick={() => {
                        let panels = this.state.panels;
                        panels.push({html: <ReportPanel id={panels.length}/>, state: 0})
                        this.setState({panels: panels});
                    }}>
                Add Element
            </Button>
            <div id={"panel-container"}>
                {this.state.panels.map((v,i)=><div style={{margin: "1em", padding: "1em"}}>
                    {v.html}
                    <div style={{padding: "1em", display: "flex"}}>
                        <Button variant="contained" style={{display: this.state.panels[i].state === 0?'block':'none', fontSize: "10px",backgroundColor:"#aacccc"}} onClick={
                            ()=>{
                                let panels = this.state.panels;
                                panels[i].state = 1;
                                this.setState({panels: panels});
                            }
                        }>
                            Add text
                        </Button>
                        <div style={{display: this.state.panels[i].state === 0?'none':'block'}} >
                            <textarea  style={{width: "1000px", height:"10vh",fontSize: "22px", boxShadow: "none",
                                border: this.state.panels[i].state === 1?"1px solid grey":"none",borderRadius:"12px",marginLeft:"-15px"}}
                                readOnly={this.state.panels[i].state === 2}/>
                            <div>
                            <Button variant="contained" style={{fontSize: "10px",backgroundColor:"#aacccc"}} onClick={
                                ()=>{
                                    let panels = this.state.panels;
                                    if (panels[i].state === 1) panels[i].state = 2;
                                    else if (panels[i].state === 2) panels[i].state = 1;
                                    this.setState({panels: panels});
                                }
                            }>{this.state.panels[i].state === 1?"Save":"Edit"}</Button>
                            <Button variant="contained"  style={{fontSize: "10px", backgroundColor:"red"}} onClick={
                                ()=>{
                                    let panels = this.state.panels;
                                    panels[i].state = 0;
                                    this.setState({panels: panels});
                                }
                            }>Close</Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="contained" style={{backgroundColor: "red"}} onClick={
                        ()=>{
                            let panels = this.state.panels;
                            panels = panels.splice(0, i);
                            this.setState({panels: panels})
                        }
                    }>
                        Remove Element
                    </Button>
                </div>)}
            </div>
        </div>
    }
}



const root = ReactDOM.createRoot(document.getElementById("main-container"));
root.render(<PageContainer/>);
