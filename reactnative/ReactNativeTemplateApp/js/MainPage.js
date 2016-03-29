'use strict';

var React = require('react-native');
var {
  Stylesheet,
  Component,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var Styles = require('./Styles.js');
var oauth = require('./react.force.oauth');

class MainPage extends Component {
  render() {
    return (
      <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <TouchableHighlight style={{backgroundColor: 'yellow', padding: 10}}
            onPress={this.gotoContactPage.bind(this)}>
          <Text>Contacts</Text>
        </TouchableHighlight>
      </View>
    );
  }
  gotoContactPage() {
    this.props.navigator.push({
      id: 'ContactPage',
      name: 'Contacts',
    });
  }
}

var onLogout = function() {
    oauth.logout();
}

// Nav bar components
var NavButton = React.createClass({
    render: function() {
        return (<View style={Styles.navBarElt}>
                  <TouchableOpacity onPress={() => this.props.onPress()}>
                    <Text style={Styles.navBarText}>{this.props.title}</Text>
                  </TouchableOpacity>
                </View>);
    }
});

var NavigationBarRouteMapper = {

  LeftButton(route, navigator, index, navState) {
    return (
      <View style={Styles.navButtonsGroup}>
        <NavButton title="Logout" onPress={() => onLogout()} />
      </View>
      /*<TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          Back
        </Text>
      </TouchableOpacity>*/
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

module.exports = MainPage;