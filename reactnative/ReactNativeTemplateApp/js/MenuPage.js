'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    PixelRatio,
    Navigator,
    TouchableOpacity,
    Component,
    TouchableHighlight,
    DrawerLayoutAndroid
} = React;

var forceClient = require('./react.force.net.js');
var oauth = require('./react.force.oauth');

var Styles = require('./Styles.js');
var MainPage = require('./MainPage');
var ContactPage = require('./ContactPage');
var Contact = require('./Contact');
var LeadPage = require('./LeadPage');
var OppPage = require('./OppPage');

class MenuPage extends Component {
  render() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>

        <Text style={Styles.drawerStyle}>Menu</Text>

        <TouchableOpacity
          style={Styles.menuButton}
          onPress={this.gotoMainPage.bind(this)}>
          <Text style={Styles.menuText}>Main</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.menuButton}
          onPress={this.gotoContactPage.bind(this)}>
          <Text style={Styles.menuText}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.menuButton}
          onPress={this.gotoLeadPage.bind(this)}>
          <Text style={Styles.menuText}>Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.menuButton}
          onPress={this.gotoOppPage.bind(this)}>
          <Text style={Styles.menuText}>Opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.menuButton}
          onPress={this.logout.bind(this)}>
          <Text style={Styles.menuText}>Logout</Text>
        </TouchableOpacity>

      </View>
    );
    return (
      <DrawerLayoutAndroid
            ref={(drawer) => { global.drawer = drawer}}
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
        <Navigator
          renderScene={(route, navigator) => this.renderScene(route, navigator)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar
                routeMapper={NavigationBarRouteMapper} />
          } />
      </DrawerLayoutAndroid>
    );
  }
  renderScene(route, navigator) {
    return null;
  }
  gotoMainPage() {
    this.props.navigator.push({
      id: 'MainPage',
      name: 'Main',
    });
  }
  gotoContactPage() {
    this.props.navigator.push({
      id: 'ContactPage',
      name: 'Contacts',
    });
  }
  gotoLeadPage() {
    this.props.navigator.push({
      id: 'LeadPage',
      name: 'Leads',
    });
  }
  gotoOppPage() {
    this.props.navigator.push({
      id: 'OppPage',
      name: 'Opportunities',
    });
  }
  logout() {
    oauth.logout();
  }
  static openDrawer() {
    global.drawer.openDrawer();
  }
}

module.exports = MenuPage;
