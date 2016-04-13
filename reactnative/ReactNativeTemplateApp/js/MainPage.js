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
        overdue: ds.cloneWithRows([]),
        today: ds.cloneWithRows([]),
        future: ds.cloneWithRows([]),
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
                  var soql = 'SELECT Subject,ActivityDate FROM Task WHERE OwnerId = \''
                    +that.state.userId+ '\' and IsClosed = false';
                  forceClient.query(soql,
                    function(response) {
                        var todayStart = new Date();
                        todayStart.setHours(0,0,0,0);
                        var todayEnd = new Date();
                        todayEnd.setHours(23,59,59,999);
                        console.log(today);
                        var overdue = [];
                        var today = [];
                        var future = [];
                        response.records.forEach(function(item) {
                          var taskDate = new Date(item['ActivityDate']);
                          if (taskDate < todayStart) {
                            overdue.push(item);
                          } else if (taskDate > todayEnd) {
                            future.push(item);
                          } else {
                            today.push(item);
                          }
                        });
                        that.setState({
                            overdue: that.state.overdue.cloneWithRows(overdue),
                            today: that.state.today.cloneWithRows(today),
                            future: that.state.future.cloneWithRows(future),
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
                dataSource={that.state.overdue}
                renderRow={this.renderRow} />
            <View style={Styles.rowColor}>
              <Text numberOfLines={1} style={{color:'white'}}>
                Due Today
              </Text>
            </View>
            <ListView style={{flex: 1}}
                dataSource={that.state.today}
                renderRow={this.renderRow} />
            <View style={Styles.rowColor}>
              <Text numberOfLines={1} style={{color:'white'}}>
                Due Later
              </Text>
            </View>
            <ListView style={{flex: 1}}
                dataSource={that.state.future}
                renderRow={this.renderRow} />
          </ScrollView>
        </View>
      );
    },

    renderRow: function(rowData: Object) {
        return (
          <View>
              <ScrollView horizontal={true} contentContainerStyle={Styles.row}>
                <Text numberOfLines={1} style={Styles.textStyle}>
                 {rowData['Subject']}
                </Text>
              </ScrollView>
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

  // CINDY: have a red flag beside Priority tasks
  renderScene(route, navigator) {
    var that = this;
    return(
      <TaskList userName={that.props.userName} />
      );
  }
}

module.exports = MainPage;