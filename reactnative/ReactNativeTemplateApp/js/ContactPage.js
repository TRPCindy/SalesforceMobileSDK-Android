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
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');

var ContactList = React.createClass({

    componentDidMount: function() {
      var that = this;
      oauth.getAuthCredentials(
        function (resp){
          that.setState({userId: resp['userId']});
          var soql = 'SELECT Id, Name FROM Contact WHERE Owner.Id = \''
            +that.state.userId+'\'';
          forceClient.query(soql,
            function(response) {
                var contacts = response.records;
                var data = [];
                for (var i in contacts) {
                    data.push(contacts[i]);
                }
                console.log(data);

                that.setState({
                    dataSource: that.getDataSource(data),
                });

            });
        }, 
        function (resp) {}
      );
    },

    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
          dataSource: ds.cloneWithRows([]),
      };
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
      var curName = rowData['Name'];
      return (
        <View>
            <TouchableHighlight
              style={Styles.row}
              onPress={() => {
                this.props.navigator.push({
                  id: 'Contact',
                  name: rowData['Name'],
                  passProps: {contactId: rowData['Id']}
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

class ContactPage extends Component {
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
        <ContactList navigator={this.props.navigator}/>
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

module.exports = ContactPage;