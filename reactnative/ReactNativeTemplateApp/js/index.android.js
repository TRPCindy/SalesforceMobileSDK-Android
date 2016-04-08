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

var Icon = require('react-native-vector-icons/MaterialIcons');

var Styles = require('./Styles.js');
var MainPage = require('./MainPage');
var ContactPage = require('./ContactPage');
var Contact = require('./Contact');
var LeadPage = require('./LeadPage');
var OppPage = require('./OppPage');



var App = React.createClass({

    renderScene: function(route, navigator) {
      var that = this;
      var routeId = route.id;
      if (routeId === 'MainPage') {
        return (
          <MainPage navigator={navigator}/>
        );
      }
      if (routeId === 'ContactPage') {
        return (
          <ContactPage navigator={navigator} />
        );
      }
      if (routeId === 'Contact') {
        return (
          <Contact navigator={navigator} contactId={route.passProps.contactId} />
        );
      }
      if (routeId === 'LeadPage') {
        return (
          <LeadPage navigator={navigator} />
        );
      }
      if (routeId === 'OppPage') {
        return (
          <OppPage navigator={navigator} />
        );
      }
    },

    render: function() {
        var that = this;
        var navigationView = (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View>
              <View style={Styles.menuTitle}>
                <Icon name='phone-android' size={18} 
                  style={{color: 'white', marginLeft: 10, marginTop: 53}}/>
                <Text style={Styles.menuTitleText}>Agent App</Text>
              </View>
              <Icon.Button name="home" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoMainPage}>
                  <Text style={Styles.menuText}>Home</Text>
              </Icon.Button>
              <Icon.Button name="account-box" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoContactPage}>
                  <Text style={Styles.menuText}>Contacts</Text>
              </Icon.Button>
              <Icon.Button name="adjust" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoLeadPage}>
                  <Text style={Styles.menuText}>Leads</Text>
              </Icon.Button>
              <Icon.Button name="assignment" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoOppPage}>
                  <Text style={Styles.menuText}>Opportunities</Text>
              </Icon.Button>
              <View style={Styles.cellBorder} />
              <Icon.Button name="exit-to-app" style={Styles.menuButton} color='#545454'
                  onPress={this.logout}>
                  <Text style={Styles.menuText}>Logout</Text>
              </Icon.Button>
            </View>
          </View>
        );
        return (
          <DrawerLayoutAndroid
            ref={(drawer) => { global.drawer = drawer}}
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
            <Navigator
                ref={(navigator) => global.navigator = navigator}
                style={Styles.container}
                initialRoute={{
                  id: 'MainPage', 
                  name: 'Home'
                }}
                renderScene={(route, navigator) => this.renderScene(route, navigator)}
                configureScene={(route) => {
                  if (route.sceneConfig) {
                    return route.sceneConfig;
                  }
                  return Navigator.SceneConfigs.FadeAndroid;
                }}
                navigationBar={
                    <Navigator.NavigationBar
                      routeMapper={NavigationBarRouteMapper}
                      style={Styles.navBar} />
                }
              />
          </DrawerLayoutAndroid>
        );
    },

    gotoMainPage: function() {
      global.navigator.push({
        id: 'MainPage',
        name: 'Home',
      });
      closeDrawer();
    },

    gotoContactPage: function() {
      global.navigator.push({
        id: 'ContactPage',
        name: 'Contacts',
      });
      closeDrawer();
    },

    gotoLeadPage:function() {
      global.navigator.push({
        id: 'LeadPage',
        name: 'Leads',
      });
      closeDrawer();
    },

    gotoOppPage:function() {
      global.navigator.push({
        id: 'OppPage',
        name: 'Opportunities',
      });
      closeDrawer();
    },

    logout:function() {
      oauth.logout();
      closeDrawer();
    }
});

var openDrawer =function() {
    global.drawer.openDrawer();
  }
var closeDrawer = function() {
    global.drawer.closeDrawer();
  }

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (route !== undefined && route.id === 'Contact') {
      var routes = navigator.getCurrentRoutes();
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => {
            navigator.pop()
          }}>
          <Icon name='arrow-back' size={30} 
              style={{color: 'white', marginLeft: 10, marginBottom: 8}}/>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
        onPress={() => {
          openDrawer()
        }}>
        <Icon name='list' size={30} 
          style={{color: 'white', marginLeft: 10, marginBottom: 8}}/>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
      return null;
  },

  Title: function(route, navigator, index, navState) {
      if (route === undefined) return;
      return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 16}}>
            {route.name}
          </Text>
        </TouchableOpacity>
      );
  },
};


AppRegistry.registerComponent('ReactNativeTemplateApp', () => App);
