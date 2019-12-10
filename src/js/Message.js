import React from 'react'
import { st } from './Style.js'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

/*const Message = () => {
  return (
    <div className="content">
      <h1>Rexpack</h1>
      <p className="description">React, Express, and Webpack Boilerplate Application</p>
      <div className="awful-selfie"></div>
    </div>
  )
}*/

class Message extends React.Component {
  constructor(){
    super()
    this.state = {
      cnt: 0,
      pre: ""
    }

    setInterval(() => {
      this.setState({cnt: this.state.cnt + 1})
    }, 1000)
  }

  componentDidMount(){
    console.log(this.element.props.children[1]._owner.stateNode.state.pre = "pre")
  }

  render(){
    this.element = (<Tabs>
      <TabList>
        <Tab>Green</Tab>
        <Tab>Purple</Tab>
      </TabList>

      <TabPanel>
        <div style={st().por().w(240).h(240).bc("#afa")}>
          <div style={st().disp("flex").ai("center").jc("space-around").poa().t(Math.random()*200).l(Math.random()*200).w(40).h(40).bc("#ffa")}>
            {this.state.pre}
            {this.state.cnt}
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div style={st().por().w(240).h(240).bc("#faf")}>
          <div style={st().disp("flex").ai("center").jc("space-around").poa().t(Math.random()*200).l(Math.random()*200).w(40).h(40).bc("#ffa")}>
            {this.state.pre}
            {this.state.cnt}
          </div>
        </div>
      </TabPanel>
    </Tabs>)
    return(
      <div>
        {this.element}
      </div>
    )
  }
}

export default Message