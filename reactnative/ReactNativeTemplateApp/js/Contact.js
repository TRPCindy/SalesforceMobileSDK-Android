'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  ListView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;

var Styles = require('./Styles.js');
var forceClient = require('./react.force.net.js');

var ContactInfo = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
        dataSource: ds.cloneWithRows([]),
    };
  },

  componentDidMount: function() {
    var that = this;
    var soql = 'SELECT Id,Name,Email FROM Contact WHERE Id = \''
      +that.props.contactId+'\'';
    forceClient.query(soql,
      function(response) {
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
          });

      });
    },

    getDataSource: function(users: Array<any>): ListViewDataSource {
        return this.state.dataSource.cloneWithRows(users);
    },

    render: function() {
        return (
            <ListView style={Styles.scene}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow} />
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

class Contact extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
        <ContactInfo navigator={this.props.navigator} contactId={this.props.contactId}/>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return null;
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return null;
  }
};

module.exports = Contact;