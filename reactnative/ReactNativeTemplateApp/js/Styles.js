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
    Component
} = React;


var Styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    textStyle: {
        color: '#545454'
    },
    navBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#246dd5'
    },
    navBarText: {
        fontSize: 18,
    },
    navButtonsGroup: {
        flex: 1,
        alignItems:'center',
        flexDirection: 'row',
    },
    navBarElt: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        margin: 2,
    },
    scene: {
        flex: 1,
        paddingTop: 50,
    },
    row: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 12,
    },
    rowNoPad: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    rowColor: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#246dd5',
        flexDirection: 'row',
        padding: 14,
    },
    cellBorder: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // Trick to get the thinest line the device can display
        height: 1 / PixelRatio.get(),
        marginLeft: 4,
    },
    drawerStyle: {
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
        paddingBottom: 12
    },
    menuTitle: {
        height: 90,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#246dd5',
        alignSelf: 'stretch'
    },
    menuTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 50,
        color: 'white'
    },
    menuButton: {
        height: 50,
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignSelf: 'stretch'
    },
    menuText: {
        fontSize: 16,
        marginLeft: 40,
        color: '#545454'
    },
    chartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    chart: {
        position: 'absolute',
        top: 16,
        left: 4,
        bottom: 4,
        right: 16,
    }
});

module.exports = Styles;