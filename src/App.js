import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import TextField from '@material-ui/core/TextField';

const App = () => {
  const viewer = useRef(null);
  const [data,setData]= useState([]);
  const [inst,setInst] = useState();
  let [jsondata,setJsondata] = useState(new Map());
  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        preloadWorker:'office',
        initialDoc:'/files/quote.docx'
      },
      viewer.current
    ).then( async (instance) => {
      //Bij deze code worden er features toegevoegd 
      //en specifiek wordt er hier een filepicker toegevoegd
      const { Feature } = instance.UI;
      instance.UI.enableFeatures([Feature.FilePicker]);
      
      //Hier gaan we de core bibliotheek van de webviewer gebruiken
      const { documentViewer } = instance.Core;
      //Hier wil ik de core in een globale variabele steken 
      //om dit te kunnen gebruiken over de hele file.
      setInst(documentViewer)

      //Hier gaan we luisteren naar het inladen van het document
        documentViewer.addEventListener('documentLoaded', async () => {
          //wanneer dit gebeurd is wordt de webviewer geupdate.
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();
          //hier gaan we de templatekeys ophalen van het document dus 
          //alles dat in  {{}} staat. 
          const doc = documentViewer.getDocument();
          const keys = doc.getTemplateKeys();
          //De keys worden hier gezet in een globale variabelen zodat 
          //we ze kunnen gebruiken in andere functies.
          //De setData zorgt ervoor dat de keys worden gebruikt voor de Textfield
          //De setJsonData gaan we gebruiken om de values toe te passen op het word document
          keys.then(value=>{
            setData(value);
            value.forEach(v=>setJsondata(jsondata.set(v,'{{'+v+'}}')));
          });
        });
    });
  },[]);

const handleChange = e => {
  let val = e.target.value;
  if(val.length == 0)
    val = "{{"+e.target.id+"}}"
  
  setJsondata(jsondata.set(e.target.id,val))
  applyValues(jsondata);
};

const applyValues= (values)=>{
  let j= {};
  [...values.keys()].map(k=>{
    j={...j,[k]:values.get(k)};
  });
  inst.getDocument().applyTemplateValues(j);
}

  return (
      <div className='App'>
        <div className='header'>React sample</div>
        <div className='container'>
          <div className='webviewer' ref={viewer}></div>
          <div className='variabele'>
            <p id='varTitle'>Variabelen</p>
            {data.map(el=>
              <TextField
                key={el}
                id={el}
                label={el}
                type="string"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange.bind(el)}
              />
            )}
          </div>
        </div>
      </div>
  );
};



export default App;
