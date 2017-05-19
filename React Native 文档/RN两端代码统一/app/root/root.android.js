'use strict';

import React from 'react';
import { Navigator } from 'react-native';
import ServiceCenter from '../pages/service';
import PresentSettlement from '../pages/present-settlement';
import PresentOrder from '../pages/present-order';
import PresentOrderCommited from '../pages/present-order-commited';

export default class BenlaiLife extends React.Component {
    render() {
        let initPage;
        let params = {};

        switch (this.props.componentNumber){
            case 111:
                initPage = ServiceCenter;
                break;
            case 112:
                initPage = PresentOrder;
                break;
            case 113:
                initPage = PresentSettlement;
                params = {...this.props};
                break;
            case 114:
                initPage = PresentOrderCommited;
                params = {...this.props};
                break;
        }

        return (
            <Navigator
                style= {{flex: 1}}
                initialRoute= {{
                    component: initPage,
                    params: params
                }}  
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    if(route.component) {
                        return <Component {...route.params} navigator={navigator} />
                    }
                }} 
            />
        );
    }
}