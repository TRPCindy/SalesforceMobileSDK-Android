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

var Styles = require('./Styles.js');
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');

class MainPage extends Component {

  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }

  // CINDY: have a section on top that's 'Overdue'
  // below that is 'Due Today'
  // below that is 'Due Later'
  // have a red flag beside Priority tasks

  renderScene(route, navigator) {
    var that = this;
    return (
      <View style={{flex: 1}}>
          <Text style={Styles.textStyle}>Welcome {that.props.userName}!</Text>
          <ListView style={Styles.scene}
              dataSource={this.props.dataSource}
              renderRow={this.renderRow} />
      </View>
    );
  }

  renderRow(rowData: Object) {
      return (
        <View>
            <View style={Styles.row}>
              <Text numberOfLines={1} style={Styles.textStyle}>
               {rowData['Subject']}
              </Text>
            </View>
            <View style={Styles.cellBorder} />
        </View>
      );
    }
}

module.exports = MainPage;