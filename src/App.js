import logo from './logo200.png';
import './App.css';
import { Button, Image, Container, Row, Col, OverlayTrigger, Tooltip, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { GearFill, XCircle } from 'react-bootstrap-icons'

const ws = new WebSocket('ws://localhost:12381')
ws.onopen = ()=>{
  ws.send("chains list")
}
ws.onmessage = console.log

const colors = ["#400150", "#5C0272", "#4E0161", "#31013D", "#210029"];
//const colors = ["#7e2e84ff", "#f9f5e3ff","#d14081ff", "#ef798aff",  "#ccf5acff"]

const ignoreSubmit = (event)=>{
  console.log(event.target.value);
  event.preventDefault();
}

function FreechainsButton(){
  return (
    <OverlayTrigger
    placement="right"
    overlay={<Tooltip id="button-tooltip-2">Freechains</Tooltip>}
  >
    <Button onClick={()=>{console.log("x")}} style={{width: "60px", "margin": "0", "padding": "0px 0px 0px 0px", "background-color": "rgb(141, 111, 169)", "border": "none", "border-radius": "45px"}}>
            <Image src={logo} className="App-logo" alt="logo" fluid style={{"margin": "0px 0px 0px 0px"}} />
    </Button>
  </OverlayTrigger>)
}

function Forum_Block({author_name, payload, pic}){
  return <>
      <Image src={pic} style={{width: "100px", "float": "left", "margin": "20px"}}/>
      <p style={{"float": "left"}}>{author_name}</p>
      <p style={{"float": "left"}}> Filler</p>
    <hr style={{"width": "100%"}}/>
  </>
}

function CommandLine({host}){
  return (<InputGroup className="mb-2">
    <InputGroup.Text style={{"background-color": "black", "border-color": "black", "color": "white"}}>{host + " ~ %"}</InputGroup.Text>
    <Form.Control as="input" placeholder={"▌"} style={{"background-color": "black", "border-color": "black", "color": "white"}}/>
  </InputGroup>)
}

function Forum_Page({chain, settings}){
  return <>
    <div style={{
      width: "100%",
      "float": "left",
      "display": "block",
      "margin": "10px",
      "background-color": colors[2],
      "border-radius": "10px",
    }}>
    <h3>{chain}</h3>
    <Forum_Block author_name="Francisco Sant'anna" pic={"https://serrapilheira.org/wp-content/uploads/2020/03/Francisco-SantaAnna.jpg"}/>
    <Forum_Block author_name="Micah Kendall" pic={"https://avatars.githubusercontent.com/u/66159982?v=4"}/>
    </div>
    <Form style={{width:"100%", position: "absolute", "bottom": "10px", "padding": "20px"}} onSubmit={ignoreSubmit}>
      <Form.Control as="input" placeholder="Formulate a reply" />
      {settings.command_line_enabled && <CommandLine host={settings.local_host.name+"@localhost"}/>}
    </Form>
  </>
}

function Midbar({setPage, page}){
  return <div style={{"background-color": colors[0], "width":"200px", "height":"100%", "display": "inline", "float": "left"}}>
    <b>{page}</b><br/>
    <Button onClick={()=>{setPage("/settings/"+page)}}><GearFill/></Button>
  </div>
}

function Sidebar({setPage}){
  // For demo purposes
  // I would like to add support for image icons to chains, not sure what the protocol should be though :). I will think!
  const chains_list = ["$chat", "#sports", "$friends", "$a", "$b", "$c", "$d", "$e", "$f"];
  return (<div style={{"background-color": colors[3], "width":"90px", "height":"100%", "display": "inline", "float": "left", overflow: "scroll", "scrollbar-width": "thin"}}>
          <div style={{"position": "relative", "right":"0px"}}>
          <b>DEMO</b>
          <FreechainsButton/>
          <hr style={{border: "3px solid grey", "background-color": "grey", "border-radius": "5px", "margin-left": "20px", "margin-right": "20px"}}/>
          {chains_list.map((chain_name)=>{
            return     <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="button-tooltip-2">{chain_name}</Tooltip>}
          ><Button
            variant="secondary"
            style={{
              width: "100%",
              "border-radius": "45px",
              "margin-bottom": "20px",
              "margin-left": "10px",
              "margin-right": "10px",
              "width": "70px",
              "height": "70px",
              "font-weight": "bold",
              "font-size": "25px",
              "text-align": "center",
            }}
            onClick={()=>{setPage("/chain/"+chain_name)}}
            >{chain_name.substring(0,3)}
            </Button></OverlayTrigger>
          })}
          </div>
  </div>)
}

function ConfigArea({settings}){
  return <div style={{width: "100%", "margin": "80px"}}>
    <h3 style={{width: "100%"}}>Connection Details</h3>
          <Form onSubmit={ignoreSubmit} style={{width: "100%"}}>
            <Form.Label>Passphrase</Form.Label>
            <Form.Control style={{width: "100%"}} as="input" placeholder="A secure key only you know"/>
          </Form>
        </div>
}

function App() {
  const [settings, update_settings] = useState({
    defaultValue: {
      command_line_enabled: true,
      local_host:{name: "micahkendall"},
    },
  });
  const [page, setPage] = useState("/chain/$chat");
  const passthrough = {setPage: setPage, settings: settings, page: page};
  return (
    <div className="App" style={{height: 100}}>
      <header className="App-header" style={{height: "100%", width: "100%"}}>
      <div style={{"flex-direction": "row", "display": "flex", "float": "left", "height": "100%", "width": "100%"}}>
        {page.substring(0,7)=="/chain/" && <>
        <Sidebar {...passthrough}/>
        <Midbar {...passthrough}/>
        <div style={{
        "background-color": colors[1],
        position: "relative",
        "flex": "1",
        "flex-grow":"1",
        "width": "100px",
        "height":"100%",
        "display": "flex",
        "float": "left",
        "border-top-right-radius": "20px",
        "border-bottom-right-radius": "20px"
        }}>
        {page.substring(0,8)=="/chain/$" && <Forum_Page chain={page.substring(7)} {...passthrough}/>}
        </div>
        </>}
        {page.substring(0,10)=="/settings/" && <div style={{width: "100%", "border-top-right-radius": "20px", "border-bottom-right-radius": "20px", "background-color": colors[1]}}>
          <div style={{"background-color": colors[0], "width":"200px", "height":"100%", "display": "inline", "float": "left"}}>
            
          </div>
          <div style={{top: "0px", left: "200px", position:"absolute", width:"100%", "padding-right": "400px"}}>
            <ConfigArea {...passthrough}/>
          </div>
            <XCircle color="red" style={{position: "absolute", "right": "20px", "top": "20px"}} onClick={()=>{setPage(page.substring(10))}}/>
        </div>}
      </div>
      </header>
    </div>
  );
}

export default App;
