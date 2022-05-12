import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import TextField from '@material-ui/core/TextField';

const App = () => {
  const viewer = useRef(null);
  const [data,setData]= useState([]);
  const [inst,setInst] = useState();
  let [jsondata,setJsondata] = useState(new Map());
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        preloadWorker:'office',
        initialDoc:'/files/quote.docx'
      },
      viewer.current
    ).then( async (instance) => {
      const { Feature } = instance.UI;
      instance.UI.enableFeatures([Feature.FilePicker]);
      const { documentViewer } = instance.Core;
      setInst(documentViewer)
        documentViewer.addEventListener('documentLoaded', async () => {
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();
          const doc = documentViewer.getDocument();
          const keys = doc.getTemplateKeys();
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
            <div className='varTextField'>
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
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default App;
