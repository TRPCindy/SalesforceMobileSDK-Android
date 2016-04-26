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
        dataSourceNotes: ds.cloneWithRows([]),
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

              that.setState({
                  dataSource: that.state.dataSource.cloneWithRows(data)
              });
          }
        });

      var callback = (event) => {
          var soql = 'SELECT Id,Title,Body FROM Note WHERE ParentId = \''
            +that.props.contactId+'\'';
          forceClient.query(soql,
            function(response) {
                that.setState({
                    dataSourceNotes: that.state.dataSourceNotes.cloneWithRows(response.records)
                });

            });
        };
        callback();

        that.setState({
            loaded: true
        });

        // Observe focus change events from this component.
        this._listeners = [
          navigator.navigationContext.addListener('willfocus', callback)
        ];
    },

    componentWillUnmount: function() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
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
              <View style={Styles.row}>
                <Icon name='note' size={25} style={Styles.listViewIcon}/>
                <Text numberOfLines={1} style={Styles.textStyle}>
                  Notes
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigator.push({ id: 'CreateNote', name: 'New Note', 
                      passProps: { relatedId: this.props.contactId }})
                  }}>
                  <Icon name='add' size={30} style={{alignItems: 'flex-end', color: '#BCBCBC'}}/>
                </TouchableOpacity>
              </View>
              <View style={Styles.cellBorder} />
              <ScrollView>
                <ListView
                  dataSource={this.state.dataSourceNotes}
                  renderRow={this.renderRowNotes} />
              </ScrollView>
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
    },

    renderRowNotes: function(rowData: Object) {
      return (
        <View>
            <TouchableOpacity
              style={Styles.subrow}
              onPress={() => {
                this.props.navigator.push({
                  id: 'Note',
                  name: 'Note Details',
                  passProps: {noteId: rowData['Id'], relatedId: this.props.relatedId}
                })
              }}>
              <View style={Styles.rowLeftPad}>
                <Icon name='label-outline' size={25} style={{paddingRight: 8}}/>
                <Text numberOfLines={1} style={Styles.textStyle} >
                 {rowData['Title']}
                </Text>
                <Icon name='keyboard-arrow-right' size={25} />
              </View>
            </TouchableOpacity>
            <View style={Styles.cellBorder} />
        </View>
      );
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
