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
var Task = require('./Task');
var ContactPage = require('./ContactPage');
var Contact = require('./Contact');
var LeadPage = require('./LeadPage');
var Lead = require('./Lead');
var OppPage = require('./OppPage');
var Opportunity = require('./Opportunity');
var MetricsPage = require('./MetricsPage');


var App = React.createClass({

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            authenticated: false
        };
    },

    componentDidMount: function() {
        var that = this;
        oauth.authenticate(
            function() {
                that.setState({authenticated:true});
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
            },
            function(error) {
                console.log('Failed to authenticate:' + error);
            }
        );
    },

    renderScene: function(route, navigator) {
      var that = this;
      var routeId = route.id;
      console.log('Cindy');
      console.log(routeId);
      if (routeId === 'MainPage') {
        return (
          <MainPage navigator={navigator} userName={that.state.userName} />
        );
      }
      if (routeId === 'Task') {
        return (
          <Task navigator={navigator} taskId={route.passProps.taskId} />
        );
      }
      if (routeId === 'ContactPage') {
        return (
          <ContactPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Contact') {
        return (
          <Contact navigator={navigator} contactId={route.passProps.contactId} />
        );
      }
      if (routeId === 'LeadPage') {
        return (
          <LeadPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Lead') {
        return (
          <Lead navigator={navigator} leadId={route.passProps.leadId} />
        );
      }
      if (routeId === 'OppPage') {
        return (
          <OppPage navigator={navigator} userId={that.state.userId} />
        );
      }
      if (routeId === 'Opportunity') {
        return (
          <Opportunity navigator={navigator} oppId={route.passProps.oppId} />
        );
      }
      if (routeId === 'MetricsPage') {
        var curDat = [{date:'2016-04-13','pts':1, 'ast':2, 'reb':3, 'stl':4, 'blk':5, 'tov':6, 'min':7},
          {date:'2016-04-12','pts':9, 'ast':2, 'reb':6, 'stl':4, 'blk':5, 'tov':6, 'min':5}];
        return (
          <MetricsPage navigator={navigator} userId={that.state.userId} data={curDat} />
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
              <Icon.Button name="insert-chart" style={Styles.menuButton} color='#545454'
                  onPress={this.gotoMetricsPage}>
                  <Text style={Styles.menuText}>Agent Metrics</Text>
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

    gotoMetricsPage:function() {
      global.navigator.push({
        id: 'MetricsPage',
        name: 'Agent Metrics',
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
    if (route !== undefined && (route.id === 'Contact' || route.id === 'Lead' 
      || route.id === 'Opportunity' || route.id === 'Task')) {
      
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
