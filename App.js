/**
 * PE-83 - List Headers are included in list item count when TalkBack is enabled
 * https://youilabs.atlassian.net/browse/PE-83
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  AccessibilityInfo,
  Platform, 
  StyleSheet, 
  Slider,
  Button,
  FlatList,
  Text, 
  View,
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const data = [...Array(10)];

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      accessible: false,
      minimumValue: 0,
      maximumValue: 100,
      step: 5,
      value: 50,
    };
  }

  componentDidMount() {
    AccessibilityInfo.addEventListener('change', (accessible) => this.setState({ accessible }));
    AccessibilityInfo.fetch().then((accessible) => this.setState({ accessible }));
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener('change', (accessible) => this.setState({ accessible }));
  }

  _onAccessibilityAction = (event) => {
    const { actionName } = event.nativeEvent;

    const { maximumValue, minimumValue, step, value } = this.state;

    let utterance = '';

    switch(actionName) {
      case 'increment':
        if (value < maximumValue) {
          this.setState({ value: value + step });
          utterance = `${value + step}`;
        }
        break;
      case 'decrement':
        if (value > minimumValue) {
          this.setState({ value: value - step });
          utterance = `${value - step}`;
        }
        break;
      default:
        utterance = `Accessibility action ${actionName}`;
        break;
    };

    AccessibilityInfo.announceForAccessibility(utterance);
  };

  renderList = ({ _item, index}) => {
    return (
      <View accessible>
        <Text>List {index + 1}</Text>
        <FlatList
          horizontal
          data={data}
          keyExtractor={item => "L" + item}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  };

  renderItem = ({ _item, index }) => {
    return (
      <View style={styles.item}>
        <Text>Item {index}</Text>
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text>Header</Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Text>Footer</Text>
      </View>
    );
  };

  getItemLayout = (_, index) => {
    return {
      length: 100,
      offset: 110 * index,
      index,
    };
  };

  render() {
    const { maximumValue, minimumValue, step, value } = this.state;

    const accessibilityText = this.state.accessible ? 'accessibility enabled' : 'accessibility disabled';

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>PE-83!</Text>
        <Text style={styles.instructions}>List Headers are included in list item count when TalkBack is enabled</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{
            alignItems: 'center',
            padding: 5,
          }}>
            <Text style={styles.welcome}>Accessibility Sample</Text>
            <Text style={styles.instructions}>{accessibilityText}</Text>
          </View>
          <Slider
            style={{ width: '100%' }}
            accessible
            accessibilityLabel={'Slider '}
            accessibilityRole={'adjustable'}
            accessibilityHint={`${value}`}  
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={this._onAccessibilityAction}
            maximumValue={maximumValue}
            minimumValue={minimumValue}
            value={value}
            step={step}
          />
          <View style={{ flex: 1 }}>
            <FlatList
              data={data}
              keyExtractor={item => "L" + item}
              renderItem={this.renderList}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 25,
          }}>
            <Button
              title={'1'}
              onPress={() => {AccessibilityInfo.announceForAccessibility('Button 1 was tapped')}}
              accessibilityLabel={'1'}
            />
            <Button
              title={'2'}
              onPress={() => {AccessibilityInfo.announceForAccessibility('Button 2 was tapped')}}
              accessibilityLabel={'2'}
            />
            <Button
              title={'3'}  
              onPress={() => {AccessibilityInfo.announceForAccessibility('Button 3 was tapped')}}
              accessibilityLabel={'3'}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  header: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: 'red',
  },
  footer: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: 'red',
  },
  item: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: 'green',
  },
});
