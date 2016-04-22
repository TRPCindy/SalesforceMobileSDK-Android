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

var NoteList = React.createClass({

    componentWillMount: function() {
      var that = this;
      var soql = 'SELECT Id,Title,Body FROM Note WHERE ParentId = \''
        +that.props.relatedId+'\'';
      forceClient.query(soql,
        function(response) {
            that.setState({
                dataSource: that.getDataSource(response.records),
                loaded: true
            });

        });
    },

    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
          dataSource: ds.cloneWithRows([]),
          loaded: false
      };
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
      return (
        <View>
            <TouchableHighlight
              style={Styles.row}
              onPress={() => {
                this.props.navigator.push({
                  id: 'Note',
                  name: 'Note Details',
                  passProps: {noteId: rowData['Id'], relatedId: this.props.relatedId}
                })
              }}>
              <View style={Styles.flowRight}>
                <Text numberOfLines={1} style={Styles.textStyle} >
                 {rowData['Title']}
                </Text>
                <Icon name='keyboard-arrow-right' size={25} />
              </View>
            </TouchableHighlight>
            <View style={Styles.cellBorder} />
        </View>
      );
    }
});

class NotePage extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <NoteList navigator={this.props.navigator} relatedId={this.props.relatedId} />
    );
  }
}

module.exports = NotePage;
