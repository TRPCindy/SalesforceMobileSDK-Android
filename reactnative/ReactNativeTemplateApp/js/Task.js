'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  ListView,
  ScrollView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;

var Styles = require('./Styles.js');
var forceClient = require('./react.force.net.js');
var GiftedSpinner = require('react-native-gifted-spinner');
var Icon = require('react-native-vector-icons/MaterialIcons');

var TaskInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows([]),
        loaded: false
    };
  },

  componentWillMount: function() {
    var that = this;
    var soql = 'SELECT Subject,ActivityDate,Priority,Description FROM Task WHERE Id = \''
      +that.props.taskId+'\'';
    forceClient.query(soql,
      function(response) {
          if (response.records.length > 0) {
            var fields = response.records[0];
            var data = [];
            for (var i in fields) {
                if (typeof fields[i] !== 'object') {
                  data.push(i+': '+fields[i]);
                }

            }

            that.setState({
                dataSource: that.getDataSource(data),
                loaded: true
            });
          }
      });
    },

    getDataSource: function(users: Array<any>): ListViewDataSource {
        return this.state.dataSource.cloneWithRows(users);
    },

    render: function() {
        if (!this.state.loaded) {
          return(
            <View style={{flex:1,
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center'}}>
              <GiftedSpinner/>
            </View>
          );
        }
        return (
          <View style={Styles.scene}>
            <ScrollView>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow} />
            </ScrollView>
          </View>
      );
    },

    renderRow: function(rowData: Object) {
        if (rowData.substring(0,7) === 'Subject') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='subject' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(9)}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else if (rowData.substring(0,12) === 'ActivityDate') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='date-range' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(14)}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else if (rowData.substring(0,8) === 'Priority') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='priority-high' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(10)}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else if (rowData.substring(0,11) === 'Description') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='description' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(13)}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else {
            return (
              <View>
                  <View style={Styles.row}>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                        {rowData}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        }
    }
});

class Task extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <TaskInfo navigator={this.props.navigator} taskId={this.props.taskId}/>
    );
  }
}

module.exports = Task;
