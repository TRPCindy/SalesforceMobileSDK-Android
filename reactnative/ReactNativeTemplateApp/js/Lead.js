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

var LeadInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows([]),
        loaded: false
    };
  },

  componentWillMount: function() {
    var that = this;
    var soql = 'SELECT Name,Email,Phone,Status,LeadSource FROM Lead WHERE Id = \''
      +that.props.leadId+'\'';
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
              <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} 
                onPress={() => {
                  this.props.navigator.push({ id: 'CreateNote', name: 'New Note', 
                    passProps: { relatedId: this.props.leadId }})
                }}>
                <Text>Create</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
      );
    },

    renderRow: function(rowData: Object) {
      console.log(rowData);
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
});

class Lead extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <LeadInfo navigator={this.props.navigator} leadId={this.props.leadId}/>
    );
  }
}

module.exports = Lead;