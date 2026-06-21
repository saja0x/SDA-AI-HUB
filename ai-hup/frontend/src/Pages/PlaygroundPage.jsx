import React, {useState} from 'react';
import ModelSwitcher from '../components/ModelSwitcher.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import ModelInstructions from '../components/ModelInstructions.jsx';
import SampleCodeBlock from '../components/SampleCodeBlock.jsx';
import Sparkle from '../assets/Sparkle.png';
import './PlaygroundPage.css'

function PlaygroundPage (){

  const [selectedModel, setSelectedModel] = useState('');


   return(
<div className='Chatpage'>

    <div className="upperSide"> {/*لكل الي فوق تبع العنوان والصوره والانواع */}
       
     <div className="upper2Side">    {/* عنوان توك هير وانواع الاي اي*/}
       <div className="upperTop"><img src={Sparkle}  alt="" className="logo"  /> <span className="brand">AI HUB </span></div>

      <div className="titleUp"> 
        <h1> PlayGround </h1></div>
        <div className="titleDown">
          <h2>Try The Ai Models here</h2></div>
        <ModelSwitcher selected={selectedModel} onSelect={setSelectedModel} />
     </div>
   
      <div className="upper3side">       {/* نوع الاي اي الحالي*/}

      </div> 
    </div>
    <div className='MainSide'>  {/* شات الشات بوت*/}
     {/*<div className="chatbotimg"> <img src="" alt="" className="chatbotimgxx" /> <span className="hello">Hey! Choose The Ai you want to use </span></div>*/}
  
      <ChatInterface model={selectedModel} /> 
    <div>
     <ModelInstructions model={selectedModel} />
     <SampleCodeBlock model={selectedModel}   />
    </div>
     
    <div className="mainmessage"></div>  {/* رساله للشات*/}

    </div>

  </div>
  )}
export default PlaygroundPage

{/* الصفحة الرئيسية تجمع كل المكونات في مكان واحد */ }