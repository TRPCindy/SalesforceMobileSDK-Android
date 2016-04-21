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
  TouchableOpacity,
  Image
} = React;

var Styles = require('./Styles.js');
var forceClient = require('./react.force.net.js');
var GiftedSpinner = require('react-native-gifted-spinner');
var Icon = require('react-native-vector-icons/MaterialIcons');

var OppInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows([]),
        loaded: false
    };
  },

  componentWillMount: function() {
    var that = this;
    var soql = 'SELECT Id,Name,Account.Name,Type,Description,StageName,LeadSource,Probability FROM Opportunity WHERE Id = \''
      +that.props.oppId+'\'';
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
              <View>
                  <TouchableOpacity style={Styles.row} 
                    onPress={() => {
                      this.props.navigator.push({ id: 'NotePage', 
                        name: 'Notes', 
                        passProps: { relatedId: this.props.oppId }})
                    }}>
                    <Text >Notes</Text>
                  </TouchableOpacity>
                  <View style={Styles.cellBorder} />
              </View>
            </ScrollView>
          </View>
      );
    },

    renderRow: function(rowData: Object) {
      console.log(rowData);
      if (rowData.substring(0,3) === 'Id:') {
          return null;
      } else if (rowData.substring(0,5) === 'Name:') {
          return (
            <View>
                <View style={Styles.row}>
                  <Icon name='person' size={25} style={Styles.listViewIcon}/>
                  <Text numberOfLines={1} style={Styles.textStyle}>
                   {rowData.substring(6)}
                  </Text>
                </View>
                <View style={Styles.cellBorder} />
            </View>
          );
      } else if (rowData.substring(0,5) === 'Type:') {
          return (
            <View>
                <View style={Styles.row}>
                  <Icon name='business' size={25} style={Styles.listViewIcon}/>
                  <Text numberOfLines={1} style={Styles.textStyle}>
                   {rowData.substring(6)}
                  </Text>
                </View>
                <View style={Styles.cellBorder} />
            </View>
          );
      } else if (rowData.substring(0,10) === 'LeadSource') {
          return (
            <View>
                <View style={Styles.row}>
                  <Icon name='web' size={25} style={Styles.listViewIcon}/>
                  <Text numberOfLines={1} style={Styles.textStyle}>
                   {rowData.substring(12)}
                  </Text>
                </View>
                <View style={Styles.cellBorder} />
            </View>
          );
      } else if (rowData.substring(0,9) === 'StageName') {
          return (
            <View>
                <View style={Styles.row}>
                  <Icon name='timeline' size={25} style={Styles.listViewIcon}/>
                  <Text numberOfLines={1} style={Styles.textStyle}>
                   {rowData.substring(11)}
                  </Text>
                </View>
                <View style={Styles.cellBorder} />
            </View>
          );
      } else if (rowData.substring(0,11) === 'Probability') {
          return (
            <View>
                <View style={Styles.row}>
                  <Image
                    style={Styles.listViewImageIcon}
                    source={require('../res/probability.png')}
                  />
                  <Text numberOfLines={1} style={Styles.textStyle}>
                   {rowData.substring(13)}%
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

class Opportunity extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <OppInfo navigator={this.props.navigator} oppId={this.props.oppId}/>
    );
  }
}

module.exports = Opportunity;
