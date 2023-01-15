import React from 'react';
import ReactDOM from 'react-dom/client';
import * as echarts from 'echarts';
import {selectOptions} from "@testing-library/user-event/dist/select-options";


class FilterMenu extends React.Component {
    constructor(props) {
        super(props);
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
            display_data: {},
            chart_mode: false
        }
        this.query_series();
    }

    render() {
        return (
            <div>
                {/*click the create report will change to the filter site*/}
                <div style={{margin: "1em", padding: "1em"}}>
                    <button className={"btn btn-primary"} style={{width: "10em", height: "4em", fontSize: "1em",
                        position: "relative", left: "-3em"}}
                            onClick={() => this.setState({chart_mode: false})}>
                        Create report
                    </button>
                </div>
                <div style={{borderRadius: "10px", padding: "2em", backgroundColor: "#aacccc"}}>
                    <div style={{display: this.state.chart_mode ? "none" : "block"}}>
                        <div style={{fontsize: "15px", margin: "1em"}}>Filter your time series</div>
                        <div style={{borderRadius: "10px", backgroundColor: "#ffffff"}}>
                            <div style={{display: "flex", flexDirection: "row", padding: "1em"}}>
                                {/* select discpline with updates filter */}
                                <label style={{margin: "1em", minWidth: "10em"}}>Discipline:</label>
                                <select id={"select_discipline"} style={{margin: "1em", minWidth: "10em"}}
                                        onChange={(e) => {
                                            this.update_selection("discipline");
                                        }}>
                                    {this.state.current_options.disciplines.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", padding: "1em"}}>
                                <label style={{margin: "1em", minWidth: "10em"}}>Space:</label>
                                <select id={"select_space"} style={{margin: "1em", minWidth: "10em"}}
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
                                <select id={"select_athlete_id"} style={{margin: "1em", minWidth: "10em"}}
                                        onChange={(e) => {
                                            this.update_selection("athlete_id");
                                        }}>
                                    {this.state.current_options.athlete_ids.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "right", padding: "1em"}}>
                            <button style={{fontSize: "16px"}} onClick={() => this.confirm_filter()}>Confirm</button>
                        </div>
                    </div>
                    {/* if we confirm our filter we can select the type of chart and the corresponding seried id for the filter */}
                    <div style={{display: this.state.chart_mode ? "block" : "none"}}>
                        <div style={{display: "flex", fontSize: "14px"}}>
                            <div>
                                <label style={{margin: "1em"}}>Chart type</label>
                                <select id={"chart_type_select"} style={{margin: "1em"}}
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
                                <select id={"series_id_select"} style={{margin: "1em"}}
                                        onClick={e => {
                                            this.setState({current_series_id: e.target.value});
                                            this.draw_chart(e.target.value, this.state.current_chart_type)}
                                        }>
                                    {this.state.current_series_ids.map((v, k) =>
                                        <option value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div id={"chart-container"} style={{width: "600px", height: "500px",
                            display: this.state.current_chart_type === "table"?"none":"block"}}/>
                        <div id={"table-container"}/>
                    </div>
                </div>
            </div>
        );
    }

    get_selected_value(selector_id) {
        const e = document.getElementById(selector_id);
        console.log(e);
        console.log(e.value);
        return e.value;
    }

    // query the information from the api 

    query_series() {
        fetch("http://localhost:5000/time_series").then(res => res.json()).then(res => {
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
        let series_data = await fetch("http://localhost:5000/time_series/" + series_id.toString())
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
        console.log("x_labels: ", x_labels);
        console.log("data: ", data_list);
        const chart = echarts.init(document.getElementById('chart-container'));
        chart.clear()
        document.getElementById('table-container').innerHTML = "";
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
                    }
                ]
            });
        } else if (chart_type === "line") {
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
                        type: 'line',
                        data: data_list
                    }
                ]
            });
        } else if (chart_type === "swarm") {
            let scatter_data = [];
            for (const i in data_list) scatter_data.push([parseInt(i), data_list[i]]);
            console.log("Scatter:", scatter_data);
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
                        symbolSize: 20,
                        data: scatter_data,
                        type: 'scatter'
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
                    <h3>{'Report for athlete id:' + series_data.athlete_id.toString() + " of " +
                        series_data.discipline + " (" + series_data.space + ")"}</h3>
                    <table style={table_style}>
                        <tr>
                            <th style={td_style}>Date</th>
                            <th style={td_style}>Value</th>
                        </tr>
                        {[...data_list.keys()].map(
                            (i)=><tr>
                                <td style={td_style}>{x_labels[i]}</td><td style={td_style}>{data_list[i]}</td>
                            </tr>)}
                    </table>
                </div>
            const root = ReactDOM.createRoot(document.getElementById("table-container"));
            root.render(table_content);
        }
    }
}

const root = ReactDOM.createRoot(document.getElementById("main-container"));
root.render(<FilterMenu/>);
