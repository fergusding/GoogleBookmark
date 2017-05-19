'use strict';

import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  NativeModules
} from 'react-native';
import NavBar from '../component/navigator';
import Button from '../component/button';
import ServiceRequest from '../request/service-request';
import Native from '../native/native';

export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      feedback: 0         // 0-未选择，1-有帮助，2-没帮助
    };
  }
  componentDidMount() {
    this._fetchFAQDetail();
  }
  render() {
    return (
      <View style = {styles.container}>
        <NavBar title = '客服中心' onBackPress = {() => this.props.navigator.pop()} />
        <ScrollView style = {styles.scrollview} automaticallyAdjustContentInsets = {false}>
          {this.renderAnswer()}
          {this.renderUnresolvedView()}
        </ScrollView>
      </View>
    );
  }
  renderAnswer() {
    return (
      <View style = {styles.answer_container}>
        {this.renderAnswerHeader()}
        <View style = {styles.answer_header_seperator} />
        {this.renderAnswerBody()}
        <View style = {styles.answer_footer_seperator} />
        {this.renderAnswerFooter()}
      </View>
    );
  }
  renderAnswerHeader() {
    return (
      <View style = {styles.answer_header}>
        <Image source = {require('../img/wenhao.png')} style = {styles.answer_header_image}/>
        <Text style = {styles.answer_header_text}>{this.state.data.Title}</Text>
      </View>
    );
  }
  renderAnswerBody() {
    return (
      <View style = {styles.answer_body}>
        <Text style = {styles.answer_body_text}>{this.state.data.Content}</Text>
      </View>
    );
  }
  renderAnswerFooter() {
    var goodImageSource = this.state.feedback == 1 ? require('../img/good_enable.png') : require('../img/good_disable.png');
    var badImageSource = this.state.feedback == 2 ? require('../img/bad_enable.png') : require('../img/bad_disable.png');
    var disabled = this.state.feedback != 0 ? true : false;
    return (
      <View style = {styles.answer_footer}>
        <Text style = {[styles.answer_footer_text, styles.gray_text]}>是否对您有帮助:</Text>
        <View style = {styles.answer_footer_help}>
          <Text style = {styles.gray_text}>有帮助</Text>
          <Button disabled = {disabled} onPress = {() => this._feedbackFAQ(true)}>
            <Image source = {goodImageSource} style = {[styles.answer_footer_image, {marginBottom: 8}]}/>
          </Button>
        </View>
        <View style = {[styles.answer_footer_help, {marginRight: 10}]}>
          <Text style = {styles.gray_text}>没帮助</Text>
          <Button disabled = {disabled} onPress = {() => this._feedbackFAQ(false)}>
            <Image source = {badImageSource} style = {[styles.answer_footer_image, {marginTop: 8}]} />
          </Button>
        </View>
      </View>
    );
  }
  renderUnresolvedView() {
    return (
      <View style = {styles.unresolved_view}>
        <Text style = {[styles.unresolved_text, styles.gray_text]}>还没解决您的问题?</Text>
        <Button onPress = {() => Native.quickServicePressed(2, 110, '')}>
          <View style = {styles.unresolved_right}>
            <Image source = {require('../img/answer.png')} style = {styles.unresolved_right_image} />
            <Text style = {styles.unresolved_right_text}>向我提问</Text>
          </View>
        </Button>
      </View>
    );
  }
  async _fetchFAQDetail() {
    var catalogSysNo = this.props.catalogSysNo;
    var contentSysNo = this.props.contentSysNo;
    ServiceRequest.fetchFAQDetail(catalogSysNo, contentSysNo, (data) => {
      this.setState({
        data: data
      });
    });
  }
  async _feedbackFAQ(flag) {
    var contentSysNo = this.props.contentSysNo;
    ServiceRequest.feedbackFAQ(contentSysNo, flag, (data) => {
      var feedback = flag ? 1 : 2;
      this.setState({ feedback: feedback });
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollview: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f2f2f2'
  },
  answer_container: {
    marginTop: 13,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  answer_header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  },
  answer_header_image: {
    marginLeft: 10,
    width: 25,
    height: 25
  },
  answer_header_text: {
    marginLeft: 7,
    color: '#333333',
    fontSize: 18
  },
  answer_header_seperator: {
    marginTop: 0,
    backgroundColor: '#dddddd',
    height: 0.5
  },
  answer_body: {
  },
  answer_body_text: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    color: '#333333',
    fontSize: 15
  },
  answer_footer_seperator: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 46,
    backgroundColor: '#e5e5e5',
    height: 0.5
  },
  answer_footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70
  },
  answer_footer_text: {
    marginLeft: 10
  },
  answer_footer_help: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  answer_footer_image: {
    marginLeft: 10,
    width: 25,
    height: 25
  },
  unresolved_view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    marginLeft: 10,
    marginRight: 10,
    height: 67,
    borderRadius: 3,
    backgroundColor: 'white'
  },
  unresolved_text: {
    marginLeft: 10
  },
  unresolved_right: {
    marginRight: 18,
    flexDirection: 'row',
    alignItems: 'center'
  },
  unresolved_right_image: {
    width: 20,
    height: 20
  },
  unresolved_right_text: {
    marginLeft: 15,
    color: '#abd13d',
    fontSize: 15
  },
  gray_text: {
    color: '#888888',
    fontSize: 15
  }
});
