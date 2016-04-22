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

var ContactInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows([]),
        loaded: false
    };
  },

  componentWillMount: function() {
    var that = this;
    var soql = 'SELECT Name,Email,Phone FROM Contact WHERE Id = \''
      +that.props.contactId+'\'';
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
            console.log(data);

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
                        passProps: { relatedId: this.props.contactId }})
                    }}>
                    <Icon name='note' size={25} style={Styles.listViewIcon}/>
                    <Text style={Styles.textStyle}>Notes</Text>
                    <Icon name='mode-edit' size={25}/>
                  </TouchableOpacity>
                  <View style={Styles.cellBorder} />
              </View>
            </ScrollView>
          </View>
      );
    },

    renderRow: function(rowData: Object) {
      console.log(rowData);
        if (rowData.substring(0,5) === 'Name:') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='person' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(6)};
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else if (rowData.substring(0,5) === 'Email') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='email' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(7)}
                    </Text>
                  </View>
                  <View style={Styles.cellBorder} />
              </View>
            );
        } else if (rowData.substring(0,5) === 'Phone') {
            return (
              <View>
                  <View style={Styles.row}>
                    <Icon name='phone' size={25} style={Styles.listViewIcon}/>
                    <Text numberOfLines={1} style={Styles.textStyle}>
                     {rowData.substring(7)}
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

class Contact extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
        <ContactInfo navigator={this.props.navigator} contactId={this.props.contactId}/>
    );
  }
}

module.exports = Contact;
