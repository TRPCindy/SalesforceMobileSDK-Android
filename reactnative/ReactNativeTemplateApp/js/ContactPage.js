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
  TouchableOpacity,
} = React;

var Styles = require('./Styles.js');
var forceClient = require('./react.force.net.js');
var oauth = require('./react.force.oauth');


var ContactList = React.createClass({
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
          dataSource: ds.cloneWithRows([]),
      };
    },
    
    componentDidMount: function() {
        var that = this;
        oauth.getAuthCredentials(
          function (resp){
            that.setState({userId: resp['userId']});
            console.log(that.state.userId);
            var soql = 'SELECT Id, Name FROM Contact WHERE Owner.Id = \''
              +that.state.userId+'\'';
            forceClient.query(soql,
              function(response) {
                  var users = response.records;
                  var data = [];
                  for (var i in users) {
                      data.push(users[i]["Name"]);
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
        return (
                <View>
                    <View style={Styles.row}>
                      <Text numberOfLines={1}>
                       {rowData}
                      </Text>
                    </View>
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
        <ContactList/>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          Back
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          What
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = ContactPage;