'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  ListView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;

var RNChart = require('react-native-chart');

var Styles = require('./Styles.js');
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');

const chartData = [
    {
        name: 'BarChart',
        type: 'bar',
        color:'purple',
        widthPercent: 0.6,
        data: [30, 1, 1, 2, 3, 5, 21, 13, 21, 34, 55, 30],
    },
    {
        name: 'LineChart',
        color: 'gray',
        lineWidth: 2,
        highlightIndices: [1, 2],   // The data points at indexes 1 and 2 will be orange
        highlightColor: 'orange',
        showDataPoint: true,
        data: [10, 12, 14, 25, 31, 52, 41, 31, 52, 66, 22, 11],
    }
];

const xLabels = ['0','1','2','3','4','5','6','7','8','9','10','11'];

class MetricsPage extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={Styles.chartContainer}>
          <RNChart style={Styles.chart}
              chartData={chartData}
              verticalGridStep={5}
              xLabels={xLabels}
           />
      </View>
    );
  }
}

module.exports = MetricsPage;