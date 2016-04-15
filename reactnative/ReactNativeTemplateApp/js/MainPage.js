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
        overdueSummary: ds.cloneWithRows([]),
        todaySummary: ds.cloneWithRows([]),
        futureSummary: ds.cloneWithRows([]),
        authenticated: false,
        loaded: false
      };
    },
    
    componentWillMount: function() {
      var that = this;
      oauth.authenticate(
          function() {
              that.setState({authenticated:true});
              oauth.getAuthCredentials(function (resp){
                  that.setState({userId: resp['userId']});
                  var typesOverdue = {};
                  var typesToday = {};
                  var typesFuture = {};
                  var soql = 'SELECT Id,Type,Subject,ActivityDate FROM Task WHERE OwnerId = \''
                    +that.state.userId+ '\' and IsClosed = false and ActivityDate != null';
                  forceClient.query(soql,
                    function(response) {
                        var todayStart = new Date();
                        todayStart.setHours(0,0,0,0);
                        var todayEnd = new Date();
                        todayEnd.setHours(23,59,59,999);
                        console.log(todayStart);
                        response.records.forEach(function(item) {
                          var curType = item['Type'];
                          var curDate = item['ActivityDate'];
                          var month = parseInt(curDate.substring(5,7))-1;
                          var taskDate = new Date(curDate.substring(0,4),
                            month, curDate.substring(8,10));

                          if (taskDate < todayStart) {
                            if (typesOverdue.hasOwnProperty(curType)) {
                              typesOverdue[curType]++;
                            } else {
                              typesOverdue[curType] = 1;
                            }
                          } else if (taskDate > todayEnd) {
                            if (typesFuture.hasOwnProperty(curType)) {
                              typesFuture[curType]++;
                            } else {
                              typesFuture[curType] = 1;
                            }
                          } else {
                            if (typesToday.hasOwnProperty(curType)) {
                              typesToday[curType]++;
                            } else {
                              typesToday[curType] = 1;
                            }
                          }
                        });
                        var overdueSummary = [];
                        var todaySummary = [];
                        var futureSummary = [];
                        for (var cur in typesOverdue) {
                          var obj = {};
                          obj.type = cur;
                          obj.count = typesOverdue[cur];
                          obj.status = 'Overdue Tasks';
                          overdueSummary.push(obj);
                        }
                        for (var cur in typesToday) {
                          var obj = {};
                          obj.type = cur;
                          obj.count = typesToday[cur];
                          obj.status = 'Due Today';
                          todaySummary.push(obj);
                        }
                        for (var cur in typesFuture) {
                          var obj = {};
                          obj.type = cur;
                          obj.count = typesFuture[cur];
                          obj.status = 'Due Later';
                          futureSummary.push(obj);
                        }
                        that.setState({
                            overdueSummary: that.state.overdueSummary.cloneWithRows(overdueSummary),
                            todaySummary: that.state.todaySummary.cloneWithRows(todaySummary),
                            futureSummary: that.state.futureSummary.cloneWithRows(futureSummary),
                            loaded: true
                        });
                    }
                  );
                },
                function (resp) {}
              );
          },
          function(error) {
              console.log('Failed to authenticate:' + error);
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
            <View style={Styles.row}>
              <Text numberOfLines={1} style={Styles.textStyle}>
                Welcome {that.props.userName}!
              </Text>
            </View>
            <View style={Styles.rowColor}>
              <Text numberOfLines={1} style={{color:'white'}}>
                Overdue Tasks
              </Text>
            </View>
            <ListView style={{flex: 1}}
                dataSource={that.state.overdueSummary}
                renderRow={this.renderRow} />
            <View style={Styles.rowColor}>
              <Text numberOfLines={1} style={{color:'white'}}>
                Due Today
              </Text>
            </View>
            <ListView style={{flex: 1}}
                dataSource={that.state.todaySummary}
                renderRow={this.renderRow} />
            <View style={Styles.rowColor}>
              <Text numberOfLines={1} style={{color:'white'}}>
                Due Later
              </Text>
            </View>
            <ListView style={{flex: 1}}
                dataSource={that.state.futureSummary}
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
                    id: 'TaskPage',
                    name: rowData['status'] + ' - ' + rowData['type'],
                    passProps: {type: rowData['type'], status: rowData['status']}
                  })
                }}>
                <ScrollView horizontal={true} contentContainerStyle={Styles.rowNoPad}>
                  <Text numberOfLines={1} style={Styles.textStyle} >
                   {rowData['type']}: {rowData['count']}
                  </Text>
                </ScrollView>
              </TouchableHighlight>
              <View style={Styles.cellBorder} />
          </View>
        );
    }
});

class MainPage extends Component {

  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }

  renderScene(route, navigator) {
    var that = this;
    return(
      <TaskList navigator={that.props.navigator} userName={that.props.userName} />
      );
  }
}

module.exports = MainPage;