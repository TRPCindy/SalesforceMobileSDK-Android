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

var LeadList = React.createClass({
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
          dataSource: ds.cloneWithRows([]),
          loaded: false
      };
    },
    
    componentWillMount: function() {
      var that = this;
      var soql = 'SELECT Id, Name FROM Lead WHERE Owner.Id = \''
        +that.props.userId+'\'';
      forceClient.query(soql,
        function(response) {
            var leads = response.records;
            var data = [];
            for (var i in leads) {
                data.push(leads[i]);
            }
            console.log(data);

            that.setState({
                dataSource: that.getDataSource(data),
                loaded: true
            });

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
        var that = this;
        return (
          <View>
              <TouchableHighlight
                style={Styles.row}
                onPress={() => {
                  that.props.navigator.push({
                    id: 'Lead',
                    name: rowData['Name'],
                    passProps: {leadId: rowData['Id']}
                  })
                }}>
                <Text numberOfLines={1} style={Styles.textStyle} >
                 {rowData['Name']}
                </Text>
              </TouchableHighlight>
              <View style={Styles.cellBorder} />
          </View>
        );
    }
});

class LeadPage extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <LeadList navigator={this.props.navigator} userId={this.props.userId}/>
    );
  }
}

module.exports = LeadPage;