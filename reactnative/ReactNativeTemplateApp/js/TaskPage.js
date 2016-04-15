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
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');
var GiftedSpinner = require('react-native-gifted-spinner');

var TaskList = React.createClass({
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows([]),
        loaded: false
      };
    },
    
    componentWillMount: function() {
      var that = this;
      var soql = 'SELECT Id,Subject FROM Task WHERE OwnerId = \''
          +that.props.userId+ '\' and IsClosed = false and Type = \''+that.props.type
          +'\' and ActivityDate ';
      if (that.props.status === 'Overdue Tasks') {
        soql += '< TODAY';
      } else if (that.props.status === 'Due Today') {
        soql += '= TODAY';
      } else if (that.props.status === 'Due Later') {
        soql += '> TODAY';
      }
      forceClient.query(soql,
        function(response) {
            var dataSource = response.records;
            console.log(response);
            that.setState({
                dataSource: that.state.dataSource.cloneWithRows(dataSource),
                loaded: true
            });
        }
      );
    },

    render: function() {
      var that = this;
      if (!that.state.loaded) {
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
            <ListView style={{flex: 1}}
                dataSource={that.state.dataSource}
                renderRow={this.renderRow} />
          </ScrollView>
        </View>
      );
    },

    renderRow: function(rowData: Object) {
        var that = this;
        return (
          <View>
              <TouchableHighlight
                style={Styles.row}
                onPress={() => {
                  that.props.navigator.push({
                    id: 'Task',
                    name: 'Task Details',
                    passProps: {taskId: rowData['Id']}
                  })
                }}>
                <ScrollView horizontal={true} contentContainerStyle={Styles.rowNoPad}>
                  <Text numberOfLines={1} style={Styles.textStyle} >
                   {rowData['Subject']}
                  </Text>
                </ScrollView>
              </TouchableHighlight>
              <View style={Styles.cellBorder} />
          </View>
        );
    }
});

class TaskPage extends Component {

  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }

  // CINDY: have a red flag beside Priority tasks
  renderScene(route, navigator) {
    var that = this;
    return(
      <TaskList navigator={that.props.navigator} userId={that.props.userId} type={that.props.type} status={that.props.status} />
      );
  }
}

module.exports = TaskPage;