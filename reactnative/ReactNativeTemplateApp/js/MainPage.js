'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;

var Styles = require('./Styles.js');
var oauth = require('./react.force.oauth');
var forceClient = require('./react.force.net.js');

class MainPage extends Component {

  //CINDY: figure out how to call this after user logs in
  // 
  /*componentWillMount() {
    var that = this;
    var soql = 'SELECT Name FROM User limit 1';
    forceClient.query(soql,
      function(response) {
        oauth.getAuthCredentials(
          function (resp){
            that.setState({userId: resp['userId']});
            var soql = 'SELECT Name FROM User WHERE Id = \''
              +that.state.userId+'\' limit 1';
            forceClient.query(soql,
              function(response) {
                  var user = response.records[0];
                  that.setState({userName: user['Name']});
              }
            );
          }, 
          function (resp) {}
        );
      }
    );
  }*/

  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    var that = this;
    var userName = '';
    if (that.props !== null) {
      userName = that.props.userName;
    }
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
          <Text style={Styles.textStyle}>Welcome {userName}!</Text>
      </View>
    );
  }
}

module.exports = MainPage;