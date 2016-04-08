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

    //CINDY: cannot keep getAuthCredentials in index
  // app crashes when user not logged in!
  // find way to check if user logged in, or migrate auth to other classes

    /*componentDidMount: function() {
      var that = this;
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
    },*/

    renderScene: function(route, navigator) {
      var that = this;
      var routeId = route.id;
      if (routeId === 'MainPage') {
        if (that.state !== null) {
          return (
            <MainPage navigator={navigator}/>
          );
        }
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
            <View style={{marginTop:20}}>
              <TouchableHighlight
                style={Styles.menuButton}
                onPress={this.gotoMainPage}>
                <Text style={Styles.menuText}>Home</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={Styles.menuButton}
                onPress={this.gotoContactPage}>
                <Text style={Styles.menuText}>Contacts</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={Styles.menuButton}
                onPress={this.gotoLeadPage}>
                <Text style={Styles.menuText}>Leads</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={Styles.menuButton}
                onPress={this.gotoOppPage}>
                <Text style={Styles.menuText}>Opportunities</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={Styles.menuButton}
                onPress={this.logout}>
                <Text style={Styles.menuText}>Logout</Text>
              </TouchableHighlight>
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
                  ref = {(navigator) => global.navigator = navigator}
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
